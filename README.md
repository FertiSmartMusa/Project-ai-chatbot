<h3 align="center">🤖 A Generative AI Chatbot App built with React Native and Firebase</h3>

### ▷ Features:

- User registration and login using **Firebase Authentication**.
- User data management via **Firebase Realtime Database**.
- Seamless **chat interface** for AI interaction (text-based).
- AI responses generated using a **Generative AI API** (e.g., OpenAI or Gemini).
- **Unique Chat ID** support for organizing and retrieving chat histories.
- **Start a New Chat** feature that resets the current chat view.
- **Chat History** screen with timestamped conversations.
- Ability to **reopen and continue old conversations**.
- **Settings screen** to view and manage user details.
- **Theme toggle**: Light/Dark mode switch.
- **Multi-language support** and ability to select the chatbot’s language.
- Keyword detection to allow **calendar event creation** from chat messages.
- **Timestamps** for both user and AI messages.
- **Responsive UI** compatible with both mobile and web platforms (via Expo).
- Firebase Realtime DB used to **store and retrieve chat logs** efficiently.

---

### ▷ About Application:

A simple yet powerful mobile/web chatbot app that mimics popular AI messaging assistants. Users can securely log in, interact with an AI, create and save multiple chat sessions, and manage their preferences through an intuitive interface.

---

### ▷ Tools & Frameworks Used:

- **VS Code**
- **React Native** (with TypeScript)
- **Expo**
- **Firebase**:
  - Authentication
  - Realtime Database
  - (Optional) Storage for user profile images

---

### ▷ Libraries Used:

- `react-navigation/native`
- `@react-navigation/stack`
- `@react-native-firebase/app`
- `@react-native-firebase/auth`
- `@react-native-firebase/database`
- `react-native-vector-icons`
- `expo-localization` & `i18n-js` (for multi-language support)
- `moment` (for timestamp formatting)
- `uuid` (for generating unique chat/session IDs)

---

### 🛠 Setup Instructions:

1. Clone the repository.
2. Install dependencies with `npm install` or `yarn`.
3. Create your own Firebase project at [Firebase Console](https://console.firebase.google.com).
4. Replace the Firebase config in your project with your own credentials.
5. Run the app locally with:
   ```bash
   npm start
