import { useRouter } from "expo-router";
import { Eye, EyeOff, Fingerprint, Lock, Phone, Wallet } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
    const router = useRouter();
    const [showPin, setShowPin] = useState(false);
    const [phone, setPhone] = useState("");
    const [pin, setPin] = useState("");

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-zinc-950">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                    {/* Header/Logo Section */}
                    <View className="items-center mt-16 mb-12">
                        <View className="bg-green-900 p-4 rounded-2xl relative">
                            <View className="bg-yellow-400 w-3 h-3 rounded-full absolute right-2 top-2" />
                            <Wallet color="white" size={32} />
                        </View>
                        <Text className="text-3xl font-bold mt-4 text-green-900 dark:text-white">Sika</Text>
                        <Text className="text-gray-500 dark:text-gray-400 mt-1">Your money. Your Intelligence.</Text>
                    </View>

                    {/* Login Card */}
                    <View className="mx-6 bg-white dark:bg-zinc-900 rounded-[40px] p-8 shadow-sm">
                        <Text className="text-2xl font-bold text-center text-green-900 dark:text-white mb-8">Welcome back</Text>

                        {/* Phone Number Input */}
                        <View className="mb-6">
                            <Text className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Phone Number</Text>
                            <View className="flex-row items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl px-4 py-1 border border-gray-100 dark:border-zinc-700">
                                <Phone color="#9ca3af" size={20} />
                                <View className="flex-row items-center ml-3 border-r border-gray-200 dark:border-zinc-700 pr-3 my-3">
                                    <Text className="text-gray-600 dark:text-gray-300 font-semibold">+233</Text>
                                </View>
                                <TextInput
                                    className="flex-1 py-3 ml-3 text-gray-800 dark:text-white font-medium"
                                    placeholder="55 123 4567"
                                    placeholderTextColor="#777"
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                            </View>
                        </View>

                        {/* PIN Code Input */}
                        <View className="mb-8">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">PIN Code</Text>
                                <TouchableOpacity>
                                    <Text className="text-xs font-semibold text-green-700 dark:text-green-400">Forgot PIN?</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl px-4 py-1 border border-gray-100 dark:border-zinc-700">
                                <Lock color="#9ca3af" size={20} />
                                <TextInput
                                    className="flex-1 py-3 ml-3 text-gray-800 dark:text-white font-medium"
                                    placeholder="••••"
                                    placeholderTextColor="#777"
                                    secureTextEntry={!showPin}
                                    keyboardType="numeric"
                                    maxLength={4}
                                    value={pin}
                                    onChangeText={setPin}
                                />
                                <TouchableOpacity onPress={() => setShowPin(!showPin)} className="p-2">
                                    {showPin ? <EyeOff color="#9ca3af" size={20} /> : <Eye color="#9ca3af" size={20} />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <TouchableOpacity
                            className="bg-green-900 py-4 rounded-2xl shadow-sm mb-4"
                            onPress={() => router.push("/(tabs)/home")}
                        >
                            <Text className="text-white text-center font-bold text-lg">Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center justify-center py-4 rounded-2xl border border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800"
                        >
                            <Fingerprint color="#22c55e" size={20} />
                            <Text className="text-green-900 dark:text-white font-bold ml-2">Login with Biometrics</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Link */}
                    <View className="flex-row justify-center mt-auto mb-10 pt-8">
                        <Text className="text-gray-500 dark:text-gray-400">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                            <Text className="text-green-900 dark:text-green-400 font-bold">Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;
