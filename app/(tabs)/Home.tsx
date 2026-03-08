import { onAuthStateChanged } from "firebase/auth";
import { ArrowDownLeft, ArrowUpRight, Phone, ShoppingCart, Zap } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTransactions } from "../../context/TransactionContext";
import { auth } from "../../constants/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
    const [refreshing, setRefreshing] = useState(false);
    const { transactions } = useTransactions();
    const [userName, setUserName] = useState("there");
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) setUserName(user.displayName?.split(" ")[0] || "there");
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const loadImage = async () => {
            const saved = await AsyncStorage.getItem("sika_profile_image");
            if (saved) setProfileImage(saved);
        };
        loadImage();
    }, []);

    const totalSpent = transactions
        .filter((t) => t.type === "debit")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalCashFlow = transactions
        .reduce((sum, t) => sum + (t.type === "credit" ? t.amount : -t.amount), 0);
    
    const totalReceived = transactions
        .filter((t) => t.type === "credit")
        .reduce((sum, t) => sum + t.amount, 0);

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Simulate a network request
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    }, []);
    const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
};

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
            <FlatList
                data={transactions.slice(0, 5)}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2e7d32" colors={["#2e7d32"]} />
                }
                contentContainerStyle={{padding: 20}}
                ListHeaderComponent={() => (
                    <>
                        {/* Greeting */}
                        <View className="mt-5">
                            <Text className="text-2xl font-bold dark:text-white">{getGreeting()}, {userName}!</Text>
                            <Text className="text-gray-500 dark:text-gray-400">{"Let's track your money."}</Text>
                            {profileImage 
                                ? <Image source={{uri: profileImage}} className="w-14 h-14 rounded-full absolute right-0 top-0" />
                                : <Image source={require("../../assets/images/Me.png")} className="w-14 h-14 rounded-full absolute right-0 top-0" />
                            }
                        </View>

                        {/* Balance card */}
                        <View className="mt-10 p-6 rounded-xl overflow-hidden bg-[#d4e6d4] dark:bg-green-900/30">
                            <View
                                className="absolute right-0 top-0 w-40 h-40 rounded-full bg-[#c0d9c0] dark:bg-green-800/20 translate-x-[30px] -translate-y-[20px]"
                            />
                            <Text className="text-green-900 dark:text-green-400 font-bold text-lg">Total Cash Flow</Text>
                            <Text
                                style={{fontFamily: "DMMono_400Regular"}}
                                className="text-green-900 dark:text-white font-bold text-4xl mt-1"
                            >
                                ₵ {formatCurrency(totalCashFlow)}
                            </Text>
                        </View>

                        {/* Stats */}
                        <View className="mt-10 flex-row gap-5">
                            <View className="p-5 rounded-xl flex-1 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800">
                                <Text className="mb-3 dark:text-gray-400">Total Spent This Month</Text>
                                <Text className="text-red-500 font-bold">₵ {formatCurrency(totalSpent)}</Text>
                            </View>
                            <View className="p-5 rounded-xl flex-1 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800">
                                <Text className="mb-3 dark:text-gray-400">Total Recieved This Month</Text>
                                <Text className="text-green-500 font-bold">₵ {formatCurrency(totalReceived)}</Text>
                            </View>
                        </View>


                        <View className="mt-10 flex-row justify-between items-center mb-5">
                            <Text className="text-xl font-bold dark:text-white">Recent Transactions</Text>
                            <TouchableOpacity>
                                <Text className="text-green-900 dark:text-green-400 font-semibold">See All</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
                renderItem={({item}) => {
                    const getIcon = () => {
                        if (item.category === "Utilities") return Zap;
                        if (item.category === "Airtime") return Phone;
                        if (item.category === "Food") return ShoppingCart;
                        return item.type === "credit" ? ArrowDownLeft : ArrowUpRight;
                    };
                    const IconComponent = getIcon();
                    return (
                        <View className="flex-row items-center justify-between mb-5">
                            <View className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 mr-4 items-center justify-center">
                                <IconComponent size={20} color={item.type === "credit" ? "#22c55e" : "#9ca3af"} />
                            </View>
                            <View className="flex-1">
                                <Text className="font-bold dark:text-white">{item.name}</Text>
                                <Text className="text-gray-400 dark:text-gray-500 text-sm">{item.date}</Text>
                            </View>
                            <Text className={`font-bold ${item.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                                {item.type === "credit" ? "+" : "-"}₵{item.amount.toFixed(2)}
                            </Text>
                        </View>
                    );
                }}
            />
        </SafeAreaView>
    );
};

export default Home;
