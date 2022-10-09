import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchAllQuestions = createAsyncThunk(
    "question/fetchAllQuestions",
    async (
        { page = 1, query = "", sortField = "id", sortDir = "asc" },
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

            dispatch(setFilterObject(filterArray));

            const {
                data: { questions, totalElements, totalPages },
            } = await api.get(
                `/questions?page=${page}&query=${query}&sortField=${sortField}&sortDir=${sortDir}`
            );

            return { questions, totalElements, totalPages };
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
            const { data } = await api.post(`/questions/save`, postData);

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
            const { data } = await api.post(`/questions/save?isEdit=true`, postData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const deleteQuestion = createAsyncThunk(
    "question/deleteQuestion",
    async (questionId, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/questions/${questionId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    questions: [],
    totalElements: 0,
    totalPages: 0,
    editedquestion: null,
    filterObject: {
        page: 1,
        query: "",
        sortField: "id",
        sortDir: "asc",
    },
    errorObject: null,
    addQuestion: {
        successMessage: null,
    },
    editQuestion: {
        successMessage: null,
    },
    deleteQuestion: {
        successMessage: null,
        errorMessage: null,
    },
};

const questionSlice = createSlice({
    name: "question",
    initialState,
    reducers: {
        clearQuestionState(state) {
            state.addQuestion.successMessage = null;
            state.errorObject = null;

            state.editQuestion.successMessage = null;

            state.deleteQuestion.successMessage = null;
            state.deleteQuestion.errorObject = null;
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
        setEditedquestion(state, { payload }) {
            state.editedQuestion = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllQuestions.pending, (state, { payload }) => {})
            .addCase(fetchAllQuestions.fulfilled, (state, { payload }) => {
                state.questions = payload.questions;
                state.totalElements = payload.totalElements;
                state.totalPages = payload.totalPages;
            })
            .addCase(fetchAllQuestions.rejected, (state, { payload }) => {})

            .addCase(findQuestion.pending, (state, { payload }) => {})
            .addCase(findQuestion.fulfilled, (state, { payload }) => {
                // state.question = payload.data;
            })
            .addCase(findQuestion.rejected, (state, { payload }) => {})

            .addCase(addQuestion.pending, (state, _) => {
                state.addQuestion.successMessage = null;
                state.errorObject = null;
            })
            .addCase(addQuestion.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.addQuestion.successMessage = "Thêm môn học thành công";
                }
            })
            .addCase(addQuestion.rejected, (state, { payload }) => {
                if (payload) {
                    const errors = JSON.parse(payload);
                    errors.forEach(error => {
                        if (error.id) {
                            state.errorObject = {
                                ...state.errorObject,
                                id: error.id,
                            };
                        }
                        if (error.name) {
                            state.errorObject = {
                                ...state.errorObject,
                                name: error.name,
                            };
                        }
                    });
                }
            })

            .addCase(editQuestion.pending, (state, _) => {
                state.editQuestion.successMessage = null;
                state.errorObject = null;
            })
            .addCase(editQuestion.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.editQuestion.successMessage = "Chỉnh sửa môn học thành công";
                }
            })
            .addCase(editQuestion.rejected, (state, { payload }) => {
                if (payload) {
                    const errors = JSON.parse(payload);
                    errors.forEach(error => {
                        if (error.id) {
                            state.errorObject = {
                                ...state.errorObject,
                                id: error.id,
                            };
                        }
                        if (error.name) {
                            state.errorObject = {
                                ...state.errorObject,
                                name: error.name,
                            };
                        }
                    });
                }
            })

            .addCase(deleteQuestion.pending, (state, _) => {
                state.deleteQuestion.successMessage = null;
                state.deleteQuestion.errorMessage = null;
            })
            .addCase(deleteQuestion.fulfilled, (state, { payload }) => {
                state.deleteQuestion.successMessage = payload.data;
            })
            .addCase(deleteQuestion.rejected, (state, { payload }) => {
                state.deleteQuestion.errorMessage = payload;
            });
    },
});

export const {
    actions: { clearQuestionState, clearErrorField, setFilterObject, setEditedquestion },
} = questionSlice;

export const questionState = state => state.question;
export default questionSlice.reducer;
