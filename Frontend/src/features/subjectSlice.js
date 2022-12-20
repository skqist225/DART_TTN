import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchAllSubjects = createAsyncThunk(
    "subject/fetchAllSubjects",
    async (
        {
            page = 1,
            query = "",
            sortField = "id",
            sortDir = "asc",
            haveChapter = false,
            teacher = "",
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

            dispatch(setFilterObject(filterArray));

            const {
                data: { subjects, totalElements, totalPages },
            } = await api.get(
                `/subjects?page=${page}&query=${query}&sortField=${sortField}&sortDir=${sortDir}&haveChapter=${haveChapter}&teacher=${teacher}`
            );

            return { subjects, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const fetchAllSubjectsFiltered = createAsyncThunk(
    "subject/fetchAllSubjectsFiltered",
    async ({ haveChapter = true, haveQuestion = true, teacher = "" }, { rejectWithValue }) => {
        try {
            const {
                data: { subjects },
            } = await api.get(
                `/subjects?page=0&haveChapter=${haveChapter}&haveQuestion=${haveQuestion}&teacher=${teacher}`
            );

            return { subjects };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const findSubject = createAsyncThunk(
    "subject/findSubject",
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/subjects/${id}`);

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
            const { data } = await api.post(`/subjects/save`, postData);

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
            const { data } = await api.post(`/subjects/save?isEdit=true`, postData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const deleteSubject = createAsyncThunk(
    "subject/deleteSubject",
    async (subjectId, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/subjects/${subjectId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    subjects: [],
    subjectsHaveQuestion: [],
    subject: null,
    totalElements: 0,
    totalPages: 0,
    editedSubject: null,
    filterObject: {
        page: 1,
        query: "",
        sortField: "id",
        sortDir: "asc",
    },
    errorObject: null,
    addSubject: {
        successMessage: null,
    },
    editSubject: {
        successMessage: null,
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
        clearSubjectState(state) {
            state.errorObject = null;

            state.addSubject.successMessage = null;
            state.editSubject.successMessage = null;
            state.editSubject.errorMessage = null;

            state.deleteSubject.successMessage = null;
            state.deleteSubject.errorMessage = null;
            state.deleteSubject.errorObject = null;
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
        setEditedSubject(state, { payload }) {
            state.editedSubject = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllSubjects.pending, (state, { payload }) => {
                state.loading = true;
            })
            .addCase(fetchAllSubjects.fulfilled, (state, { payload }) => {
                state.subjects = payload.subjects;
                state.totalElements = payload.totalElements;
                state.totalPages = payload.totalPages;
                state.loading = false;
            })
            .addCase(fetchAllSubjects.rejected, (state, { payload }) => {
                state.loading = false;
            })

            .addCase(findSubject.pending, (state, { payload }) => {})
            .addCase(findSubject.fulfilled, (state, { payload }) => {
                state.subject = payload.data;
            })
            .addCase(findSubject.rejected, (state, { payload }) => {})

            .addCase(addSubject.pending, (state, _) => {
                state.addSubject.successMessage = null;
                state.errorObject = null;
            })
            .addCase(addSubject.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.addSubject.successMessage = "Thêm môn học thành công";
                }
            })
            .addCase(addSubject.rejected, (state, { payload }) => {
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

            .addCase(fetchAllSubjectsFiltered.fulfilled, (state, { payload }) => {
                state.subjectsHaveQuestion = payload.subjects;
            })

            .addCase(editSubject.pending, (state, _) => {
                state.editSubject.successMessage = null;
                state.errorObject = null;
            })
            .addCase(editSubject.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.editSubject.successMessage = "Chỉnh sửa môn học thành công";
                }
            })
            .addCase(editSubject.rejected, (state, { payload }) => {
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

            .addCase(deleteSubject.pending, (state, _) => {
                state.deleteSubject.successMessage = null;
                state.deleteSubject.errorMessage = null;
            })
            .addCase(deleteSubject.fulfilled, (state, { payload }) => {
                state.deleteSubject.successMessage = payload.data;
            })
            .addCase(deleteSubject.rejected, (state, { payload }) => {
                state.deleteSubject.errorMessage = payload;
            });
    },
});

export const {
    actions: { clearSubjectState, clearErrorField, setFilterObject, setEditedSubject },
} = subjectSlice;

export const subjectState = state => state.subject;
export default subjectSlice.reducer;
