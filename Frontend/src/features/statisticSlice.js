import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const countTotalRecords = createAsyncThunk(
    "statistic/countTotalRecords",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/statistics`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const doughnut = createAsyncThunk("statistic/doughnut", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/admin/statistics/doughnut`);

        return { data };
    } catch ({ data: { error } }) {
        return rejectWithValue(error);
    }
});

export const countTestsBySubjectAndStatus = createAsyncThunk(
    "statistic/countTestsBySubjectAndStatus",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/statistics/countTestsBySubjectAndStatus`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    countTotal: {},
    doughnut: {
        countQuestionsBySubject: [],
        countExamsByCreditClass: [],
    },
    countTestsBySubjectAndStatuses: [],
};

const statisticSlice = createSlice({
    name: "statistic",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(countTotalRecords.pending, (state, { payload }) => {});
        builder.addCase(countTotalRecords.fulfilled, (state, { payload }) => {
            state.countTotal = payload.data;
        });
        builder.addCase(countTotalRecords.rejected, (state, { payload }) => {});

        builder.addCase(doughnut.pending, (state, { payload }) => {});
        builder.addCase(doughnut.fulfilled, (state, { payload }) => {
            state.doughnut.countQuestionsBySubject = payload.data.countQuestionsBySubject;
            state.doughnut.countExamsByCreditClass = payload.data.countExamsByCreditClass;
        });
        builder.addCase(doughnut.rejected, (state, { payload }) => {});

        builder.addCase(countTestsBySubjectAndStatus.pending, (state, { payload }) => {});
        builder.addCase(countTestsBySubjectAndStatus.fulfilled, (state, { payload }) => {
            state.countTestsBySubjectAndStatuses = payload.data;
        });
        builder.addCase(countTestsBySubjectAndStatus.rejected, (state, { payload }) => {});
    },
});

export const {
    actions: {},
} = statisticSlice;

export const statisticState = state => state.statistic;
export default statisticSlice.reducer;
