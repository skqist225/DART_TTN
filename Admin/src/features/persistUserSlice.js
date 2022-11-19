import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const persistUserSlice = createSlice({
    name: "persistUser",
    initialState: {
        user: null,
    },
    reducers: {
        setUser: (state, { payload }) => {
            state.user = payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(PURGE, state => {
            state.user = null;
        });
    },
});

export const { setUser } = persistUserSlice.actions;

export const persistUserState = state => state.persistUser;
export default persistUserSlice.reducer;
