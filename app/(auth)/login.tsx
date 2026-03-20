import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff, Fingerprint, Lock, Mail, Wallet } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../constants/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [hasSavedCredentials, setHasSavedCredentials] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.replace("/(tabs)/home");
            } else {
                setAuthChecked(true);
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const checkSavedCredentials = async () => {
            const savedEmail = await AsyncStorage.getItem("sika_user_email");
            const savedPassword = await AsyncStorage.getItem("sika_user_password");
            setHasSavedCredentials(!!(savedEmail && savedPassword));
        };
        checkSavedCredentials();
    }, []);

    const handleLogin = async () => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, trimmedEmail, password);
            await AsyncStorage.setItem("sika_user_email", trimmedEmail);
            await AsyncStorage.setItem("sika_user_password", password);
            router.replace("/(tabs)/home");
        } catch (error: any) {
            if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
                Alert.alert("Error", "Incorrect email or password");
            } else if (error.code === "auth/user-not-found") {
                Alert.alert("Error", "No account found with this email");
            } else if (error.code === "auth/invalid-email") {
                Alert.alert("Error", "Invalid email address");
            } else if (error.code === "auth/too-many-requests") {
                Alert.alert("Error", "Too many failed attempts. Please try again later.");
            } else {
                Alert.alert("Error", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBiometricLogin = async () => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
                Alert.alert("Error", "Your device doesn't support biometrics");
                return;
            }
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                Alert.alert("Error", "No biometrics enrolled. Please set up fingerprint in your phone settings.");
                return;
            }
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "Login to Sika",
                fallbackLabel: "Use password instead",
                cancelLabel: "Cancel",
            });
            if (result.success) {
                const savedEmail = await AsyncStorage.getItem("sika_user_email");
                const savedPassword = await AsyncStorage.getItem("sika_user_password");
                if (savedEmail && savedPassword) {
                    setLoading(true);
                    try {
                        await signInWithEmailAndPassword(auth, savedEmail, savedPassword);
                        router.replace("/(tabs)/home");
                    } catch (err: any) {
                        Alert.alert("Error", "Could not sign in. Please enter your password manually.");
                    } finally {
                        setLoading(false);
                    }
                } else {
                    Alert.alert("Error", "No saved session. Please login with email and password first.");
                }
            }
        } catch (error: any) {
            Alert.alert("Error", error.message);
        }
    };

    if (!authChecked) return null;

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

                    {/* Header/Logo Section */}
                    <View className="items-center mt-10 mb-12">
                        <View className="bg-green-900 p-4 rounded-2xl relative">
                            <View className="bg-yellow-400 w-3 h-3 rounded-full absolute right-2 top-2" />
                            <Wallet color="white" size={32} />
                        </View>
                        <Text className="text-3xl font-bold mt-4 text-green-900 dark:text-white">Sika</Text>
                        <Text className="text-gray-500 dark:text-gray-400 mt-1 w-full text-center">Your money. Your Intelligence.</Text>
                    </View>

                    {/* Login Card */}
                    <View className="mx-6 bg-white dark:bg-zinc-900 rounded-[40px] p-8 shadow-sm">
                        <Text className="text-2xl font-bold text-center text-green-900 dark:text-white mb-8">Welcome back</Text>

                        {/* Email Input */}
                        <View className="mb-6">
                            <Text className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Email</Text>
                            <View className="flex-row items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl px-4 py-1 border border-gray-100 dark:border-zinc-700">
                                <Mail color="#9ca3af" size={20} />
                                <TextInput
                                    className="flex-1 py-3 ml-3 text-gray-800 dark:text-white font-medium"
                                    placeholder="e.g. john@gmail.com"
                                    placeholderTextColor="#777"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View className="mb-8">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Password</Text>
                                <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
                                    <Text className="text-xs font-semibold text-green-700 dark:text-green-400">Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl px-4 py-1 border border-gray-100 dark:border-zinc-700">
                                <Lock color="#9ca3af" size={20} />
                                <TextInput
                                    className="flex-1 py-3 ml-3 text-gray-800 dark:text-white font-medium"
                                    placeholder="Enter your password"
                                    placeholderTextColor="#777"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2">
                                    {showPassword
                                        ? <EyeOff color="#9ca3af" size={20} />
                                        : <Eye color="#9ca3af" size={20} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            className="bg-green-900 py-4 rounded-2xl shadow-sm mb-4"
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Text className="text-white text-center font-bold text-lg">
                                {loading ? "Logging in..." : "Login"}
                            </Text>
                        </TouchableOpacity>

                        {/* Biometrics — only show if user has logged in before */}
                        {hasSavedCredentials && (
                            <>
                                <View className="flex-row items-center gap-3 my-4">
                                    <View className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
                                    <Text className="text-gray-400 text-sm">or</Text>
                                    <View className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
                                </View>
                                <TouchableOpacity
                                    className="flex-row items-center justify-center py-4 rounded-2xl border border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800"
                                    onPress={handleBiometricLogin}
                                >
                                    <Fingerprint color="#22c55e" size={20} />
                                    <Text className="text-green-900 dark:text-white font-bold ml-2">Login with Biometrics</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    {/* Bottom Link */}
                    <View className="flex-row justify-center mt-auto mb-10 pt-8">
                        <Text className="text-gray-500 dark:text-gray-400">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                            <Text className="text-green-900 dark:text-green-400 font-bold">Sign up</Text>
                        </TouchableOpacity>
                    </View>

            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default Login;