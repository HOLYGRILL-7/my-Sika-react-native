import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useFocusEffect } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import * as LocalAuthentication from "expo-local-authentication";
import { Bell, Building2, Camera, ChevronRight, Download, Fingerprint, Info, LogOut, Moon, Smartphone, Trash2, User } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState, useCallback } from "react";
import { Alert, Image, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../constants/firebase";
import { useGoals } from "../../context/GoalContext";
import { useTransactions } from "../../context/TransactionContext";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Profile = () => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [smsEnabled, setSmsEnabled] = useState(true);
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const { clearTransactions } = useTransactions();
    const { clearGoals } = useGoals();
    const router = useRouter();    
    const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
    });

    if (!result.canceled) {
        const uri = result.assets[0].uri;
        setProfileImage(uri);
        await AsyncStorage.setItem("sika_profile_image", uri);
    }
};

useFocusEffect(
    useCallback(() => {
        const loadImage = async () => {
            const saved = await AsyncStorage.getItem("sika_profile_image");
            setProfileImage(saved);
        };
        loadImage();
    }, [])
);


const handleLogout = async () => {
    await signOut(auth);
    router.replace("/(auth)/login");
    };
    
    const [userName, setUserName] = useState("");
const [userEmail, setUserEmail] = useState("");

const handleSMSPermission = async (value: boolean) => {
    if (value) {
        // Request SMS permissions (Using simplified Alert for demonstration as standard RN alert
        // or a custom library like react-native-get-sms-android would be needed for actual sync)
        Alert.alert(
            "SMS Permission",
            "Sika needs access to your SMS to automatically track transaction alerts. Would you like to enable this?",
            [
                { text: "No", onPress: () => setSmsEnabled(false), style: "cancel" },
                { text: "Yes", onPress: () => setSmsEnabled(true) }
            ]
        );
    } else {
        setSmsEnabled(false);
    }
};

