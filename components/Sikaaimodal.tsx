import React, { useState, useRef } from "react";
import {
    Modal, View, Text, TouchableOpacity, TextInput,
    ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform
} from "react-native";
import { Sparkles, X, Send } from "lucide-react-native";
import { Transaction } from "../constants/mockData";

type Message = {
    role: "user" | "assistant";
    content: string;
};

type Props = {
    visible: boolean;
    onClose: () => void;
    transactions: Transaction[];
    context?: "home" | "transactions" | "goals";
    goals?: any[];
};

const API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY || "";

const SikaAIModal = ({ visible, onClose, transactions, context = "home", goals = [] }: Props) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    const getSystemPrompt = () => {
        const totalSpent = transactions.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);
        const totalReceived = transactions.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
        const recentTx = transactions.slice(0, 10).map(t =>
            `${t.type === "debit" ? "-" : "+"}₵${t.amount} (${t.category || "Uncategorized"}) - ${t.name}`
        ).join("\n");

        const goalsInfo = goals.length > 0
            ? goals.map((g: any) => `${g.name}: ₵${g.savedAmount} of ₵${g.targetAmount}`).join("\n")
            : "No goals set yet";

        return `You are Sika AI, a friendly and smart personal finance assistant for Ghanaians. 
You speak in a warm, encouraging, relatable tone — like a financially savvy friend. 
Keep responses short, clear and practical. Use Ghana cedis (₵).
Occasionally use light Ghanaian expressions where natural.

User's financial snapshot:
- Total spent: ₵${totalSpent.toFixed(2)}
- Total received: ₵${totalReceived.toFixed(2)}
- Recent transactions:\n${recentTx}
- Goals:\n${goalsInfo}

Context: User is viewing the ${context} screen.
Give advice relevant to this context. Be encouraging, not judgmental.
Keep responses under 100 words unless the user asks for detail.`;
    };

    const getWelcomeMessage = () => {
        if (context === "home") return "Hey! 👋 I'm Sika AI. I've looked at your finances — want a quick summary or do you have a question?";
        if (context === "transactions") return "Hey! 👋 I can see your transactions. Want me to analyze your spending patterns?";
        return "Hey! 👋 Let's talk about your savings goals. Want some tips on reaching them faster?";
    };

    const openModal = () => {
        if (messages.length === 0) {
            setMessages([{ role: "assistant", content: getWelcomeMessage() }]);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");
        const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                    "anthropic-version": "2023-06-01",
                    "anthropic-dangerous-direct-browser-access": "true",
                },
                body: JSON.stringify({
                    model: "claude-haiku-4-5-20251001",
                    max_tokens: 300,
                    system: getSystemPrompt(),
                    messages: newMessages.map(m => ({ role: m.role, content: m.content })),
                }),
            });

            const data = await response.json();
            const reply = data.content?.[0]?.text || "Sorry, I couldn't process that. Try again!";
            setMessages(prev => [...prev, { role: "assistant", content: reply }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: "assistant", content: "Oops! Something went wrong. Check your connection and try again." }]);
        } finally {
            setLoading(false);
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onShow={openModal}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="flex-1 justify-end">
                    {/* Backdrop */}
                    <TouchableOpacity
                        className="absolute inset-0 bg-black/40"
                        onPress={onClose}
                        activeOpacity={1}
                    />

                    {/* Modal Card */}
                    <View className="bg-white dark:bg-zinc-900 rounded-t-3xl h-3/4 overflow-hidden">

                        {/* Header */}
                        <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                            <View className="flex-row items-center gap-2">
                                <View className="w-8 h-8 rounded-full bg-green-900 items-center justify-center">
                                    <Sparkles size={16} color="#f5c518" />
                                </View>
                                <View>
                                    <Text className="font-bold text-gray-900 dark:text-white">Sika AI</Text>
                                    <Text className="text-xs text-green-600">Your financial assistant</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={onClose} className="p-2">
                                <X size={20} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>

                        {/* Messages */}
                        <ScrollView
                            ref={scrollRef}
                            className="flex-1 px-4 py-3"
                            showsVerticalScrollIndicator={false}
                        >
                            {messages.map((msg, i) => (
                                <View
                                    key={i}
                                    className={`mb-3 max-w-[85%] ${msg.role === "user" ? "self-end" : "self-start"}`}
                                >
                                    <View className={`px-4 py-3 rounded-2xl ${
                                        msg.role === "user"
                                            ? "bg-green-900 rounded-tr-sm"
                                            : "bg-gray-100 dark:bg-zinc-800 rounded-tl-sm"
                                    }`}>
                                        <Text className={`text-sm leading-5 ${
                                            msg.role === "user"
                                                ? "text-white"
                                                : "text-gray-800 dark:text-gray-200"
                                        }`}>
                                            {msg.content}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                            {loading && (
                                <View className="self-start bg-gray-100 dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm mb-3">
                                    <ActivityIndicator size="small" color="#2e7d32" />
                                </View>
                            )}
                        </ScrollView>

                        {/* Input */}
                        <View className="flex-row items-center px-4 py-3 border-t border-gray-100 dark:border-zinc-800 gap-3">
                            <TextInput
                                className="flex-1 bg-gray-50 dark:bg-zinc-800 rounded-2xl px-4 py-3 text-gray-800 dark:text-white text-sm"
                                placeholder="Ask me anything..."
                                placeholderTextColor="#9ca3af"
                                value={input}
                                onChangeText={setInput}
                                onSubmitEditing={sendMessage}
                                returnKeyType="send"
                            />
                            <TouchableOpacity
                                onPress={sendMessage}
                                disabled={loading || !input.trim()}
                                className="w-10 h-10 rounded-full bg-green-900 items-center justify-center"
                                style={{ opacity: input.trim() ? 1 : 0.5 }}
                            >
                                <Send size={16} color="white" />
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default SikaAIModal;