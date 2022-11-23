import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchAllExams = createAsyncThunk(
    "exam/fetchAllExams",
    async (
        {
            page = 1,
            query = "",
            sortField = "id",
            sortDir = "desc",
            level = "",
            subject = "",
            numberOfExams = 0,
            teacher = "",
            creditClass = "",
            student = "",
            schoolYear = "",
            semester = "",
            type = "",
            taken = "",
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

            filterArray.push({
                field: "creditClass",
                value: creditClass,
            });

            filterArray.push({
                field: "teacher",
                value: teacher,
            });

            filterArray.push({
                field: "student",
                value: student,
            });

            filterArray.push({
                field: "schoolYear",
                value: schoolYear,
            });

            filterArray.push({
                field: "semester",
                value: semester,
            });

            filterArray.push({
                field: "type",
                value: type,
            });

            dispatch(setFilterObject(filterArray));

            const {
                data: { exams, totalElements, totalPages },
            } = await api.get(
                `/exams?page=${page}&query=${query}&sortField=${sortField}&sortDir=${sortDir}&level=${level}&subject=${subject}&numberOfExams=${numberOfExams}&teacher=${teacher}&creditClass=${creditClass}&student=${student}&type=${type}&schoolYear=${schoolYear}&semester=${semester}&taken=${taken}`
            );

            return { exams, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const findExam = createAsyncThunk(
    "exam/findExam",
    async ({ examId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/exams/${examId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addExam = createAsyncThunk("exam/addExam", async (postData, { rejectWithValue }) => {
    try {
        const { data } = await api.post(`/exams/save`, postData);

        return { data };
    } catch ({ data: { error } }) {
        return rejectWithValue(error);
    }
});

export const editExam = createAsyncThunk("exam/editExam", async (postData, { rejectWithValue }) => {
    try {
        const { data } = await api.post(`/exams/save?isEdit=true`, postData);

        return { data };
    } catch ({ data: { error } }) {
        return rejectWithValue(error);
    }
});

export const deleteExam = createAsyncThunk(
    "exam/deleteExam",
    async (examId, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/exams/${examId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const enableOrDisableExam = createAsyncThunk(
    "exam/enableExam",
    async ({ id, action }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/exams/${id}?action=${action}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    exams: [],
    totalElements: 0,
    totalPages: 0,
    editedExam: null,
    filterObject: {
        page: 1,
        query: "",
        sortField: "id",
        sortDir: "desc",
        teacher: "",
        student: "",
        creditClass: "",
        type: "",
    },
    errorObject: null,
    addExam: {
        successMessage: null,
    },
    editExam: {
        successMessage: null,
    },
    deleteExam: {
        successMessage: null,
        errorMessage: null,
    },
    enableOrDisableExam: {
        successMessage: null,
    },
};

const examSlice = createSlice({
    name: "exam",
    initialState,
    reducers: {
        clearExamState(state) {
            state.addExam.successMessage = null;
            state.errorObject = null;

            state.editExam.successMessage = null;

            state.deleteExam.successMessage = null;
            state.deleteExam.errorMessage = null;

            state.enableOrDisableExam.successMessage = null;
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
        setEditedExam(state, { payload }) {
            state.editedExam = payload;
        },
        resetLoadedExams(state, _) {
            state.loadedExams = [];
        },
        disableOrEnableLoadedExams(state, { payload }) {
            state.exams = state.exams.map(exam => {
                if (exam.id === payload) {
                    return {
                        ...exam,
                        status: !exam.status,
                    };
                }

                return exam;
            });
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllExams.pending, (state, { payload }) => {})
            .addCase(fetchAllExams.fulfilled, (state, { payload }) => {
                state.exams = payload.exams;
                state.totalElements = payload.totalElements;
                state.totalPages = payload.totalPages;
            })
            .addCase(fetchAllExams.rejected, (state, { payload }) => {})

            .addCase(enableOrDisableExam.pending, (state, { payload }) => {
                state.enableOrDisableExam.successMessage = null;
            })
            .addCase(enableOrDisableExam.fulfilled, (state, { payload }) => {
                state.enableOrDisableExam.successMessage = payload.data;
            })
            .addCase(enableOrDisableExam.rejected, (state, { payload }) => {})

            .addCase(findExam.pending, (state, { payload }) => {})
            .addCase(findExam.fulfilled, (state, { payload }) => {
                // state.exam = payload.data;
            })
            .addCase(findExam.rejected, (state, { payload }) => {})

            .addCase(addExam.pending, (state, _) => {
                state.addExam.successMessage = null;
                state.errorObject = null;
            })
            .addCase(addExam.fulfilled, (state, { payload }) => {
                state.addExam.successMessage = payload.data;
            })
            .addCase(addExam.rejected, (state, { payload }) => {
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

            .addCase(editExam.pending, (state, _) => {
                state.editExam.successMessage = null;
                state.errorObject = null;
            })
            .addCase(editExam.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.editExam.successMessage = "Chỉnh sửa ca thi thành công";
                }
            })
            .addCase(editExam.rejected, (state, { payload }) => {
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

            .addCase(deleteExam.pending, (state, _) => {
                state.deleteExam.successMessage = null;
                state.deleteExam.errorMessage = null;
            })
            .addCase(deleteExam.fulfilled, (state, { payload }) => {
                state.deleteExam.successMessage = payload.data;
            })
            .addCase(deleteExam.rejected, (state, { payload }) => {
                state.deleteExam.errorMessage = payload;
            });
    },
});

export const {
    actions: {
        clearExamState,
        clearErrorField,
        setFilterObject,
        setEditedExam,
        disableOrEnableLoadedExams,
    },
} = examSlice;

export const examState = state => state.exam;
export default examSlice.reducer;
