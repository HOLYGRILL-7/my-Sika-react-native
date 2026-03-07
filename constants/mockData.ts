export type Transaction = {
    id: string;
    name: string;
    category: string;
    date: string;
    time: string;
    amount: number;
    type: "credit" | "debit";
};

export const mockTransactions: Transaction[] = [];
