import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Session, User } from "@supabase/supabase-js";
import { checkSession } from "./getSession";
import { signIn } from "./signInThunk";
import { signOut } from "./signOutThunk";
import { signUp } from "./signUpThunk";
import { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  session: null,
  user: null,
  loading: false,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.session = action.payload;
        state.user = action.payload?.user || null;
        state.isAuthenticated = !!action.payload;
        state.loading = false;
      })
      .addCase(checkSession.rejected, (state) => {
        state.session = null;
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.session = action.payload;
        state.user = action.payload?.user || null;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.session = action.payload;
        state.user = action.payload?.user || null;
        state.isAuthenticated = !!action.payload;
        state.loading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(signOut.fulfilled, (state) => {
        state.session = null;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
