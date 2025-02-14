import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Transaction {
  id: string;
  created_at: string;
  amount: number;
  type: string;
  name: string;
  user_id: string;
}

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload); // Add to beginning of array
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setTransactions, addTransaction, setLoading, setError } =
  transactionsSlice.actions;

export default transactionsSlice.reducer; 