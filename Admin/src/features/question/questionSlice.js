import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axios";

export const findAllQuestions = createAsyncThunk(
    "room/fetchRooms",
    async (_, { dispatch, getState, rejectWithValue }) => {
        try {
            // const {
            //     data: { rooms, totalRecords, totalPages },
            // } = await api.get(
            //     `/admin/rooms?page=${page}&query=${query}&price=${price}&roomStatus=${roomStatus}`
            // );
            // return { rooms, totalRecords, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const findQuestion = createAsyncThunk(
    "question/findQuestion",
    async ({ questionId }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/question/${questionId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addQuestion = createAsyncThunk(
    "question/addQuestion",
    async (formData, { dispatch, getState, rejectWithValue }) => {
        try {
            const data = await api.post(`/question/save`, formData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {};

const questionSlice = createSlice({
    name: "question",
    initialState,
    reducers: {},
    extraReducers: {},
});
export const {
    actions: {},
} = questionSlice;

export const questionState = state => state.question;
export default questionSlice.reducer;
