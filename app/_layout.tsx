import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../constants/firebase";
import "./global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
    anchor: "(tabs)",
};

export default function RootLayout() {
    const { colorScheme } = useColorScheme();
    const router = useRouter();
    const segments = useSegments();
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            const inAuthGroup = segments[0] === "(auth)";
            
            if (user && inAuthGroup) {
                // Redirect to home if logged in and trying to access auth screens
                router.replace("/(tabs)/home");
            } else if (!user && !inAuthGroup) {
                // Redirect to welcome if not logged in and not in auth group
                router.replace("/(auth)/welcome");
            }

            if (initializing) setInitializing(false);
        });

        return unsubscribe;
    }, [segments, initializing]);

    if (initializing) return null;

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
