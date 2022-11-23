import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../axios";
import { setUser } from "./persistUserSlice";

export const login = createAsyncThunk(
    "auth/login",
    async (loginInfo, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await api.post("/auth/login?admin=true", loginInfo);

            if (data) {
                dispatch(setUser(data));
            }

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (resetPasswordData, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/auth/reset-password`, resetPasswordData);

            return { data };
        } catch ({ data: { errorMessage } }) {
            return rejectWithValue(errorMessage);
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (forgotPassword, { rejectWithValue }) => {
        try {
            const {
                data: { message, resetPasswordCode, email },
            } = await api.post("/auth/forgot-password", forgotPassword);

            return { message, resetPasswordCode, email };
        } catch ({ data: { errorMessage } }) {
            return rejectWithValue(errorMessage);
        }
    }
);

export const register = createAsyncThunk("auth/register", async (user, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/auth/register", user);

        return { data };
    } catch ({ data: { error } }) {
        return rejectWithValue(error);
    }
});

export const checkEmail = createAsyncThunk(
    "auth/checkEmail",
    async (email, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`auth/check-email/${email}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    errorMessage: null,
    successMessage: "",
    loginAction: {
        loading: true,
        errorMessage: null,
        successMessage: null,
    },
    checkEmailAction: {
        loading: true,
        errorMessage: null,
        successMessage: null,
    },
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearErrorMessage(state, _) {
            state.errorMessage = null;
        },
        clearSuccessMessage(state, _) {
            state.successMessage = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(register.fulfilled, (state, { payload }) => {
                state.loading = false;
            })
            .addCase(login.pending, (state, { payload }) => {
                state.loginAction.loading = true;
                state.loginAction.errorMessage = null;
                state.loginAction.successMessage = null;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.loginAction.loading = false;
                state.loginAction.successMessage = "Login successfully";
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.loginAction.loading = false;
                state.loginAction.errorMessage = payload;
            })
            .addCase(checkEmail.pending, (state, { payload }) => {
                state.checkEmailAction.loading = true;
                state.checkEmailAction.errorMessage = null;
                state.checkEmailAction.successMessage = null;
            })
            .addCase(checkEmail.fulfilled, (state, { payload }) => {
                state.checkEmailAction.loading = false;
                state.checkEmailAction.successMessage = payload;
            })
            .addCase(checkEmail.rejected, (state, { payload }) => {
                state.checkEmailAction.loading = false;
                state.checkEmailAction.errorMessage = payload;
            })
            .addCase(
                forgotPassword.fulfilled,
                (state, { payload: { message, resetPasswordCode, email } }) => {
                    state.successMessage = message;
                    localStorage.setItem("email", email);
                    localStorage.setItem("resetPasswordCode", resetPasswordCode);
                }
            )
            .addCase(resetPassword.fulfilled, (state, { payload }) => {
                state.successMessage = payload.data;
            })

            .addMatcher(
                isAnyOf(
                    // logout.pending,
                    forgotPassword.pending,
                    resetPassword.pending
                    // addUser.pending
                ),
                (state, _) => {
                    state.loading = true;
                }
            )
            .addMatcher(
                isAnyOf(
                    // logout.rejected,
                    forgotPassword.rejected,
                    resetPassword.rejected
                    // addUser.rejected
                ),
                (state, { payload }) => {
                    state.loading = false;
                    if (payload) state.errorMessage = payload;
                }
            );
    },
});

export const { clearErrorMessage, clearSuccessMessage } = authSlice.actions;
export const authState = state => state.auth;
export default authSlice.reducer;
