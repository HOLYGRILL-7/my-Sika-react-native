import {useRouter} from "expo-router";
import {signInWithEmailAndPassword} from "firebase/auth";
import {Eye, EyeOff, Fingerprint, Lock, Mail, Wallet} from "lucide-react-native";
import React, {useState} from "react";
import {Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {auth} from "../../constants/firebase";

const Login = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("/(tabs)/home");
        } catch (error: any) {
            if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
                Alert.alert("Error", "Incorrect email or password");
            } else if (error.code === "auth/user-not-found") {
                Alert.alert("Error", "No account found with this email");
            } else if (error.code === "auth/invalid-email") {
                Alert.alert("Error", "Invalid email address");
            } else {
                Alert.alert("Error", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-zinc-950">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>

                    {/* Header/Logo Section */}
                    <View className="items-center  mt-16 mb-12">
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
                                <TouchableOpacity>
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

                        {/* Divider */}
                        <View className="flex-row items-center gap-3 my-4">
                            <View className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
                            <Text className="text-gray-400 text-sm">or</Text>
                            <View className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
                        </View>

                        {/* Google Sign In */}
                        <TouchableOpacity className="flex-row items-center justify-center gap-3 border border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-4 rounded-2xl mb-3">
                            <Text className="text-xl font-bold text-blue-500">G</Text>
                            <Text className="text-gray-700 dark:text-white font-bold">Continue with Google</Text>
                        </TouchableOpacity>

                        {/* Biometrics */}
                        <TouchableOpacity className="flex-row items-center justify-center py-4 rounded-2xl border border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800">
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