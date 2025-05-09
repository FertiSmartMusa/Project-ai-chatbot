// HistoryScreen.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {List, Text, ActivityIndicator, PaperProvider} from "react-native-paper";
import { ref, onValue } from "firebase/database";
import { db, auth } from "../services/firebase";
import { formatDateTimeFromId } from "../utils/format";
import { ChatMessage } from "../types/ChatTypes";

export default function HistoryScreen() {
  const [chatSummaries, setChatSummaries] = useState<any[]>([]);
  const [expandedChatId, setExpandedChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const userEmail = auth.currentUser?.email || "";
  const safeEmail = userEmail.replace(/\./g, "_");
  const userChatsRef = ref(db, `chats/${safeEmail}`);

  useEffect(() => {
    const unsubscribe = onValue(userChatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const summaries = Object.entries(data).map(
          ([chatId, messages]: [string, any]) => {
            const messageArray = Object.values(messages);

            let timestamp: string;
            timestamp = chatId.replace("chat_", "");

            return {
              chatId,
              messages: messageArray,
              timestamp,
            };
          }
        );

        const sorted = summaries.sort((a, b) =>
          b.timestamp.localeCompare(a.timestamp)
        );
        setChatSummaries(sorted);
      } else {
        setChatSummaries([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleExpand = (chatId: string) => {
    setExpandedChatId((prev) => (prev === chatId ? null : chatId));
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        {loading ? (
          <ActivityIndicator animating={true} size="large" />
        ) : chatSummaries.length === 0 ? (
          <Text style={styles.noChats}>No Chat History.</Text>
        ) : (
          chatSummaries.map(({ chatId, messages, timestamp }) => (
            <List.Accordion
              key={chatId}
              title={`Chat - ${formatDateTimeFromId(timestamp)}`}
              expanded={expandedChatId === chatId}
              onPress={() => toggleExpand(chatId)}
              style={styles.accordion}
            >
              {messages.map((msg: ChatMessage, index: number) => (
                <List.Item
                  key={index}
                  title={`${msg.sender === "user" ? "👤" : "🤖"} ${msg.text}`}
                  titleNumberOfLines={10}
                  description={
                    msg.timestamp ? formatDateTimeFromId(msg.timestamp) : ""
                  }
                />
              ))}
            </List.Accordion>
          ))
        )}
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 24,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  accordion: {
    marginBottom: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    overflow: "hidden",
  },
  noChats: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
