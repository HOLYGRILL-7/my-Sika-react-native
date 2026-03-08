import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import {Transaction} from '../constants/mockData';

type TransactionContextType = {
    transactions: Transaction[];
    addTransaction: (transaction: Transaction) => void;
    clearTransactions: () => void;
};

const STORAGE_KEY = "sika_transactions";

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({children}: {children: ReactNode}) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Load from AsyncStorage on app start
    useEffect(() => {
        const load = async () => {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) setTransactions(JSON.parse(stored));
        };
        load();
    }, []);

    // Save to AsyncStorage whenever transactions change
    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }, [transactions]);

    const addTransaction = (transaction: Transaction) => {
        setTransactions((prev) => [transaction, ...prev]);
    };

    const clearTransactions = () => {
        setTransactions([]);
        AsyncStorage.removeItem(STORAGE_KEY);
    };

    return (
        <TransactionContext.Provider value={{transactions, addTransaction, clearTransactions}}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};