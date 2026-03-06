import React, {useState} from "react";
import {Text, TextInput, TouchableOpacity, View, ScrollView} from "react-native";
import {Search, RefreshCw, ArrowDownLeft, ArrowUpRight, X, Plus} from "lucide-react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import AddTransactionModal from "../../components/Addtransactinmodal";

type Transaction = {
    id: string;
    name: string;
    category: string;
    date: string;
    time: string;
    amount: number;
    type: "credit" | "debit";
};

const mockTransactions: Transaction[] = [
    {
        id: "1",
        name: "Received from Kwame Asante",
        category: "Transfer",
        date: "Feb 20, 2026",
        time: "10:30 AM",
        amount: 500,
        type: "credit",
    },
    {
        id: "2",
        name: "Sent to Ama Mensah",
        category: "Transfer",
        date: "Feb 20, 2026",
        time: "02:15 PM",
        amount: 120,
        type: "debit",
    },
    {
        id: "3",
        name: "Paid for Electricity",
        category: "Utilities",
        date: "Feb 18, 2026",
        time: "09:48 AM",
        amount: 85,
        type: "debit",
    },
    {
        id: "4",
        name: "Bought Airtime",
        category: "Airtime",
        date: "Feb 17, 2026",
        time: "06:20 PM",
        amount: 20,
        type: "debit",
    },
    {
        id: "5",
        name: "Groceries - Melcom",
        category: "Food",
        date: "Feb 15, 2026",
        time: "11:05 AM",
        amount: 340,
        type: "debit",
    },
    {
        id: "6",
        name: "Received from Abena Osei",
        category: "Transfer",
        date: "Feb 15, 2026",
        time: "03:40 PM",
        amount: 200,
        type: "credit",
    },
];

const groupByDate = (transactions: Transaction[]) => {
    return transactions.reduce((groups: Record<string, Transaction[]>, transaction) => {
        const date = transaction.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
    }, {});
};

const filters = ["All", "Transfer", "Food", "Utilities", "Airtime"];

const Transactions = () => {
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);

    const filtered = mockTransactions.filter((t) => {
        const matchesSearch =
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.category.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = activeFilter === "All" || t.category === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const grouped = groupByDate(filtered);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 pt-4 pb-2 flex-row justify-between items-center">
                    <Text className="text-2xl font-bold text-gray-900">Transactions</Text>
                    <Text className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                        {mockTransactions.length} total
                    </Text>
                </View>

                {/* Search */}
                <View
                    className="flex-row mx-6 mt-4 px-4 py-3 rounded-2xl items-center gap-3"
                    style={{backgroundColor: "#e8f0e8"}}
                >
                    <Search size={20} color="#666" />
                    <TextInput
                        className="flex-1 text-base text-gray-800"
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
                                    ? "bg-green-700 border-green-700"
                                    : "bg-orange-300/20 border-gray-200"
                            }`}
                        >
                            <Text
                                className={`text-sm font-medium ${
                                    activeFilter === f ? "text-white" : "text-green-900"
                                }`}
                            >
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* SMS Sync Banner */}
                <TouchableOpacity className="mx-6 mt-4 flex-row items-center gap-3 bg-orange-300/20 border border-orange-300/20 rounded-2xl p-4">
                    <RefreshCw size={18} color="#2d6a2d" />
                    <View className="flex-1">
                        <Text className="text-sm font-semibold text-green-900">Transactions synced from SMS</Text>
                        <Text className="text-xs text-gray-400 mt-0.5">Last synced just now</Text>
                    </View>
                </TouchableOpacity>

                {/* Transactions List */}
                <View className="px-6 mt-6">
                    {Object.entries(grouped).map(([date, transactions]) => (
                        <View key={date} className="mb-6">
                            {/* Date header */}
                            <View className="flex-row items-center gap-3 mb-3">
                                <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                    {date}
                                </Text>
                                <View className="flex-1 h-px bg-gray-200" />
                            </View>

                            {/* Transaction rows */}
                            <View
                                className="bg-white rounded-2xl px-4"
                                style={{shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2}}
                            >
                                {transactions.map((t, index) => (
                                    <View
                                        key={t.id}
                                        className={`flex-row items-center py-4 gap-3 ${
                                            index !== transactions.length - 1 ? "border-b border-gray-100" : ""
                                        }`}
                                    >
                                        {/* Icon */}
                                        <View
                                            className="w-11 h-11 rounded-xl items-center justify-center"
                                            style={{backgroundColor: t.type === "credit" ? "#e8f5e9" : "#fef2f2"}}
                                        >
                                            {t.type === "credit" ? (
                                                <ArrowDownLeft size={20} color="#2e7d32" />
                                            ) : (
                                                <ArrowUpRight size={20} color="#c62828" />
                                            )}
                                        </View>

                                        {/* Name & category */}
                                        <View className="flex-1">
                                            <Text className="text-sm font-semibold text-green-900">{t.name}</Text>
                                            <Text className="text-xs text-gray-400 mt-0.5">
                                                {t.category} · {t.time}
                                            </Text>
                                        </View>

                                        {/* Amount */}
                                        <Text
                                            className="text-sm font-bold"
                                            style={{color: t.type === "credit" ? "#2e7d32" : "#c62828"}}
                                        >
                                            {t.type === "credit" ? "+" : "-"}₵{t.amount}.00
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}

                    {/* Empty state */}
                    {filtered.length === 0 && (
                        <View className="items-center py-20">
                            <Search size={40} color="#ddd" />
                            <Text className="text-base font-semibold text-gray-300 mt-4">No transactions found</Text>
                            <Text className="text-sm text-gray-300 mt-1">Try a different search</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
            {/* Floating Add Button */}
            <TouchableOpacity
                onPress={() => setShowModal(true)}
                className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center"
                style={{backgroundColor: "#2e7d32", elevation: 5}}
            >
                <Plus size={28} color="white" />
            </TouchableOpacity>

            <AddTransactionModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onAdd={(t) => console.log("New transaction:", t)}
            />
        </SafeAreaView>
    );
};

export default Transactions;
