# Sika

A personal finance app for people in Ghana that lets you log your income and spending in cedis (₵), track savings goals, and ask an AI assistant for advice based on your own numbers.

> "Your money. Your intelligence."

## Screenshots

| Welcome | Home | Transactions | Goals |
| --- | --- | --- | --- |
| ![Screen](docs/screenshot-1.png) | ![Screen](docs/screenshot-2.png) | ![Screen](docs/screenshot-3.png) | ![Screen](docs/screenshot-4.png) |

## Features

### Implemented

- **Accounts.** Email/password sign-up and login with Firebase Authentication. On sign-up, a user profile (name, +233 phone number, email) is saved to Firestore. The session persists across app restarts.
- **Password reset** by email through Firebase.
- **Biometric app lock.** Turn it on from the Profile screen. Sika then asks for your fingerprint or face (`expo-local-authentication`) before restoring your saved session on launch. The Firebase session is stored in the device keystore via `expo-secure-store`, and passwords are never stored.
- **Auth-gated navigation.** Signed-out users are sent to the welcome/auth screens, and signed-in users go straight to the tabs.
- **Home dashboard.** Shows a time-of-day greeting, total cash flow, total spent and received this month, and your recent transactions.
- **Transactions.** Add debit or credit transactions manually with a category (Transfer, Food, Transport, Utilities, Airtime, Other). You can search them and filter by category. They are saved on the device with AsyncStorage.
- **Savings goals.** Create goals with an icon, target amount, amount already saved and a deadline. Each goal shows a progress bar, and the screen shows the total saved across all goals.
- **Sika AI.** A chat assistant powered by Claude (Anthropic API). It sees a summary of your transactions and goals, so its answers are about your own finances.
- **Profile.** Pick a profile photo from your gallery, toggle dark mode, clear all data, and log out.

### In progress

- **SMS transaction sync.** The toggle and "synced from SMS" banner exist, but nothing reads SMS messages yet. Transactions are entered by hand for now.
- **Goal persistence.** Goals live in memory only. They start from sample data and reset when the app restarts.
- **Google Sign-In.** The library is installed and logout signs out of Google, but there is no Google sign-in flow yet.
- **Notifications, Export Data, and editing your primary network/bank** appear on the Profile screen as placeholders with no behaviour behind them.
- **Cloud sync.** Transactions are stored only on the device, not in Firestore.

## Tech stack

- [Expo](https://expo.dev) SDK 54, React Native 0.81, React 19, TypeScript
- [Expo Router](https://docs.expo.dev/router/introduction/) for file-based navigation (tabs and stacks)
- [NativeWind](https://www.nativewind.dev/) (Tailwind CSS) for styling, with light and dark themes
- [Firebase](https://firebase.google.com/) Authentication and Cloud Firestore
- AsyncStorage for on-device persistence
- Expo Local Authentication (biometrics) and Expo Image Picker
- React Native Reanimated for the floating action menu
- [lucide-react-native](https://lucide.dev/) icons
- Anthropic Claude API for Sika AI
- EAS Build (development, preview and production profiles)

## Getting started

### Prerequisites

- Node.js (LTS) and npm
- An Android device or emulator. The app uses native modules, so you need a [development build](https://docs.expo.dev/develop/development-builds/introduction/) rather than Expo Go.
- A Firebase project with Email/Password auth and Firestore enabled
- An Anthropic API key (only needed for Sika AI)

### Setup

```bash
git clone https://github.com/HOLYGRILL-7/my-Sika-react-native.git
cd my-Sika-react-native
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Used for |
| --- | --- |
| `EXPO_PUBLIC_CLAUDE_API_KEY` | Sika AI chat (`components/Sikaaimodal.tsx`) |

The Firebase web config lives in `constants/firebase.ts`. The Android build also expects a `google-services.json` from your Firebase project in the repo root. It is gitignored, so you have to add your own.

### Run

```bash
npx expo run:android   # first time: build and install the dev client
npx expo start         # start the dev server
```

## Project structure

```
app/
  _layout.tsx        # root stack + auth redirect
  (auth)/            # welcome, login, signup, forgot-password
  (tabs)/            # home, transactions, goals, profile
components/          # modals (add transaction, add goal, Sika AI), floating action menu, UI helpers
context/             # TransactionContext (AsyncStorage) and GoalContext
constants/           # Firebase setup, theme, Transaction type
hooks/               # colour-scheme hooks
assets/              # icons, splash and images
```

## Status

**MVP / in development.** The core flows (auth, manual transactions, goals and AI chat) work. SMS sync, cloud sync and several profile settings are not built yet. There are no automated tests.

## Author

**Bismark Jones-Oduro**, GitHub [@HOLYGRILL-7](https://github.com/HOLYGRILL-7)
