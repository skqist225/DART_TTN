import { createSlice } from "@reduxjs/toolkit";

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
});

export const { setUser } = persistUserSlice.actions;

export const persistUserState = state => state.persistUser;
export default persistUserSlice.reducer;
