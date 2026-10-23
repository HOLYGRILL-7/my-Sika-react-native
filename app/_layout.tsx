import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { auth } from "../constants/firebase";
import { BIOMETRICS_ENABLED_KEY } from "../constants/secureStorage";
import BiometricLock from "../components/BiometricLock";
import "./global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
    anchor: "(tabs)",
};

// Removes credentials and sessions that older versions kept in plaintext AsyncStorage
const removeLegacyStorage = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const legacy = keys.filter(
        (key) =>
            key === "sika_user_password" ||
            key === "sika_user_email" ||
            key === "sika_biometrics_enabled" ||
            key.startsWith("firebase:")
    );
    if (legacy.length) await AsyncStorage.multiRemove(legacy);
};

export default function RootLayout() {
    const { colorScheme } = useColorScheme();
    const router = useRouter();
    const segments = useSegments();
    const [initializing, setInitializing] = useState(true);
    const [locked, setLocked] = useState(false);

    useEffect(() => {
        removeLegacyStorage();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            const inAuthGroup = segments[0] === "(auth)";

            if (user && inAuthGroup) {
                // Redirect to home if logged in and trying to access auth screens
                router.replace("/(tabs)/home");
            } else if (!user && !inAuthGroup) {
                // Redirect to welcome if not logged in and not in auth group
                router.replace("/(auth)/welcome");
            }

            if (initializing) {
                // A restored session must pass a biometric check if the user enabled it
                if (user && (await SecureStore.getItemAsync(BIOMETRICS_ENABLED_KEY)) === "true") {
                    setLocked(true);
                }
                setInitializing(false);
            }
        });

        return unsubscribe;
    }, [segments, initializing]);

    const handleUsePassword = async () => {
        await signOut(auth);
        setLocked(false);
        router.replace("/(auth)/login");
    };

    if (initializing) return null;

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>
            {locked && <BiometricLock onUnlock={() => setLocked(false)} onUsePassword={handleUsePassword} />}
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
