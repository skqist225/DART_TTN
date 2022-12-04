import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchAllTakeExams = createAsyncThunk(
    "takeExam/fetchAllTakeExams",
    async (
        {
            page = 1,
            query = "",
            sortField = "score",
            sortDir = "desc",
            subject = "",
            student = "",
            numberOfTakeExams = 0,
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
                field: "student",
                value: student,
            });

            filterArray.push({
                field: "subject",
                value: subject,
            });

            dispatch(setFilterObject(filterArray));

            const {
                data: { takeExams, totalElements, totalPages },
            } = await api.get(
                `/takeExams?page=${page}&query=${query}&sortField=${sortField}&sortDir=${sortDir}&student=${student}&subject=${subject}&numberOfTakeExams=${numberOfTakeExams}`
            );

            return { takeExams, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const findTakeExam = createAsyncThunk(
    "takeExam/findTakeExam",
    async ({ takeExamId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/takeExams/${takeExamId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addTakeExam = createAsyncThunk(
    "takeExam/addTakeExam",
    async (postData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/takeExams/save`, postData, {
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

export const editTakeExam = createAsyncThunk(
    "takeExam/editTakeExam",
    async (postData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/takeExams/save?isEdit=true`, postData, {
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

export const deleteTakeExam = createAsyncThunk(
    "takeExam/deleteTakeExam",
    async (takeExamId, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/takeExams/${takeExamId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const enableOrDisableTakeExam = createAsyncThunk(
    "takeExam/enableTakeExam",
    async ({ id, action }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/takeExams/${id}?action=${action}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    takeExams: [],
    totalElements: 0,
    totalPages: 0,
    editedTakeExam: null,
    filterObject: {
        page: 1,
        query: "",
        sortField: "id",
        sortDir: "desc",
    },
    errorObject: null,
    addTakeExam: {
        successMessage: null,
    },
    editTakeExam: {
        successMessage: null,
    },
    deleteTakeExam: {
        successMessage: null,
        errorMessage: null,
    },
    enableOrDisableTakeExam: {
        successMessage: null,
    },
};

const takeExamSlice = createSlice({
    name: "takeExam",
    initialState,
    reducers: {
        clearTakeExamState(state) {
            state.addTakeExam.successMessage = null;
            state.errorObject = null;

            state.editTakeExam.successMessage = null;

            state.deleteTakeExam.successMessage = null;
            state.deleteTakeExam.errorMessage = null;

            state.enableOrDisableTakeExam.successMessage = null;
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
        setEditedTakeExam(state, { payload }) {
            state.editedTakeExam = payload;
        },
        resetLoadedTakeExams(state, _) {
            state.loadedTakeExams = [];
        },
        disableOrEnableLoadedTakeExams(state, { payload }) {
            state.takeExams = state.takeExams.map(takeExam => {
                if (takeExam.id === payload) {
                    return {
                        ...takeExam,
                        status: !takeExam.status,
                    };
                }

                return takeExam;
            });
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllTakeExams.pending, (state, { payload }) => {
                state.loading = true;
            })
            .addCase(fetchAllTakeExams.fulfilled, (state, { payload }) => {
                state.takeExams = payload.takeExams;
                state.totalElements = payload.totalElements;
                state.totalPages = payload.totalPages;
                state.loading = false;
            })
            .addCase(fetchAllTakeExams.rejected, (state, { payload }) => {
                state.loading = false;
            })

            .addCase(enableOrDisableTakeExam.pending, (state, { payload }) => {
                state.enableOrDisableTakeExam.successMessage = null;
            })
            .addCase(enableOrDisableTakeExam.fulfilled, (state, { payload }) => {
                state.enableOrDisableTakeExam.successMessage = payload.data;
            })
            .addCase(enableOrDisableTakeExam.rejected, (state, { payload }) => {})

            .addCase(findTakeExam.pending, (state, { payload }) => {})
            .addCase(findTakeExam.fulfilled, (state, { payload }) => {
                // state.takeExam = payload.data;
            })
            .addCase(findTakeExam.rejected, (state, { payload }) => {})

            .addCase(addTakeExam.pending, (state, _) => {
                state.addTakeExam.successMessage = null;
                state.errorObject = null;
            })
            .addCase(addTakeExam.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.addTakeExam.successMessage = "Thêm câu hỏi thành công";
                }
            })
            .addCase(addTakeExam.rejected, (state, { payload }) => {
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

            .addCase(editTakeExam.pending, (state, _) => {
                state.editTakeExam.successMessage = null;
                state.errorObject = null;
            })
            .addCase(editTakeExam.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.editTakeExam.successMessage = "Chỉnh sửa câu hỏi thành công";
                }
            })
            .addCase(editTakeExam.rejected, (state, { payload }) => {
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

            .addCase(deleteTakeExam.pending, (state, _) => {
                state.deleteTakeExam.successMessage = null;
                state.deleteTakeExam.errorMessage = null;
            })
            .addCase(deleteTakeExam.fulfilled, (state, { payload }) => {
                state.deleteTakeExam.successMessage = payload.data;
            })
            .addCase(deleteTakeExam.rejected, (state, { payload }) => {
                state.deleteTakeExam.errorMessage = payload;
            });
    },
});

export const {
    actions: {
        clearTakeExamState,
        clearErrorField,
        setFilterObject,
        setEditedTakeExam,
        disableOrEnableLoadedTakeExams,
    },
} = takeExamSlice;

export const takeExamState = state => state.takeExam;
export default takeExamSlice.reducer;
