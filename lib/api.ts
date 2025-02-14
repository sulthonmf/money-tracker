import { supabase } from "@/lib/supabase";

export async function fetchTransactions(userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("amount, type, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }
  return data;
}
