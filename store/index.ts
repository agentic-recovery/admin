"use client";
import { configureStore, createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface AdminUser { id: string; name: string; email: string; role: string; isSuperAdmin: boolean; }

interface AuthState {
  admin:        AdminUser | null;
  bootstrapped: boolean;
  loading:      boolean;
  error:        string | null;
}

export const bootstrapAdmin = createAsyncThunk("auth/bootstrap", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API}/api/admin/me`, { credentials: "include" });
    if (res.status === 401) return rejectWithValue("unauthenticated");
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.data as AdminUser;
  } catch (err: any) { return rejectWithValue(err.message); }
});

export const loginAdmin = createAsyncThunk("auth/login", async (
  creds: { email: string; password: string }, { rejectWithValue }
) => {
  try {
    const res = await fetch(`${API}/api/admin/login`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data.data.admin as AdminUser;
  } catch (err: any) { return rejectWithValue(err.message); }
});

export const registerAdmin = createAsyncThunk("auth/register", async (
  payload: { name: string; email: string; password: string }, { rejectWithValue }
) => {
  try {
    const res = await fetch(`${API}/api/admin/register`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    return data.data.admin as AdminUser;
  } catch (err: any) { return rejectWithValue(err.message); }
});

export const logoutAdmin = createAsyncThunk("auth/logout", async () => {
  await fetch(`${API}/api/admin/logout`, { method: "POST", credentials: "include" }).catch(() => {});
  Cookies.remove("admin-token");
});

const authSlice = createSlice({
  name: "auth",
  initialState: { admin: null, bootstrapped: false, loading: false, error: null } as AuthState,
  reducers: {
    clearError(state) { state.error = null; },
    clearAdmin(state) { state.admin = null; state.bootstrapped = true; },
  },
  extraReducers: (b) => {
    const pending   = (s: AuthState)                          => { s.loading = true;  s.error = null; };
    const rejected  = (s: AuthState, a: PayloadAction<any>)  => { s.loading = false; s.error = a.payload as string; };
    b.addCase(bootstrapAdmin.pending,   (s) => { s.loading = true; })
     .addCase(bootstrapAdmin.fulfilled, (s, a) => { s.loading = false; s.bootstrapped = true; s.admin = a.payload; })
     .addCase(bootstrapAdmin.rejected,  (s)    => { s.loading = false; s.bootstrapped = true; });
    b.addCase(loginAdmin.pending,    pending)
     .addCase(loginAdmin.fulfilled,  (s, a) => { s.loading = false; s.bootstrapped = true; s.admin = a.payload; })
     .addCase(loginAdmin.rejected,   rejected);
    b.addCase(registerAdmin.pending,   pending)
     .addCase(registerAdmin.fulfilled, (s, a) => { s.loading = false; s.bootstrapped = true; s.admin = a.payload; })
     .addCase(registerAdmin.rejected,  rejected);
    b.addCase(logoutAdmin.fulfilled, (s) => { s.admin = null; s.bootstrapped = true; });
  },
});

export const store = configureStore({ reducer: { auth: authSlice.reducer } });
export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const { clearError, clearAdmin } = authSlice.actions;

// StoreProvider is in store/Provider.tsx
