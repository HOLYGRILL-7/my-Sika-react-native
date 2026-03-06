import React, {useState} from "react";
import {Text, View, ScrollView, TouchableOpacity} from "react-native";
import {Plus, Calendar, GraduationCap, Smartphone, Shield} from "lucide-react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import AddGoalModal from "../../components/AddgoalModal";

type Goal = {
    id: string;
    name: string;
    saved: number;
    target: number;
    deadline: string;
    status: "On Track" | "Behind";
    icon: "school" | "phone" | "shield";
};

const mockGoals: Goal[] = [
    {
        id: "1",
        name: "School Fees",
        saved: 1350,
        target: 2000,
        deadline: "Apr 30, 2026",
        status: "On Track",
        icon: "school",
    },
    {
        id: "2",
        name: "New Phone",
        saved: 400,
        target: 1500,
        deadline: "Jun 15, 2026",
        status: "Behind",
        icon: "phone",
    },
    {
        id: "3",
        name: "Emergency Fund",
        saved: 800,
        target: 5000,
        deadline: "Dec 31, 2026",
        status: "On Track",
        icon: "shield",
    },
    {
        id: "4",
        name: "Vacation Fund",
        saved: 200,
        target: 3000,
        deadline: "Aug 20, 2026",
        status: "Behind",
        icon: "shield",
    },
];

const totalSaved = mockGoals.reduce((sum, g) => sum + g.saved, 0);

const GoalIcon = ({icon}: {icon: Goal["icon"]}) => {
    if (icon === "school") return <GraduationCap size={20} color="#2d6a2d" />;
    if (icon === "phone") return <Smartphone size={20} color="#2d6a2d" />;
    return <Shield size={20} color="#2d6a2d" />;
};

const Goals = () => {
    // const [goals] = useState<Goal[]>(mockGoals);
    const [goals, setGoals] = useState<Goal[]>(mockGoals);
    const [showModal, setShowModal] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
                {/* Header */}
                <View className="px-6 pt-4 pb-2 flex-row justify-between items-center">
                    <Text className="text-2xl font-bold text-gray-900">Savings Goals</Text>
                </View>

                {/* Total Saved Card */}
                <View className="mx-6 mt-4 rounded-2xl p-6" style={{backgroundColor: "#e8f5e9"}}>
                    <Text className="text-sm font-semibold text-gray-500 text-center">Total Saved</Text>
                    <Text className="text-4xl font-bold text-green-700 text-center mt-1">
                        ₵{totalSaved.toLocaleString()}.00
                    </Text>
                </View>

                {/* Goals List */}
                <View className="px-6 mt-6 gap-4">
                    {goals.map((goal) => {
                        const progress = goal.saved / goal.target;
                        const progressPercent = Math.round(progress * 100);

                        return (
                            <View
                                key={goal.id}
                                className="bg-white rounded-2xl p-5"
                                style={{elevation: 2, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8}}
                            >
                                {/* Goal header */}
                                <View className="flex-row items-center justify-between mb-3">
                                    <View className="flex-row items-center gap-3">
                                        <View className="w-9 h-9 rounded-xl bg-green-50 items-center justify-center">
                                            <GoalIcon icon={goal.icon} />
                                        </View>
                                        <Text className="text-base font-bold text-gray-900">{goal.name}</Text>
                                    </View>
                                    <View
                                        className="px-3 py-1 rounded-full"
                                        style={{backgroundColor: goal.status === "On Track" ? "#e8f5e9" : "#fff3e0"}}
                                    >
                                        <Text
                                            className="text-xs font-semibold"
                                            style={{color: goal.status === "On Track" ? "#2e7d32" : "#e65100"}}
                                        >
                                            {goal.status}
                                        </Text>
                                    </View>
                                </View>

                                {/* Amounts */}
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-base font-bold text-gray-900">
                                        ₵{goal.saved.toLocaleString()}.00
                                    </Text>
                                    <Text className="text-sm text-gray-400">₵{goal.target.toLocaleString()}.00</Text>
                                </View>

                                {/* Progress bar */}
                                <View className="h-2 bg-orange-100 rounded-full overflow-hidden">
                                    <View
                                        className="h-2 rounded-full"
                                        style={{
                                            width: `${progressPercent}%`,
                                            backgroundColor: goal.status === "On Track" ? "#2e7d32" : "#f59e0b",
                                        }}
                                    />
                                </View>

                                {/* Deadline */}
                                <View className="flex-row items-center gap-2 mt-3">
                                    <Calendar size={13} color="#aaa" />
                                    <Text className="text-xs text-gray-400">Deadline: {goal.deadline}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Floating Add Button */}

            <TouchableOpacity
                onPress={() => setShowModal(true)}
                className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center"
                style={{
                    backgroundColor: "#2e7d32",
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                }}
            >
                <Plus size={28} color="white" />
            </TouchableOpacity>
            <AddGoalModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onAdd={(g) => {
                    setGoals((prev) => [g, ...prev]);
                    setShowModal(false);
                }}
            />
        </SafeAreaView>
    );
};

export default Goals;
