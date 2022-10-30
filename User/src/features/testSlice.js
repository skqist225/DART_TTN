import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const findTest = createAsyncThunk(
    "test/findTest",
    async ({ testId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/tests/${testId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const handIn = createAsyncThunk(
    "test/handIn",
    async ({ testId, answers }, { rejectWithValue }) => {
        try {
            const ans = [];
            for (let [key, value] of answers) {
                ans.push({ id: key, answer: value });
            }

            const { data } = await api.post(`/tests/${testId}/handIn`, ans);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    tests: [],
    test: {},
    totalElements: 0,
    totalPages: 0,
    editedsubject: null,
    filterObject: {
        page: 1,
        query: "",
        sortField: "id",
        sortDir: "asc",
    },
};

const testSlice = createSlice({
    name: "test",
    initialState,
    reducers: {
        clearTestState(state) {
            state.addTest.successMessage = null;
            state.errorObject = null;

            state.editTest.successMessage = null;

            state.deleteTest.successMessage = null;
            state.deleteTest.errorObject = null;
        },
        clearErrorField(state, { payload }) {
            if (payload) {
                if (state.errorObject && state.errorObject[payload]) {
                    delete state.errorObject[payload];
                }
            }
        },
        setFilterObject(state, { payload }) {
            if (payload) {
                payload.forEach(({ field, value }) => {
                    state.filterObject = {
                        ...state.filterObject,
                        [field]: value,
                    };
                });
            }
        },
        setEditedsubject(state, { payload }) {
            state.editedTest = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(findTest.pending, (state, { payload }) => {})
            .addCase(findTest.fulfilled, (state, { payload }) => {
                state.test = payload.data;
            })
            .addCase(findTest.rejected, (state, { payload }) => {})

            .addCase(handIn.pending, (state, { payload }) => {})
            .addCase(handIn.fulfilled, (state, { payload }) => {
                state.test = payload.data;
            })
            .addCase(handIn.rejected, (state, { payload }) => {});
    },
});

export const {
    actions: { clearTestState, clearErrorField, setFilterObject, setEditedTest },
} = testSlice;

export const testState = state => state.test;
export default testSlice.reducer;
