import { supabase } from "@/lib/supabase";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const checkSession = createAsyncThunk("auth/checkSession", async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
});
