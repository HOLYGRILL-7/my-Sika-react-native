import { Car, GraduationCap, Heart, Home, Shield, Smartphone, X } from "lucide-react-native";
import React, { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "nativewind";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type Props = {
    visible: boolean;
    onClose: () => void;
    onAdd: (goal: any) => void;
};

const icons = [
    {key: "school", icon: GraduationCap, label: "Education"},
    {key: "phone", icon: Smartphone, label: "Tech"},
    {key: "shield", icon: Shield, label: "Emergency"},
    {key: "home", icon: Home, label: "Home"},
    {key: "car", icon: Car, label: "Transport"},
    {key: "health", icon: Heart, label: "Health"},
];

const AddGoalModal = ({visible, onClose, onAdd}: Props) => {
    const [name, setName] = useState("");
    const [target, setTarget] = useState("");
    const [saved, setSaved] = useState("");
    const [deadline, setDeadline] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("shield");

    const handleAdd = () => {
        if (!name || !target) return;

        const savedAmount = parseFloat(saved) || 0;
        const targetAmount = parseFloat(target);

        onAdd({
            id: Date.now().toString(),
            name,
            saved: savedAmount,
            target: targetAmount,
            deadline: deadline || "No deadline",
            status: savedAmount / targetAmount >= 0.5 ? "On Track" : "Behind",
            icon: selectedIcon,
        });

        // Reset
        setName("");
        setTarget("");
        setSaved("");
        setDeadline("");
        setSelectedIcon("shield");
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
                            <Text className="text-xl font-bold text-gray-900 dark:text-white">New Goal</Text>
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
                        {/* Icon picker */}
                        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Icon</Text>
                        <View className="flex-row gap-3 mb-5">
                            {icons.map(({key, icon: Icon, label}) => (
                                <TouchableOpacity
                                    key={key}
                                    onPress={() => setSelectedIcon(key)}
                                    className="items-center gap-1"
                                >
                                    <View
                                        className="w-12 h-12 rounded-2xl items-center justify-center"
                                        style={{
                                            backgroundColor: selectedIcon === key ? "#2e7d32" : (useColorScheme().colorScheme === "dark" ? "#27272a" : "#f0f0f0"),
                                        }}
                                    >
                                        <Icon size={20} color={selectedIcon === key ? "white" : "#999"} />
                                    </View>
                                    <Text className="text-xs text-gray-400">{label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Goal Name */}
                        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            Goal Name
                        </Text>
                        <View className="bg-gray-50 dark:bg-zinc-800 rounded-2xl px-4 py-3 mb-4">
                            <TextInput
                                placeholder="e.g. School Fees"
                                placeholderTextColor="#777"
                                value={name}
                                onChangeText={setName}
                                className="text-base text-gray-900 dark:text-white"
                            />
                        </View>

                        {/* Target Amount */}
                        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            Target Amount (₵)
                        </Text>
                        <View className="bg-gray-50 dark:bg-zinc-800 rounded-2xl px-4 py-3 mb-4">
                            <TextInput
                                placeholder="0.00"
                                placeholderTextColor="#777"
                                value={target}
                                onChangeText={setTarget}
                                keyboardType="numeric"
                                className="text-base text-gray-900 dark:text-white"
                            />
                        </View>

                        {/* Already Saved */}
                        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            Already Saved (₵)
                        </Text>
                        <View className="bg-gray-50 dark:bg-zinc-800 rounded-2xl px-4 py-3 mb-4">
                            <TextInput
                                placeholder="0.00"
                                placeholderTextColor="#777"
                                value={saved}
                                onChangeText={setSaved}
                                keyboardType="numeric"
                                className="text-base text-gray-900 dark:text-white"
                            />
                        </View>

                        {/* Deadline */}
                        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            Deadline
                        </Text>
                        <View className="bg-gray-50 dark:bg-zinc-800 rounded-2xl px-4 py-3 mb-6">
                            <TextInput
                                placeholder="e.g. Dec 31, 2026"
                                placeholderTextColor="#777"
                                value={deadline}
                                onChangeText={setDeadline}
                                className="text-base text-gray-900 dark:text-white"
                            />
                        </View>

                        {/* Add Button */}
                        <TouchableOpacity
                            onPress={handleAdd}
                            className="rounded-2xl py-4 items-center"
                            style={{backgroundColor: !name || !target ? "#ccc" : "#2e7d32"}}
                            disabled={!name || !target}
                        >
                            <Text className="text-white font-bold text-base">Add Goal</Text>
                        </TouchableOpacity>
                    </KeyboardAwareScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default AddGoalModal;
