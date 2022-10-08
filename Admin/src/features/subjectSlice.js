import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchAllSubjects = createAsyncThunk(
    "subject/fetchAllSubjects",
    async ({ page = 1, query = "" }, { rejectWithValue }) => {
        try {
            const {
                data: { subjects, totalElements, totalPages },
            } = await api.get(`/subjects?page=${page}&query=${query}`);

            return { subjects, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const findSubject = createAsyncThunk(
    "subject/findSubject",
    async ({ subjectId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/subjects/${subjectId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addSubject = createAsyncThunk(
    "subject/addSubject",
    async (postData, { rejectWithValue }) => {
        try {
            const data = await api.post(`/subjects/save`, postData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const editSubject = createAsyncThunk(
    "subject/editSubject",
    async (postData, { rejectWithValue }) => {
        try {
            const data = await api.post(`/subjects/save`, postData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const deleteSubject = createAsyncThunk(
    "subject/deleteSubject",
    async (_, { rejectWithValue }) => {
        try {
            const data = await api.delete(`/subjects/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    subjects: [],
    totalElements: 0,
    totalPages: 0,
    subject: null,
    addSubject: {
        successMessage: null,
        errorObject: null,
    },
    editSubject: {
        successMessage: null,
        errorObject: null,
    },
    deleteSubject: {
        successMessage: null,
        errorMessage: null,
    },
};

const subjectSlice = createSlice({
    name: "subject",
    initialState,
    reducers: {
        clearAddSubjectState(state) {
            state.addSubject.successMessage = null;
            state.addSubject.errorObject = null;
        },
        clearErrorField(state, { payload }) {
            if (payload) {
                if (state.addSubject.errorObject && state.addSubject.errorObject[payload]) {
                    delete state.addSubject.errorObject[payload];
                }
            }
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllSubjects.pending, (state, { payload }) => {})
            .addCase(fetchAllSubjects.fulfilled, (state, { payload }) => {
                state.subjects = payload.subjects;
                state.totalElements = payload.totalElements;
                state.totalPages = payload.totalPages;
            })
            .addCase(fetchAllSubjects.rejected, (state, { payload }) => {})

            .addCase(findSubject.pending, (state, { payload }) => {})
            .addCase(findSubject.fulfilled, (state, { payload }) => {
                state.subject = payload.data;
            })
            .addCase(findSubject.rejected, (state, { payload }) => {})

            .addCase(addSubject.pending, (state, _) => {
                state.addSubject.successMessage = null;
                state.addSubject.errorObject = null;
            })
            .addCase(addSubject.fulfilled, (state, { payload }) => {
                if (payload.data) {
                    state.addSubject.successMessage = "Thêm môn học thành công";
                }
            })
            .addCase(addSubject.rejected, (state, { payload }) => {
                if (payload) {
                    const errors = JSON.parse(payload);
                    errors.forEach(error => {
                        if (error.id) {
                            state.addSubject.errorObject = {
                                ...state.addSubject.errorObject,
                                id: error.id,
                            };
                        }
                        if (error.name) {
                            state.addSubject.errorObject = {
                                ...state.addSubject.errorObject,
                                name: error.name,
                            };
                        }
                    });
                }
            })

            .addCase(editSubject.pending, (state, _) => {
                state.editSubject.successMessage = null;
                state.editSubject.errorMessage = null;
            })
            .addCase(editSubject.fulfilled, (state, { payload }) => {
                state.editSubject.successMessage = payload;
            })
            .addCase(editSubject.rejected, (state, { payload }) => {
                state.editSubject.errorMessage = payload;
            })

            .addCase(deleteSubject.pending, (state, _) => {
                state.deleteSubject.successMessage = null;
                state.deleteSubject.errorMessage = null;
            })
            .addCase(deleteSubject.fulfilled, (state, { payload }) => {
                state.deleteSubject.successMessage = payload;
            })
            .addCase(deleteSubject.rejected, (state, { payload }) => {
                state.deleteSubject.errorMessage = payload;
            });
    },
});

export const {
    actions: { clearAddSubjectState, clearErrorField },
} = subjectSlice;

export const subjectState = state => state.subject;
export default subjectSlice.reducer;
