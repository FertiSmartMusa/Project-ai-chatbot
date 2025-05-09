//chatscreen.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView,Alert,} from "react-native";
import { Appbar, Menu, Divider, PaperProvider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/NavigationTypes";
import { auth, db } from "../services/firebase";
import { ref, push, onValue } from "firebase/database";
import { sendMessageToGemini } from "../services/googleai";
//import { sendMessageToOpenAI } from "../services/openai";
import { parseEventFromAIResponse  } from "../utils/parseEventFormAI";

import { ChatMessage } from "../types/ChatTypes";
import { format } from "date-fns";
import * as Calendar from "expo-calendar";
import { calendarKeywords } from "../types/keywords";

type ChatScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Chat"
>;

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<ChatScreenNavigationProp>();

  const userEmail = auth.currentUser?.email || "";
  const safeEmail = userEmail.replace(/\./g, "_");

  const formattedTimestamp = format(new Date(), "yyyy-MM-dd'T'HH-mm-ss");
  const newChatId = `chat_${formattedTimestamp}`;
  const [chatRef, setChatRef] = useState(ref(db, `chats/${safeEmail}/${newChatId}`));
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allMessages = Object.values(data) as ChatMessage[];
        setMessages(allMessages);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [chatRef]);

  //--Scroll end 
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  //--Calendar permission
  async function checkCalendarPermission(): Promise<boolean> {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Calendar permission not granted.");
      return false;
    }
    return true;
  }

  //-------------------------------------
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { text: input, sender: "user" };
    setInput("");
    await push(chatRef, userMsg);

    const inputLower = input.toLowerCase();

    const matchedKeyword = calendarKeywords.find(entry =>
      entry.keywords.some(kw => inputLower.includes(kw))
    );

    let reply = "";
   
    //-- if found keyword
    if (matchedKeyword) {
      const prompt = matchedKeyword.prompt(input);
      reply = await sendMessageToGemini(prompt);

      console.log(reply);  //write concole
      
      const eventData = parseEventFromAIResponse(reply);
  
      if (eventData) {
        const hasPermission = await checkCalendarPermission();
        if (!hasPermission) return;

        if (eventData.action === "add_event" && eventData.title && eventData.date) { //--add event
  
          const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
          const defaultCalendar = calendars.find(cal => cal.source?.name) || calendars[0];
  
          await Calendar.createEventAsync(defaultCalendar.id, {
            title: eventData.title,
            startDate: eventData.date,
            endDate: new Date(eventData.date.getTime() + 60 * 60 * 1000),
            timeZone: "Europe/Istanbul",
            alarms: [
              {
                relativeOffset: -10, 
                method: Calendar.AlarmMethod.ALERT,
              },
            ],  
            //location: eventData.location,   
            //notes: eventData.notes,         
            //url: eventData.url,              
            //allDay: eventData.allDay || false,
          });
  
          const confirmMsg: ChatMessage = {
            text: `"${eventData.title}" our event titled ${eventData.date.toLocaleDateString()} ${eventData.date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}' was added to the calendar.`,
            sender: "bot",
          };
          await push(chatRef, confirmMsg);
          return;
  

        } else if (eventData.action === "list_events") {  //--list event
        
          const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
          const defaultCalendar = calendars.find(cal => cal.source?.name) || calendars[0];
  
          let events: Calendar.Event[] = [];
          if (eventData.date) {
            const startOfDay = new Date(eventData.date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(eventData.date);
            endOfDay.setHours(23, 59, 59, 999);
  
            events = await Calendar.getEventsAsync(
              [defaultCalendar.id],
              startOfDay,
              endOfDay
            );
          } else if (eventData.month) {
            const [year, month] = eventData.month.split("-").map(Number);
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
  
            events = await Calendar.getEventsAsync(
              [defaultCalendar.id],
              startOfMonth,
              endOfMonth
            );
          }
  
          const eventTexts = events.length
            ? events.map(e => `• ${e.title} (${new Date(e.startDate).toLocaleString()})`).join("\n")
            : "No event listing found.";
  
          const listMsg: ChatMessage = {
            text: eventTexts,
            sender: "bot",
          };
          await push(chatRef, listMsg);
          return;
        }
      }
    }

    // --if not found keyword
    reply = reply || (await sendMessageToGemini(input));

    const botMsg: ChatMessage = {
      text: reply,
      sender: "bot",
    };
    await push(chatRef, botMsg);
  };

   

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="Chat Screen" />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <View style={styles.menu}>
              <Appbar.Action
                icon="dots-vertical"
                color="black"
                onPress={openMenu}
              />
            </View>
          }
          anchorPosition="bottom"
        >
          <Menu.Item
            onPress={async () => {
              closeMenu();
              setMessages([]);
              const formattedTimestamp = format(
                new Date(),
                "yyyy-MM-dd'T'HH-mm-ss"
              );
              const newChatId = `chat_${formattedTimestamp}`;
              const newChatRef = ref(db, `chats/${safeEmail}/${newChatId}`);
              setChatRef(newChatRef);
            }}
            title="New Chat"
          />
          <Menu.Item
            onPress={() => {
              closeMenu();
              navigation.navigate("History");
            }}
            title="History"
          />
          <Menu.Item
            onPress={() => {
              closeMenu();
              navigation.navigate("Settings");
            }}
            title="Settings"
          />
          <Divider />
          <Menu.Item
            onPress={async () => {
              closeMenu();
              await auth.signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: "Auth" }],
              });
            }}
            title="Log Out"
          />
        </Menu>
      </Appbar.Header>

      <View style={styles.container}>
        <ScrollView
          style={styles.chatBox}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                msg.sender === "user" ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Write a message..."
          />
          <Button title="Send" onPress={handleSend} />
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  chatBox: { flex: 1, marginBottom: 10 },
  inputArea: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginRight: 8,
    borderRadius: 6,
  },
  messageContainer: {
    maxWidth: "75%",
    padding: 10,
    marginVertical: 6,
    borderRadius: 10,
  },
  userMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#F1F0F0",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  menu: {
    marginTop: 1,
    marginRight: 8,
  },
});
