import { supabase } from "@/lib/supabase";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const signOut = createAsyncThunk("auth/signOut", async () => {
  await supabase.auth.signOut();
  return null;
});
