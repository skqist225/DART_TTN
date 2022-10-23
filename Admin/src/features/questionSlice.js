import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { data } from "jquery";
import api from "../axios";

export const fetchAllQuestions = createAsyncThunk(
    "question/fetchAllQuestions",
    async (
        { page = 1, query = "", sortField = "id", sortDir = "asc", subject },
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
                `/questions?page=${page}&query=${query}&sortField=${sortField}&sortDir=${sortDir}&subject=${subject}`
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
            const { data } = await api.post(`/questions/save`, postData, {
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

export const editQuestion = createAsyncThunk(
    "question/editQuestion",
    async (postData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/questions/save?isEdit=true`, postData, {
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

export const readExcelFile = createAsyncThunk(
    "question/readExcelFile",
    async (excelFile, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.set("file", excelFile);

            const {
                data: { questions, totalElements, totalPages },
            } = await api.post(`/questions/excel/read`, formData);

            return { questions, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addMultipleQuestions = createAsyncThunk(
    "question/addMultipleQuestions",
    async (questionsExcel, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.set("questions", questionsExcel);

            const { data } = await api.post(`/questions/save/multiple`, {
                questions: questionsExcel,
            });

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const enableOrDisableQuestion = createAsyncThunk(
    "question/enableQuestion",
    async ({ id, action }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/questions/${id}?action=${action}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    questions: [],
    questionsExcel: [],
    totalExcelElements: 0,
    totalExcelPages: 0,
    totalElements: 0,
    totalPages: 0,
    editedQuestion: null,
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
    addMultipleQuestions: {
        successMessage: null,
    },
    excelAdd: false,
    enableOrDisableQuestion: {
        successMessage: null,
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
            state.deleteQuestion.errorMessage = null;

            state.enableOrDisableQuestion.successMessage = null;
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
        setEditedQuestion(state, { payload }) {
            state.editedQuestion = payload;
        },
        setExcelAdd(state, { payload }) {
            state.excelAdd = payload;
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

            .addCase(readExcelFile.pending, (state, { payload }) => {
                state.loading = true;
            })
            .addCase(readExcelFile.fulfilled, (state, { payload }) => {
                state.loading = false;
                // state.questions = payload.questions;
                state.questionsExcel = payload.questions;
                state.totalExcelElements = payload.totalElements;
                state.totalExcelPages = payload.totalPages;
            })
            .addCase(readExcelFile.rejected, (state, { payload }) => {})

            .addCase(addMultipleQuestions.pending, (state, { payload }) => {})
            .addCase(addMultipleQuestions.fulfilled, (state, { payload }) => {
                state.addMultipleQuestions.successMessage = payload.data;
            })
            .addCase(addMultipleQuestions.rejected, (state, { payload }) => {})

            .addCase(enableOrDisableQuestion.pending, (state, { payload }) => {
                state.enableOrDisableQuestion.successMessage = null;
            })
            .addCase(enableOrDisableQuestion.fulfilled, (state, { payload }) => {
                state.enableOrDisableQuestion.successMessage = payload.data;
            })
            .addCase(enableOrDisableQuestion.rejected, (state, { payload }) => {})

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
                    state.addQuestion.successMessage = "Thêm câu hỏi thành công";
                }
            })
            .addCase(addQuestion.rejected, (state, { payload }) => {
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

            .addCase(editQuestion.pending, (state, _) => {
                state.editQuestion.successMessage = null;
                state.errorObject = null;
            })
            .addCase(editQuestion.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.editQuestion.successMessage = "Chỉnh sửa câu hỏi thành công";
                }
            })
            .addCase(editQuestion.rejected, (state, { payload }) => {
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
    actions: {
        clearQuestionState,
        clearErrorField,
        setFilterObject,
        setEditedQuestion,
        setExcelAdd,
    },
} = questionSlice;

export const questionState = state => state.question;
export default questionSlice.reducer;
