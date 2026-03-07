import {useRouter} from "expo-router";
import {EyeOff, LockKeyhole, User, UserPlus} from "lucide-react-native";
import React from "react";
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Signup = () => {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-zinc-950 relative">
            <View
                className="absolute top-0 right-0 w-[35em] h-[25em] bg-yellow-200 dark:bg-yellow-900/10 rounded-full opacity-40"
                style={{transform: [{translateX: 40}, {translateY: -40}]}}
            />
            <View className="mt-24">
                <View className="mx-auto">
                    <View className="bg-green-900 self-start p-5 rounded-3xl relative">
                        <View className="bg-yellow-400 self-start p-1 rounded-full absolute right-3 top-3"></View>
                        <UserPlus color="white" size={30} />
                    </View>
                </View>
            </View>
            <View className="w-full  mt-5 gap-2">
                <Text className="font-bold text-4xl text-center dark:text-white">Create Account</Text>
                <Text className="text-gray-500 dark:text-gray-400 text-center px-6">Join Sika to manage your money smartly</Text>
            </View>
            <View className="mt-14 bg-white dark:bg-zinc-900 mx-5 shadow-xl rounded-3xl">
                <View className="main-container p-5">
                    <View className="mb-10">
                        <Text className="font-semibold text-lg mb-2 dark:text-white">Full Name</Text>
                        <View className="flex-row items-center bg-green-100/10 dark:bg-zinc-800 rounded-xl px-3 gap-3">
                            <User color="#777" size={20} />
                            <TextInput className="flex-1 py-3 dark:text-white" placeholder="e.g. John Doe" placeholderTextColor="#777" />
                        </View>
                    </View>
                    <View className="mb-10">
                        <Text className="font-semibold text-lg mb-2 dark:text-white">Phone Number</Text>
                        <View className="flex-row items-center bg-green-100/10 dark:bg-zinc-800 rounded-xl px-3 gap-3">
                            {/* Country code */}
                            <TouchableOpacity className="flex-row items-center gap-1 border-r border-gray-200 dark:border-zinc-700 pr-3">
                                <Text className="text-lg">🇬🇭</Text>
                                <Text className="text-gray-600 dark:text-gray-400 font-semibold">+233</Text>
                            </TouchableOpacity>
                            {/* Number input */}
                            <TextInput
                                className="flex-1 py-3 dark:text-white"
                                placeholder="XX XXX XXXX"
                                placeholderTextColor="#777"
                                keyboardType="phone-pad"
                                maxLength={9}
                            />
                        </View>
                    </View>

                    <View className="mb-10">
                        <Text className="font-semibold text-lg mb-2 dark:text-white">Create Pin</Text>
                        <View className="flex-row items-center bg-green-100/10 dark:bg-zinc-800 rounded-xl px-3 gap-3">
                            <LockKeyhole color="#777" size={20} />
                            <TextInput className="flex-1 py-3 dark:text-white" placeholder="Create a 4-digit pin" placeholderTextColor="#777" />
                            <EyeOff color="#777" size={20} />
                        </View>
                    </View>

                    <View className="mb-10">
                        <Text className="font-semibold text-lg mb-2 dark:text-white">Confirm Pin</Text>
                        <View className="flex-row items-center bg-green-100/10 dark:bg-zinc-800 rounded-xl px-3 gap-3">
                            <LockKeyhole color="#777" size={20} />
                            <TextInput className="flex-1 py-3 dark:text-white" placeholder="Confirm your 4-digit pin" placeholderTextColor="#777" />
                            <EyeOff color="#777" size={20} />
                        </View>
                    </View>

                    <TouchableOpacity className="bg-green-900 dark:bg-green-700 py-4 rounded-xl mt-5" onPress={() => router.push("/(tabs)/home")}>
                        <Text className="text-white text-center font-bold">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View className="flex-row justify-center items-center mt-5">
                <Text className="text-gray-500 dark:text-gray-400">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                    <Text className="text-green-900 dark:text-green-400 font-bold">Log in</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Signup;
