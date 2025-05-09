import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  PaperProvider,
  TextInput,
  Button as PaperButton,
  Switch,
  Divider,
  Menu,
  DefaultTheme,
  MD3DarkTheme
} from 'react-native-paper';
import { auth, db } from '../services/firebase';
import { ref, get } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/NavigationTypes";

type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Auth">;

export default function SettingsScreen() {
  const [email, setEmail] = useState(auth.currentUser?.email || '');
  const [fullname, setFullname] = useState<string>('');
  const userId = auth.currentUser?.uid;
  const navigation = useNavigation<ChatScreenNavigationProp>();

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userRef = ref(db, `users/${userId}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setFullname(userData.fullname || '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [userId]);

  const handleSignOut = () => {
    auth.signOut().then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    });
  };

  return (
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Profile</Text>
          <TextInput
            label="Name"
            value={fullname}
            editable={false}
            style={[styles.input, styles.whiteInput]}
          />
          <TextInput
            label="E-mail"
            value={email}
            editable={false}
            style={[styles.input, styles.whiteInput]}
          />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <PaperButton
            mode="contained"
            onPress={handleSignOut}
            style={styles.logoutButton}
            labelStyle={{ color: 'white' }}
          >
            Log Out
          </PaperButton>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    marginBottom: 12,
  },
  whiteInput: {
    backgroundColor: '#f0f0f0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 10,
  },
  logoutButton: {
    alignSelf: 'center',
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
