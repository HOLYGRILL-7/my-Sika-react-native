import * as LocalAuthentication from "expo-local-authentication";
import { Fingerprint } from "lucide-react-native";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
    onUnlock: () => void;
    onUsePassword: () => void;
};

// Covers the app until the user passes a biometric check. The Firebase session
// itself stays in SecureStore; this only gates access to it.
const BiometricLock = ({ onUnlock, onUsePassword }: Props) => {
    const unlock = async () => {
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Unlock Sika",
            cancelLabel: "Cancel",
        });
        if (result.success) onUnlock();
    };

    // Prompt once when the lock appears; later attempts go through the Unlock button
    useEffect(() => {
        unlock();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View className="absolute inset-0 items-center justify-center bg-gray-50 dark:bg-zinc-950 px-8">
            <View className="bg-green-900 p-4 rounded-2xl">
                <Fingerprint color="#facc15" size={40} />
            </View>
            <Text className="text-2xl font-bold mt-6 text-green-900 dark:text-white">Sika is locked</Text>
            <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">Use your fingerprint or face to continue.</Text>

            <TouchableOpacity className="w-full bg-green-900 py-4 rounded-2xl mt-10" onPress={unlock}>
                <Text className="text-white text-center font-bold text-lg">Unlock</Text>
            </TouchableOpacity>
            <TouchableOpacity className="mt-6" onPress={onUsePassword}>
                <Text className="text-green-900 dark:text-green-400 font-bold">Use password instead</Text>
            </TouchableOpacity>
        </View>
    );
};

export default BiometricLock;
