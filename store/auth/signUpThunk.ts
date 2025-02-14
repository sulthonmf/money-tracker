import { supabase } from "@/lib/supabase";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    {
      email,
      password,
      name,
    }: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) return rejectWithValue(error.message);
    return data.session;
  }
);
