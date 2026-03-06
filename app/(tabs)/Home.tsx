import {ArrowDownLeft, ArrowUpRight, Phone, ShoppingCart, Zap} from "lucide-react-native";
import React from "react";
import {FlatList, Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Home = () => {
    const transactions = [
        {
            id: "1",
            name: "From Kwame Asante",
            date: "Feb 20, 2026",
            amount: "+₵500.00",
            type: "credit",
            icon: ArrowUpRight,
        },

        {id: "2", name: "To Ama Mensah", date: "Feb 19, 2026", amount: "-₵120.00", type: "debit", icon: ArrowDownLeft},
        {id: "3", name: "Electricity", date: "Feb 18, 2026", amount: "-₵85.00", type: "debit", icon: Zap},
        {id: "4", name: "Airtime", date: "Feb 17, 2026", amount: "-₵20.00", type: "debit", icon: Phone},
        {id: "5", name: "Groceries", date: "Feb 15, 2026", amount: "-₵340.00", type: "debit", icon: ShoppingCart},
    ];

    return (
        <SafeAreaView className="flex-1 bg-white">
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{padding: 20}}
                ListHeaderComponent={() => (
                    <>
                        {/* Greeting */}
                        <View className="mt-5">
                            <Text className="text-2xl font-bold">Good morning, Kofi!</Text>
                            <Text className="text-gray-500">{"Let's track your money."}</Text>
                            <Image
                                source={require("../../assets/images/Me.png")}
                                className="w-14 h-14 rounded-full absolute right-0 top-0"
                            />
                        </View>

                        {/* Balance card */}
                        <View className="mt-10 p-6 rounded-xl overflow-hidden" style={{backgroundColor: "#d4e6d4"}}>
                            <View
                                className="absolute right-0 top-0 w-40 h-40 rounded-full"
                                style={{backgroundColor: "#c0d9c0", transform: [{translateX: 30}, {translateY: -20}]}}
                            />
                            <Text className="text-green-900 font-bold text-lg">Total Balance</Text>
                            <Text
                                style={{fontFamily: "DMMono_400Regular"}}
                                className="text-green-900 font-bold text-4xl mt-1"
                            >
                                ₵ 12,000.00
                            </Text>
                        </View>

                        {/* Stats */}
                        <View className="mt-10 flex-row gap-5">
                            <View className="p-5 rounded-xl flex-1 bg-white border-2 border-gray-200">
                                <Text className="mb-3">Total Spent This Month</Text>
                                <Text className="text-red-500 font-bold">₵ 2,500.00</Text>
                            </View>
                            <View className="p-5 rounded-xl flex-1 bg-white border-2 border-gray-200">
                                <Text className="mb-3">Total Saved This Month</Text>
                                <Text className="text-green-500 font-bold">₵ 9,500.00</Text>
                            </View>
                        </View>

                        {/* Categories */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{maxHeight: 45}}
                            className="mt-4"
                        >
                            <View className="flex-row gap-3 px-1">
                                {["Food", "Transport", "Utilities", "Other"].map((category) => (
                                    <TouchableOpacity
                                        key={category}
                                        className="px-5 py-3 rounded-2xl"
                                        style={{backgroundColor: "#f5e6c8"}}
                                    >
                                        <Text className="font-semibold" style={{color: "#8a6a2a"}}>
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        {/* Recent transactions header */}
                        <View className="mt-10 flex-row justify-between items-center mb-5">
                            <Text className="text-xl font-bold">Recent Transactions</Text>
                            <TouchableOpacity>
                                <Text className="text-green-900 font-semibold">See All</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
                renderItem={({item}) => {
                    const IconComponent = item.icon;
                    return (
                        <View className="flex-row items-center justify-between mb-5">
                            <View className="w-12 h-12 rounded-full bg-green-100 mr-4 items-center justify-center">
                                <IconComponent size={20} color={item.type === "credit" ? "green" : "gray"} />
                            </View>
                            <View className="flex-1">
                                <Text className="font-bold">{item.name}</Text>
                                <Text className="text-gray-400 text-sm">{item.date}</Text>
                            </View>
                            <Text className={`font-bold ${item.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                                {item.amount}
                            </Text>
                        </View>
                    );
                }}
            />
        </SafeAreaView>
    );
};

export default Home;
