import { Tabs } from 'expo-router';
import React from 'react';
import { House, Target, User, List } from 'lucide-react-native';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFonts, DMMono_400Regular } from '@expo-google-fonts/dm-mono';
import { TransactionProvider } from '../../context/TransactionContext';
import { GoalProvider } from '../../context/GoalContext';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <GoalProvider>
      <TransactionProvider>
        <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <House size={24} color={color} />,
        }}
      />      
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color }) => <Target size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <List size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={28} color={color} />,
        }}
      />      
    </Tabs>
    </TransactionProvider>
    </GoalProvider>
  );
}
