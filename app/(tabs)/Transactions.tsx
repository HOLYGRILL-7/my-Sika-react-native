import React, {useState} from "react";
import {Text, TextInput, TouchableOpacity, View, ScrollView} from "react-native";
import {Search, RefreshCw, ArrowDownLeft, ArrowUpRight, X, Plus, Sparkles} from "lucide-react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import AddTransactionModal from "../../components/AddTransactionModal";
import SikaAIModal from "../../components/Sikaaimodal";
import FloatingActionMenu from "../../components/FloatingActionMenu";
import { Transaction } from "../../constants/mockData";
import { useTransactions } from "../../context/TransactionContext";

const groupByDate = (transactions: Transaction[]) => {
    return transactions.reduce((groups: Record<string, Transaction[]>, transaction) => {
        const date = transaction.date;
        if (!groups[date]) groups[date] = [];
        groups[date].push(transaction);
        return groups;
    }, {});
};

const filters = ["All", "Transfer", "Food", "Utilities", "Airtime"];

const Transactions = () => {
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [aiVisible, setAiVisible] = useState(false);
    const { transactions, addTransaction } = useTransactions();

    const filtered = transactions.filter((t) => {
        const matchesSearch =
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.category.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = activeFilter === "All" || t.category === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const grouped = groupByDate(filtered);

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-zinc-950">
            <ScrollView showsVerticalScrollIndicator={false} className="dark:bg-zinc-950">
                {/* Header */}
                <View className="px-6 pt-4 pb-2 flex-row justify-between items-center">
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</Text>
                    <Text className="text-sm font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                        {transactions.length} total
                    </Text>
                </View>

                {/* Search */}
                <View className="flex-row mx-6 mt-4 px-4 py-3 rounded-2xl items-center gap-3 bg-[#e8f0e8] dark:bg-zinc-900">
                    <Search size={20} color="#666" />
                    <TextInput
                        className="flex-1 text-base text-gray-800 dark:text-white"
                        placeholder="Search transactions..."
                        placeholderTextColor="#999"
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch("")}>
                            <X size={18} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filter chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mt-3"
                    contentContainerStyle={{paddingHorizontal: 24, gap: 8}}
                >
                    {filters.map((f) => (
                        <TouchableOpacity
                            key={f}
                            onPress={() => setActiveFilter(f)}
                            className={`px-4 py-2 rounded-full border ${
                                activeFilter === f
                                    ? "bg-green-700 border-green-700 dark:bg-green-600 dark:border-green-600"
                                    : "bg-orange-300/20 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                            }`}
                        >
                            <Text className={`text-sm font-medium ${activeFilter === f ? "text-white" : "text-green-900 dark:text-green-400"}`}>
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* SMS Sync Banner */}
                <TouchableOpacity className="mx-6 mt-4 flex-row items-center gap-3 bg-orange-300/20 dark:bg-green-900/10 border border-transparent dark:border-green-900/20 rounded-2xl p-4">
                    <RefreshCw size={18} color="#2d6a2d" />
                    <View className="flex-1">
                        <Text className="text-sm font-semibold text-green-900 dark:text-green-400">Transactions synced from SMS</Text>
                        <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Last synced just now</Text>
                    </View>
                </TouchableOpacity>

                {/* Transactions List */}
                <View className="px-6 mt-6 pb-32">
                    {Object.entries(grouped).map(([date, transactions]) => (
                        <View key={date} className="mb-6">
                            <View className="flex-row items-center gap-3 mb-3">
                                <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{date}</Text>
                                <View className="flex-1 h-px bg-gray-200" />
                            </View>
                            <View
                                className="bg-white dark:bg-zinc-900 rounded-2xl px-4"
                                style={{shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2}}
                            >
                                {transactions.map((t, index) => (
                                    <View
                                        key={t.id}
                                        className={`flex-row items-center py-4 gap-3 ${
                                            index !== transactions.length - 1 ? "border-b border-gray-100 dark:border-zinc-800" : ""
                                        }`}
                                    >
                                        <View
                                            className="w-11 h-11 rounded-xl items-center justify-center p-2"
                                            style={{backgroundColor: t.type === "credit" ? "rgba(232, 245, 233, 1)" : "rgba(254, 242, 242, 1)"}}
                                        >
                                            {t.type === "credit"
                                                ? <ArrowDownLeft size={20} color="#2e7d32" />
                                                : <ArrowUpRight size={20} color="#c62828" />
                                            }
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-sm font-semibold text-green-900 dark:text-white">{t.name}</Text>
                                            <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t.category} · {t.time}</Text>
                                        </View>
                                        <Text className="text-sm font-bold" style={{color: t.type === "credit" ? "#2e7d32" : "#c62828"}}>
                                            {t.type === "credit" ? "+" : "-"}₵{t.amount}.00
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}

                    {filtered.length === 0 && (
                        <View className="items-center py-20">
                            <Search size={40} color="#ddd" />
                            <Text className="text-base font-semibold text-gray-300 mt-4">No transactions found</Text>
                            <Text className="text-sm text-gray-300 mt-1">Try a different search</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <FloatingActionMenu
                actions={[
                    {
                        icon: <Sparkles size={20} color="#f5c518" />,
                        label: "Ask Sika AI",
                        onPress: () => setAiVisible(true),
                        color: "#064e3b"
                    },
                    {
                        icon: <Plus size={24} color="white" />,
                        label: "Add Transaction",
                        onPress: () => setShowModal(true),
                        color: "#2e7d32"
                    }
                ]}
            />

            <AddTransactionModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onAdd={(t) => { addTransaction(t); setShowModal(false); }}
            />

            <SikaAIModal
                visible={aiVisible}
                onClose={() => setAiVisible(false)}
                transactions={transactions}
                context="transactions"
            />
        </SafeAreaView>
    );
};

export default Transactions;