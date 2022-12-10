import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchAllTakeExamDetails = createAsyncThunk(
    "takeExamDetail/fetchAllTakeExamDetails",
    async (
        {
            page = 1,
            query = "",
            sortField = "id",
            sortDir = "desc",
            level = "",
            subject = "",
            numberOfTakeExamDetails = 0,
        },
        { dispatch, rejectWithValue }
    ) => {
        try {
            const filterArray = [];

            filterArray.push({
                field: "query",
                value: query,
            });

            filterArray.push({
                field: "page",
                value: page,
            });

            filterArray.push({
                field: "sortField",
                value: sortField,
            });

            filterArray.push({
                field: "sortDir",
                value: sortDir,
            });

            filterArray.push({
                field: "level",
                value: level,
            });

            filterArray.push({
                field: "subject",
                value: subject,
            });

            dispatch(setFilterObject(filterArray));

            const {
                data: { takeExamDetails, totalElements, totalPages },
            } = await api.get(
                `/takeExamDetails?page=${page}&query=${query}&sortField=${sortField}&sortDir=${sortDir}&level=${level}&subject=${subject}&numberOfTakeExamDetails=${numberOfTakeExamDetails}`
            );

            return { takeExamDetails, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const findTakeExamDetail = createAsyncThunk(
    "takeExamDetail/findTakeExamDetail",
    async ({ takeExamDetailId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/takeExamDetails/${takeExamDetailId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addTakeExamDetail = createAsyncThunk(
    "takeExamDetail/addTakeExamDetail",
    async (postData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/takeExamDetails/save`, postData, {
                headers: {
                    "Content-Type": "multipart/formData",
                },
            });

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const editTakeExamDetail = createAsyncThunk(
    "takeExamDetail/editTakeExamDetail",
    async (postData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/takeExamDetails/save?isEdit=true`, postData, {
                headers: {
                    "Content-Type": "multipart/formData",
                },
            });

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const deleteTakeExamDetail = createAsyncThunk(
    "takeExamDetail/deleteTakeExamDetail",
    async (takeExamDetailId, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/takeExamDetails/${takeExamDetailId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const enableOrDisableTakeExamDetail = createAsyncThunk(
    "takeExamDetail/enableTakeExamDetail",
    async ({ id, action }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/takeExamDetails/${id}?action=${action}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    takeExamDetails: [],
    totalElements: 0,
    totalPages: 0,
    editedTakeExamDetail: null,
    filterObject: {
        page: 1,
        query: "",
        sortField: "id",
        sortDir: "desc",
    },
    errorObject: null,
    addTakeExamDetail: {
        successMessage: null,
    },
    editTakeExamDetail: {
        successMessage: null,
    },
    deleteTakeExamDetail: {
        successMessage: null,
        errorMessage: null,
    },
    enableOrDisableTakeExamDetail: {
        successMessage: null,
    },
};

const takeExamDetailSlice = createSlice({
    name: "takeExamDetail",
    initialState,
    reducers: {
        clearTakeExamDetailState(state) {
            state.addTakeExamDetail.successMessage = null;
            state.errorObject = null;

            state.editTakeExamDetail.successMessage = null;

            state.deleteTakeExamDetail.successMessage = null;
            state.deleteTakeExamDetail.errorMessage = null;

            state.enableOrDisableTakeExamDetail.successMessage = null;
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
        setEditedTakeExamDetail(state, { payload }) {
            state.editedTakeExamDetail = payload;
        },
        resetLoadedTakeExamDetails(state, _) {
            state.loadedTakeExamDetails = [];
        },
        disableOrEnableLoadedTakeExamDetails(state, { payload }) {
            state.takeExamDetails = state.takeExamDetails.map(takeExamDetail => {
                if (takeExamDetail.id === payload) {
                    return {
                        ...takeExamDetail,
                        status: !takeExamDetail.status,
                    };
                }

                return takeExamDetail;
            });
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllTakeExamDetails.pending, (state, { payload }) => {})
            .addCase(fetchAllTakeExamDetails.fulfilled, (state, { payload }) => {
                state.takeExamDetails = payload.takeExamDetails;
                state.totalElements = payload.totalElements;
                state.totalPages = payload.totalPages;
            })
            .addCase(fetchAllTakeExamDetails.rejected, (state, { payload }) => {})

            .addCase(enableOrDisableTakeExamDetail.pending, (state, { payload }) => {
                state.enableOrDisableTakeExamDetail.successMessage = null;
            })
            .addCase(enableOrDisableTakeExamDetail.fulfilled, (state, { payload }) => {
                state.enableOrDisableTakeExamDetail.successMessage = payload.data;
            })
            .addCase(enableOrDisableTakeExamDetail.rejected, (state, { payload }) => {})

            .addCase(findTakeExamDetail.pending, (state, { payload }) => {})
            .addCase(findTakeExamDetail.fulfilled, (state, { payload }) => {
                // state.takeExamDetail = payload.data;
            })
            .addCase(findTakeExamDetail.rejected, (state, { payload }) => {})

            .addCase(addTakeExamDetail.pending, (state, _) => {
                state.addTakeExamDetail.successMessage = null;
                state.errorObject = null;
            })
            .addCase(addTakeExamDetail.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.addTakeExamDetail.successMessage = "Thêm câu hỏi thành công";
                }
            })
            .addCase(addTakeExamDetail.rejected, (state, { payload }) => {
                if (payload) {
                    const errors = JSON.parse(payload);
                    errors.forEach(error => {
                        const key = Object.keys(error)[0];
                        const value = error[key];

                        state.errorObject = {
                            ...state.errorObject,
                            [key]: value,
                        };
                    });
                }
            })

            .addCase(editTakeExamDetail.pending, (state, _) => {
                state.editTakeExamDetail.successMessage = null;
                state.errorObject = null;
            })
            .addCase(editTakeExamDetail.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.editTakeExamDetail.successMessage = "Chỉnh sửa câu hỏi thành công";
                }
            })
            .addCase(editTakeExamDetail.rejected, (state, { payload }) => {
                if (payload) {
                    const errors = JSON.parse(payload);
                    errors.forEach(error => {
                        const key = Object.keys(error)[0];
                        const value = error[key];

                        state.errorObject = {
                            ...state.errorObject,
                            [key]: value,
                        };
                    });
                }
            })

            .addCase(deleteTakeExamDetail.pending, (state, _) => {
                state.deleteTakeExamDetail.successMessage = null;
                state.deleteTakeExamDetail.errorMessage = null;
            })
            .addCase(deleteTakeExamDetail.fulfilled, (state, { payload }) => {
                state.deleteTakeExamDetail.successMessage = payload.data;
            })
            .addCase(deleteTakeExamDetail.rejected, (state, { payload }) => {
                state.deleteTakeExamDetail.errorMessage = payload;
            });
    },
});

export const {
    actions: {
        clearTakeExamDetailState,
        clearErrorField,
        setFilterObject,
        setEditedTakeExamDetail,
        disableOrEnableLoadedTakeExamDetails,
    },
} = takeExamDetailSlice;

export const takeExamDetailState = state => state.takeExamDetail;
export default takeExamDetailSlice.reducer;
