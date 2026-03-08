import {useRouter} from "expo-router";
import {Eye, EyeOff, LockKeyhole, Mail, User, UserPlus} from "lucide-react-native";
import React, {useState} from "react";
import {Alert, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import {auth, db} from "../../constants/firebase";

const Signup = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignup = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            await updateProfile(userCredential.user, {displayName: name});

            await setDoc(doc(db, "users", userCredential.user.uid), {
                name,
                phone: `+233${phone}`,
                email,
                createdAt: new Date().toISOString(),
            });

            router.push("/(tabs)/home");
        } catch (error: any) {
            if (error.code === "auth/email-already-in-use") {
                Alert.alert("Error", "Email already in use");
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
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-zinc-950 relative">
            <View
                className="absolute top-0 right-0 w-[35em] h-[25em] bg-yellow-200 dark:bg-yellow-900/10 rounded-full opacity-40"
                style={{transform: [{translateX: 40}, {translateY: -40}]}}
            />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 40}}>
                <View className="mt-20">
                    <View className="mx-auto">
                        <View className="bg-green-900 self-start p-5 rounded-3xl relative">
                            <View className="bg-yellow-400 self-start p-1 rounded-full absolute right-3 top-3"></View>
                            <UserPlus color="white" size={30} />
                        </View>
                    </View>
                </View>

                <View className="w-full mt-5 gap-2">
                    <Text className="font-bold text-4xl text-center dark:text-white">Create Account</Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-center px-6">Join Sika to manage your money smartly</Text>
                </View>

                <View className="mt-14 bg-white dark:bg-zinc-900 mx-5 shadow-xl rounded-3xl">
                    <View className="p-5">

                        {/* Full Name */}
                        <View className="mb-6">
                            <Text className="font-semibold text-lg mb-2 dark:text-white">Full Name</Text>
                            <View className="flex-row items-center bg-green-100/10 dark:bg-zinc-800 rounded-xl px-3 gap-3">
                                <User color="#777" size={20} />
                                <TextInput
                                    className="flex-1 py-3 dark:text-white"
                                    placeholder="e.g. John Doe"
                                    placeholderTextColor="#777"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        {/* Phone Number */}
                        <View className="mb-6">
                            <Text className="font-semibold text-lg mb-2 dark:text-white">Phone Number</Text>
                            <View className="flex-row items-center bg-green-100/10 dark:bg-zinc-800 rounded-xl px-3 gap-3">
                                <TouchableOpacity className="flex-row items-center gap-1 border-r border-gray-200 dark:border-zinc-700 pr-3">
                                    <Text className="text-lg">🇬🇭</Text>
                                    <Text className="text-gray-600 dark:text-gray-400 font-semibold">+233</Text>
                                </TouchableOpacity>
                                <TextInput
                                    className="flex-1 py-3 dark:text-white"
                                    placeholder="XX XXX XXXX"
                                    placeholderTextColor="#777"
                                    keyboardType="phone-pad"
                                    maxLength={9}
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                            </View>
                        </View>

                        {/* Email */}
                        <View className="mb-6">
                            <Text className="font-semibold text-lg mb-2 dark:text-white">Email</Text>
                            <View className="flex-row items-center bg-green-100/10 dark:bg-zinc-800 rounded-xl px-3 gap-3">
                                <Mail color="#777" size={20} />
                                <TextInput
                                    className="flex-1 py-3 dark:text-white"
                                    placeholder="e.g. john@gmail.com"
                                    placeholderTextColor="#777"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View className="mb-6">
                            <Text className="font-semibold text-lg mb-2 dark:text-white">Password</Text>
                            <View className="flex-row items-center bg-green-100/10 dark:bg-zinc-800 rounded-xl px-3 gap-3">
                                <LockKeyhole color="#777" size={20} />
                                <TextInput
                                    className="flex-1 py-3 dark:text-white"
                                    placeholder="Create a password"
                                    placeholderTextColor="#777"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword
                                        ? <Eye color="#777" size={20} />
                                        : <EyeOff color="#777" size={20} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View className="mb-6">
                            <Text className="font-semibold text-lg mb-2 dark:text-white">Confirm Password</Text>
                            <View className="flex-row items-center bg-green-100/10 dark:bg-zinc-800 rounded-xl px-3 gap-3">
                                <LockKeyhole color="#777" size={20} />
                                <TextInput
                                    className="flex-1 py-3 dark:text-white"
                                    placeholder="Confirm your password"
                                    placeholderTextColor="#777"
                                    secureTextEntry={!showConfirmPassword}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword
                                        ? <Eye color="#777" size={20} />
                                        : <EyeOff color="#777" size={20} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            className="bg-green-900 dark:bg-green-700 py-4 rounded-xl mt-2"
                            onPress={handleSignup}
                            disabled={loading}
                        >
                            <Text className="text-white text-center font-bold text-base">
                                {loading ? "Creating account..." : "Sign Up"}
                            </Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className="flex-row items-center gap-3 my-5">
                            <View className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
                            <Text className="text-gray-400 text-sm">or continue with</Text>
                            <View className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
                        </View>

                        {/* Google Sign Up */}
                        <TouchableOpacity className="flex-row items-center justify-center gap-3 border border-gray-200 dark:border-zinc-700 py-4 rounded-xl">
                            <Text className="text-2xl">G</Text>
                            <Text className="font-semibold text-gray-700 dark:text-gray-300 text-base">Sign up with Google</Text>
                        </TouchableOpacity>

                    </View>
                </View>

                <View className="flex-row justify-center items-center mt-5">
                    <Text className="text-gray-500 dark:text-gray-400">Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                        <Text className="text-green-900 dark:text-green-400 font-bold">Log in</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Signup;