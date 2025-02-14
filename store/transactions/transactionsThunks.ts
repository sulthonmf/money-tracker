import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";
import {
  setTransactions,
  setLoading,
  setError,
  addTransaction,
} from "./transactionsSlice";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (userId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      dispatch(setTransactions(data || []));
    } catch (error: any) {
      console.error("Error in fetchTransactions:", error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (
    {
      name,
      amount,
      type,
      created_at,
      userId,
    }: {
      name: string;
      amount: number;
      type: string;
      created_at: Date;
      userId: string;
    },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            name,
            amount: type === "expense" ? -Math.abs(amount) : Math.abs(amount),
            type,
            created_at,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        dispatch(addTransaction(data));
      }

      return data;
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);
export { addTransaction };

