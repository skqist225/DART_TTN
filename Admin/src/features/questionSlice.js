import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const findAllQuestions = createAsyncThunk(
    "question/findAllQuestions",
    async (_, { rejectWithValue }) => {
        try {
            const {
                data: { questions, totalRecords, totalPages },
            } = await api.get(`/questions`);

            return { questions, totalRecords, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const findQuestion = createAsyncThunk(
    "question/findQuestion",
    async ({ questionId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/questions/${questionId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addQuestion = createAsyncThunk(
    "question/addQuestion",
    async (postData, { rejectWithValue }) => {
        try {
            const data = await api.post(`/questions/save`, postData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const editQuestion = createAsyncThunk(
    "question/editQuestion",
    async (postData, { rejectWithValue }) => {
        try {
            const data = await api.post(`/questions/save`, postData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const deleteQuestion = createAsyncThunk(
    "question/deleteQuestion",
    async (_, { rejectWithValue }) => {
        try {
            const data = await api.delete(`/questions/save`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    addQuestion: {
        loading: true,
        successMessage: null,
        errorMessage: null,
    },
};

const questionSlice = createSlice({
    name: "question",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(findAllQuestions.pending, (state, { payload }) => {})
            .addCase(findAllQuestions.fulfilled, (state, { payload }) => {})
            .addCase(findAllQuestions.rejected, (state, { payload }) => {})

            .addCase(findQuestion.pending, (state, { payload }) => {})
            .addCase(findQuestion.fulfilled, (state, { payload }) => {})
            .addCase(findQuestion.rejected, (state, { payload }) => {})

            .addCase(addQuestion.pending, (state, { payload }) => {})
            .addCase(addQuestion.fulfilled, (state, { payload }) => {})
            .addCase(addQuestion.rejected, (state, { payload }) => {})

            .addCase(editQuestion.pending, (state, { payload }) => {})
            .addCase(editQuestion.fulfilled, (state, { payload }) => {})
            .addCase(editQuestion.rejected, (state, { payload }) => {})

            .addCase(deleteQuestion.pending, (state, { payload }) => {})
            .addCase(deleteQuestion.fulfilled, (state, { payload }) => {})
            .addCase(deleteQuestion.rejected, (state, { payload }) => {});
    },
});
export const {
    actions: {},
} = questionSlice;

export const questionState = state => state.question;
export default questionSlice.reducer;
