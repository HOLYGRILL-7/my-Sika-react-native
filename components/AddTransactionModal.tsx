import React, {useState} from "react";
import {Text, View, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {X, ArrowDownLeft, ArrowUpRight} from "lucide-react-native";

type Props = {
    visible: boolean;
    onClose: () => void;
    onAdd: (transaction: any) => void;
};

const categories = ["Transfer", "Food", "Transport", "Utilities", "Airtime", "Other"];

const AddTransactionModal = ({visible, onClose, onAdd}: Props) => {
    const [type, setType] = useState<"credit" | "debit">("debit");
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Other");

    const handleAdd = () => {
        if (!name || !amount) return;

        onAdd({
            id: Date.now().toString(),
            name,
            amount: parseFloat(amount),
            type,
            category,
            date: new Date().toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"}),
            time: new Date().toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"}),
        });

        // Reset
        setName("");
        setAmount("");
        setCategory("Other");
        setType("debit");
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                {/* Backdrop */}
                <TouchableOpacity className="flex-1 bg-black/40" activeOpacity={1} onPress={onClose} />

                {/* Sheet */}
                <View className="bg-white dark:bg-zinc-900 rounded-t-3xl pt-5 pb-10 mt-10 max-h-[90%]">
                    <View className="px-6">
                        {/* Handle */}
                        <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-5" />

                        {/* Header */}
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-900 dark:text-white">Add Transaction</Text>
                            <TouchableOpacity onPress={onClose}>
                                <X size={22} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <KeyboardAwareScrollView 
                        showsVerticalScrollIndicator={false}
                        enableOnAndroid={true}
                        extraScrollHeight={Platform.OS === "ios" ? 20 : 40}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
                    >
                        {/* Credit / Debit toggle */}
                        <View className="flex-row bg-gray-100 dark:bg-zinc-800 rounded-2xl p-1 mb-5">
                        <TouchableOpacity
                            className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${
                                type === "debit" ? "bg-white dark:bg-zinc-700" : ""
                            }`}
                            onPress={() => setType("debit")}
                        >
                            <ArrowUpRight size={16} color={type === "debit" ? "#c62828" : "#999"} />
                            <Text
                                className={`text-sm font-semibold ${
                                    type === "debit" ? "text-red-700" : "text-gray-400"
                                }`}
                            >
                                Sent
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${
                                type === "credit" ? "bg-white dark:bg-zinc-700" : ""
                            }`}
                            onPress={() => setType("credit")}
                        >
                            <ArrowDownLeft size={16} color={type === "credit" ? "#2e7d32" : "#999"} />
                            <Text
                                className={`text-sm font-semibold ${
                                    type === "credit" ? "text-green-700" : "text-gray-400"
                                }`}
                            >
                                Received
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Name */}
                    <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                        {type === "debit" ? "Sent To" : "Received From"}
                    </Text>
                    <View className="bg-gray-50 dark:bg-zinc-800 rounded-2xl px-4 py-3 mb-4">
                        <TextInput
                            placeholder="e.g. Ama Mensah"
                            placeholderTextColor="#777"
                            value={name}
                            onChangeText={setName}
                            className="text-base text-gray-900 dark:text-white"
                        />
                    </View>

                    {/* Amount */}
                    <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                        Amount (₵)
                    </Text>
                    <View className="bg-gray-50 dark:bg-zinc-800 rounded-2xl px-4 py-3 mb-4">
                        <TextInput
                            placeholder="0.00"
                            placeholderTextColor="#777"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            className="text-base text-gray-900 dark:text-white"
                        />
                    </View>

                    {/* Category */}
                    <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Category</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                        <View className="flex-row gap-2">
                            {categories.map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    onPress={() => setCategory(c)}
                                    className={`px-4 py-2 rounded-full border ${
                                        category === c ? "bg-green-700 border-green-700 dark:bg-green-600 dark:border-green-600" : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                                    }`}
                                >
                                    <Text
                                        className={`text-sm font-medium ${
                                            category === c ? "text-white" : "text-gray-500"
                                        }`}
                                    >
                                        {c}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Add Button */}
                    <TouchableOpacity
                        onPress={handleAdd}
                        className={`rounded-2xl py-4 items-center ${!name || !amount ? 'bg-[#ccc]' : 'bg-[#2e7d32]'}`}
                        disabled={!name || !amount}
                    >
                        <Text className="text-white font-bold text-base">Add Transaction</Text>
                    </TouchableOpacity>
                    </KeyboardAwareScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default AddTransactionModal;
