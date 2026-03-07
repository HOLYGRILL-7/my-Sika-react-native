import React, {useState} from "react";
import {Text, View, ScrollView, TouchableOpacity, Image, Switch, Alert} from "react-native";
import {Camera, ChevronRight, Smartphone, Building2, Bell, DollarSign, Download, User, Moon, Trash2, Info} from "lucide-react-native";import {SafeAreaView} from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useColorScheme } from "nativewind";
import { useTransactions } from "../../context/TransactionContext";
import { useGoals } from "../../context/GoalContext";

import Constants from "expo-constants";

const Profile = () => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [smsEnabled, setSmsEnabled] = useState(true);
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const { clearTransactions } = useTransactions();
    const { clearGoals } = useGoals();

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // square crop
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

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

                    <Text className="text-xl font-bold text-gray-900 dark:text-white mt-4">Kofi Mensah</Text>
                    <Text className="text-sm text-gray-400 dark:text-gray-500 mt-1">kofi@gmail.com</Text>
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
                                onValueChange={setSmsEnabled}
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
                        <View className="flex-row items-center py-4 border-b border-gray-100 gap-3">
                            <View className="w-9 h-9 rounded-xl bg-green-50 items-center justify-center">
                                <DollarSign size={18} color="#2d6a2d" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-900 dark:text-white">Currency Display</Text>
                                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Ghana Cedis (₵)</Text>
                            </View>
                            <ChevronRight size={18} color="#ccc" />
                        </View>

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
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
