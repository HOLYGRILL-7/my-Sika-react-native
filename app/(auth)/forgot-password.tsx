import {useRouter} from "expo-router";
import {Mail, Wallet} from "lucide-react-native";
import React, {useState} from "react";
import {Alert, Platform, Text, TextInput, TouchableOpacity, View} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {SafeAreaView} from "react-native-safe-area-context";
import {sendPasswordResetEmail} from "firebase/auth";
import {auth} from "../../constants/firebase";

const ForgotPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleReset = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email");
            return;
        }
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setSent(true);
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-zinc-950">
            <KeyboardAwareScrollView
                className="flex-1"
                contentContainerStyle={{flexGrow: 1}}
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
                extraScrollHeight={Platform.OS === "ios" ? 20 : 40}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 px-6 pt-10">
                <TouchableOpacity onPress={() => router.back()} className="mb-8">
                    <Text className="text-green-700 dark:text-green-400 font-semibold">← Back</Text>
                </TouchableOpacity>

                <View className="items-center mb-10">
                    <View className="bg-green-900 p-4 rounded-2xl relative">
                        <View className="bg-yellow-400 w-3 h-3 rounded-full absolute right-2 top-2" />
                        <Wallet color="white" size={32} />
                    </View>
                    <Text className="text-2xl font-bold mt-4 text-green-900 dark:text-white">Forgot Password?</Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
                        Enter your email and we'll send you a reset link
                    </Text>
                </View>

                {sent ? (
                    <View className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 items-center">
                        <Text className="text-green-800 dark:text-green-400 font-bold text-lg text-center">Email sent!</Text>
                        <Text className="text-green-700 dark:text-green-500 text-center mt-2">
                            Check your inbox for a password reset link
                        </Text>
                        <TouchableOpacity onPress={() => router.replace("/(auth)/login")} className="mt-6">
                            <Text className="text-green-900 dark:text-green-400 font-bold">Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="bg-white dark:bg-zinc-900 rounded-3xl p-6">
                        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Email</Text>
                        <View className="flex-row items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl px-4 py-1 border border-gray-100 dark:border-zinc-700 mb-6">
                            <Mail color="#9ca3af" size={20} />
                            <TextInput
                                className="flex-1 py-3 ml-3 text-gray-800 dark:text-white"
                                placeholder="Enter your email"
                                placeholderTextColor="#777"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        <TouchableOpacity
                            className="bg-green-900 py-4 rounded-2xl"
                            onPress={handleReset}
                            disabled={loading}
                        >
                            <Text className="text-white text-center font-bold text-lg">
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default ForgotPassword;