const handleSetFingerprint = async () => {
    try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
            Alert.alert("Hardware Error", "Your device doesn't support biometric authentication.");
            return;
        }

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
            Alert.alert(
                "Not Enrolled", 
                "No biometrics found. Please go to your device settings to register your fingerprint or face."
            );
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Confirm identity to enable biometrics",
            fallbackLabel: "Use password",
        });

        if (result.success) {
            if (userEmail) {
                await AsyncStorage.setItem("sika_user_email", userEmail);
                await AsyncStorage.setItem("sika_biometrics_enabled", "true");
            }
            Alert.alert("Success", "Biometric authentication is ready to use for your next login.");
        }
    } catch (error: any) {
        Alert.alert("Error", error.message);
    }
};

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setUserName(user.displayName || "");
            setUserEmail(user.email || "");
        }
    });
    return unsubscribe;
}, []);
    

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-zinc-950">
            <ScrollView showsVerticalScrollIndicator={false} className="dark:bg-zinc-950">
                {/* Header */}
                {/* <View className="px-6 pt-4 pb-2">
                    <Text className="text-2xl font-bold text-gray-900">Profile</Text>
                </View> */}

                {/* Avatar */}
                <View className="items-center mt-6 mb-8">
                    <TouchableOpacity onPress={pickImage} className="relative">
                        {/* Profile image or placeholder */}
                        <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center overflow-hidden">
                            {profileImage ? (
                                <Image source={{uri: profileImage}} className="w-24 h-24" />
                            ) : (
                                <User size={40} color="#2d6a2d" />
                            )}
                        </View>

                        {/* Camera badge */}
                        <View
                            className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center border-2 border-white"
                            style={{backgroundColor: "#2e7d32"}}
                        >
                            <Camera size={14} color="white" />
                        </View>
                    </TouchableOpacity>

                    <Text className="text-xl font-bold text-gray-900 dark:text-white mt-4">{userName}</Text>
                    <Text className="text-sm text-gray-400 dark:text-gray-500 mt-1">{userEmail}</Text>
                </View>

                {/* Financial Details */}
                <View className="px-6 mb-6">
                    <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                        Financial Details
                    </Text>
                    <View
                        className="bg-white dark:bg-zinc-900 rounded-2xl px-4"
                        style={{elevation: 2, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8}}
                    >
                        {/* Primary Network */}
                        <View className="flex-row items-center py-4 border-b border-gray-100 dark:border-zinc-800 gap-3">
                            <View className="w-9 h-9 rounded-xl bg-green-50 items-center justify-center">
                                <Smartphone size={18} color="#2d6a2d" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-900 dark:text-white">Primary Network</Text>
                                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">MTN Mobile Money</Text>
                            </View>
                            <TouchableOpacity>
                                <Text className="text-sm font-semibold text-green-700">Edit</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Primary Bank */}
                        <View className="flex-row items-center py-4 gap-3">
                            <View className="w-9 h-9 rounded-xl bg-green-50 items-center justify-center">
                                <Building2 size={18} color="#2d6a2d" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-900 dark:text-white">Primary Bank</Text>
                                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Ecobank Ghana</Text>
                            </View>
                            <TouchableOpacity>
                                <Text className="text-sm font-semibold text-green-700">Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Settings & Preferences */}
                <View className="px-6 mb-6">
                    <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                        Settings & Preferences
                    </Text>
                    <View
                        className="bg-white dark:bg-zinc-900 rounded-2xl px-4"
                        style={{elevation: 2, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8}}
                    >
                        {/* SMS Permissions */}
                        <View className="flex-row items-center py-4 border-b border-gray-100 gap-3">
                            <View className="w-9 h-9 rounded-xl bg-green-50 items-center justify-center">
                                <Smartphone size={18} color="#2d6a2d" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-900 dark:text-white">SMS Permissions</Text>
                                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Auto-sync transactions</Text>
                            </View>
                            <Switch
                                value={smsEnabled}
                                onValueChange={handleSMSPermission}
                                trackColor={{false: "#e0e0e0", true: "#a5d6a7"}}
                                thumbColor={smsEnabled ? "#2e7d32" : "#fff"}
                            />
                        </View>

                        {/* Notifications */}
                        <View className="flex-row items-center py-4 border-b border-gray-100 dark:border-zinc-800 gap-3">
                            <View className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/20 items-center justify-center">
                                <Bell size={18} color="#2d6a2d" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</Text>
                                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Alerts and insights</Text>
                            </View>
                            <ChevronRight size={18} color="#ccc" />
                        </View>

                        {/* Currency Display */}
                        <TouchableOpacity 
                            onPress={handleSetFingerprint}
                            className="flex-row items-center py-4 border-b border-gray-100 gap-3"
                        >
                            <View className="w-9 h-9 rounded-xl bg-green-50 items-center justify-center">
                                <Fingerprint size={18} color="#2d6a2d" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-900 dark:text-white">Set Fingerprint</Text>
                                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Use biometrics for login</Text>
                            </View>
                            <ChevronRight size={18} color="#ccc" />
                        </TouchableOpacity>

                            <View className="flex-row items-center py-4 border-b border-gray-100 dark:border-zinc-800 gap-3">
                                <View className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/20 items-center justify-center">
                                    <Download size={18} color="#2d6a2d" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-semibold text-gray-900 dark:text-white">Export Data</Text>
                                    <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Download your transactions</Text>
                                </View>
                                <ChevronRight size={18} color="#ccc" />
                            </View>
                        <View className="flex-row items-center py-4 border-t border-gray-100 dark:border-zinc-800 gap-3">
                            <View className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/20 items-center justify-center">
                                <Moon size={18} color="#2d6a2d" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-900 dark:text-white">Dark Mode</Text>
                                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Switch app theme</Text>
                            </View>
                            <Switch
                                value={colorScheme === "dark"}
                                onValueChange={toggleColorScheme}
                                trackColor={{false: "#e0e0e0", true: "#a5d6a7"}}
                                thumbColor={colorScheme === "dark" ? "#2e7d32" : "#fff"}
                            />
                        </View>
                                                {/* About */}
                        <View className="flex-row items-center py-4 border-t border-gray-100 dark:border-zinc-800 gap-3">
                            <View className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/20 items-center justify-center">
                                <Info size={18} color="#2d6a2d" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-900 dark:text-white">About</Text>
                                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Sika v{Constants.expoConfig?.version || "1.0.0"}</Text>
                            </View>
                            <ChevronRight size={18} color="#ccc" />
                        </View>

                        {/* Clear Data */}
                        <TouchableOpacity 
                                onPress={() => {
                                    Alert.alert(
                                        "Clear Data",
                                        "Are you sure you want to reset all transactions and goals? This cannot be undone.",
                                        [
                                            { text: "Cancel", style: "cancel" },
                                            { 
                                                text: "Clear All", 
                                                style: "destructive",
                                                onPress: () => {
                                                    clearTransactions();
                                                    clearGoals();
                                                }
                                            }
                                        ]
                                    );
                                }}
                                className="flex-row items-center py-4 border-t border-gray-100 dark:border-zinc-800 gap-3"
                            >
                                <View className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 items-center justify-center">
                                    <Trash2 size={18} color="#c62828" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-semibold text-red-600">Clear Data</Text>
                                    <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Reset all transactions</Text>
                                </View>
                                <ChevronRight size={18} color="#ccc" />
                        </TouchableOpacity>
                        
                        {/* Logout */}
                        <TouchableOpacity
                    onPress={handleLogout}
                    className="flex-row items-center py-4 border-t border-gray-100 gap-3"
                >
                    <View className="w-9 h-9 rounded-xl bg-red-50 items-center justify-center">
                        <LogOut size={18} color="#c62828" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-semibold text-red-600">Log Out</Text>
                    </View>
                        </TouchableOpacity>


                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
