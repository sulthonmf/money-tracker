import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }: { email: string; password: string }) => {
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return session;
  }
);
