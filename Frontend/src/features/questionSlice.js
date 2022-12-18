import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchAllQuestions = createAsyncThunk(
    "question/fetchAllQuestions",
    async (
        {
            page = 1,
            query = "",
            sortField = "id",
            sortDir = "desc",
            subject = "",
            teacher = "",
            numberOfQuestions = 0,
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
                field: "subject",
                value: subject,
            });

            filterArray.push({
                field: "teacher",
                value: teacher,
            });

            dispatch(setFilterObject(filterArray));

            const {
                data: { questions, totalElements, totalPages },
            } = await api.get(
                `/questions?page=${page}&query=${query}&sortField=${sortField}&sortDir=${sortDir}&teacher=${teacher}&subject=${subject}&numberOfQuestions=${numberOfQuestions}`
            );

            return { questions, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const getQuestions = createAsyncThunk(
    "question/getQuestions",
    async ({ exam = "" }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/questions/get-questions?exam=${exam}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const loadQuestionsByCriteria = createAsyncThunk(
    "question/loadQuestionsByCriteria",
    async ({ subject = "", criteria = [], numberOfQuestions = 0 }, { rejectWithValue }) => {
        try {
            let request = `/questions/load?subject=${subject}`;

            if (criteria.length > 0) {
                criteria = criteria.map(
                    ({ chapterId, level, numberOfQuestions }) =>
                        `${chapterId},${level},${numberOfQuestions}`
                );

                request += `&criteria=${criteria.join(";")}`;
            } else {
                request += `&numberOfQuestions=${numberOfQuestions}`;
            }

            const { data } = await api.get(request);

            return { data };
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
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/questions/${id}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addMultipleQuestions = createAsyncThunk(
    "question/addMultipleQuestions",
    async ({ file }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.set("file", file);

            const { data } = await api.post(`/questions/save/multiple`, formData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const enableOrDisableQuestion = createAsyncThunk(
    "question/enableOrDisableQuestion",
    async ({ id, action }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/questions/${id}?action=${action}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const queryAvailableQuestions = createAsyncThunk(
    "question/queryAvailableQuestions",
    async ({ chapter, level, filterIndex }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                `/questions/queryAvailableQuestions?chapter=${chapter}&level=${level}&filterIndex=${filterIndex}`
            );

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    questions: [],
    totalExcelElements: 0,
    totalExcelPages: 0,
    totalElements: 0,
    totalPages: 0,
    editedQuestion: null,
    testedQuestions: [],
    filterObject: {
        page: 1,
        query: "",
        sortField: "id",
        sortDir: "desc",
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
        loading: false,
        successMessage: null,
        errorMessage: null,
    },
    excelAdd: false,
    enableOrDisableQuestion: {
        successMessage: null,
    },
    loadedQuestions: [],
    resetFilter: false,
    queryAvailableQuestionsArr: {},
};

const questionSlice = createSlice({
    name: "question",
    initialState,
    reducers: {
        clearQuestionState(state) {
            state.errorObject = null;

            state.addQuestion.successMessage = null;
            state.editQuestion.successMessage = null;

            state.deleteQuestion.successMessage = null;
            state.deleteQuestion.errorMessage = null;

            state.enableOrDisableQuestion.successMessage = null;

            state.addMultipleQuestions.loading = false;
            state.addMultipleQuestions.successMessage = null;
            state.addMultipleQuestions.errorMessage = null;
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
        disableOrEnableLoadedQuestions(state, { payload }) {
            state.questions = state.questions.map(question => {
                if (question.id === payload) {
                    return {
                        ...question,
                        status: !question.status,
                    };
                }

                return question;
            });
        },
        setResetFilter(state, { payload }) {
            state.resetFilter = payload;
        },
        setQuestions(state, { payload }) {
            state.questions = payload;
        },
        setTestedQuestions(state, { payload }) {
            state.testedQuestions = payload;
        },
        setExcelQuestions(state, { payload }) {
            state.testedQuestions = payload;
        },
        setQueryAvailableQuestionsArr(state, { payload }) {
            state.queryAvailableQuestionsArr = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllQuestions.pending, (state, { payload }) => {
                state.loading = true;
            })
            .addCase(fetchAllQuestions.fulfilled, (state, { payload }) => {
                state.questions = payload.questions;
                state.totalElements = payload.totalElements;
                state.totalPages = payload.totalPages;
                state.loading = false;
            })
            .addCase(fetchAllQuestions.rejected, (state, { payload }) => {
                state.loading = false;
            })

            .addCase(loadQuestionsByCriteria.pending, (state, { payload }) => {})
            .addCase(loadQuestionsByCriteria.fulfilled, (state, { payload }) => {
                state.questions = payload.data;
                state.totalElements = payload.data.length;
                state.totalPages = payload.data.length / 10;
            })
            .addCase(loadQuestionsByCriteria.rejected, (state, { payload }) => {})

            .addCase(addMultipleQuestions.pending, (state, { payload }) => {
                state.addMultipleQuestions.loading = true;
                state.addMultipleQuestions.successMessage = null;
                state.addMultipleQuestions.errorMessage = null;
            })
            .addCase(addMultipleQuestions.fulfilled, (state, { payload }) => {
                state.addMultipleQuestions.loading = false;
                state.addMultipleQuestions.successMessage = payload.data;
            })
            .addCase(addMultipleQuestions.rejected, (state, { payload }) => {
                state.addMultipleQuestions.loading = false;
                state.addMultipleQuestions.errorMessage = payload;
            })

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

            .addCase(getQuestions.pending, (state, { payload }) => {})
            .addCase(getQuestions.fulfilled, (state, { payload }) => {
                state.testedQuestions = payload.data;
            })
            .addCase(getQuestions.rejected, (state, { payload }) => {})

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

            .addCase(
                queryAvailableQuestions.fulfilled,
                (
                    state,
                    {
                        payload: {
                            data: { filterIndex, data },
                        },
                    }
                ) => {
                    state.queryAvailableQuestionsArr[filterIndex] = data;
                }
            )

            .addCase(deleteQuestion.pending, (state, _) => {
                state.deleteQuestion.successMessage = null;
                state.deleteQuestion.errorMessage = null;
            })
            .addCase(deleteQuestion.fulfilled, (state, { payload }) => {
                state.deleteQuestion.successMessage = payload.data;
            })
            .addCase(deleteQuestion.rejected, (state, { payload }) => {
                if (payload) {
                    state.deleteQuestion.errorMessage =
                        "Không thể xóa câu hỏi vì ràng buộc dữ liệu";
                }
            });
    },
});

export const {
    actions: {
        clearQuestionState,
        setFilterObject,
        setEditedQuestion,
        setExcelAdd,
        disableOrEnableLoadedQuestions,
        setResetFilter,
        setQuestions,
        setTestedQuestions,
        setExcelQuestions,
        setQueryAvailableQuestionsArr,
    },
} = questionSlice;

export const questionState = state => state.question;
export default questionSlice.reducer;
