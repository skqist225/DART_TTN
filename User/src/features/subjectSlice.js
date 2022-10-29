import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchAllSubjectsBrief = createAsyncThunk(
    "subject/fetchAllSubjectsBrief",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/subjects/brief`);

            return { data };
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
    subject: null,
    totalElements: 0,
    totalPages: 0,
    editedsubject: null,
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
            state.addSubject.successMessage = null;
            state.errorObject = null;

            state.editSubject.successMessage = null;

            state.deleteSubject.successMessage = null;
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
        setEditedsubject(state, { payload }) {
            state.editedSubject = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllSubjectsBrief.pending, (state, { payload }) => {})
            .addCase(fetchAllSubjectsBrief.fulfilled, (state, { payload }) => {
                state.subjects = payload.data;
            })
            .addCase(fetchAllSubjectsBrief.rejected, (state, { payload }) => {})

            .addCase(findSubject.pending, (state, { payload }) => {})
            .addCase(findSubject.fulfilled, (state, { payload }) => {
                state.subject = payload.data;
            })
            .addCase(findSubject.rejected, (state, { payload }) => {})

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
    actions: { clearSubjectState, clearErrorField, setFilterObject, setEditedsubject },
} = subjectSlice;

export const subjectState = state => state.subject;
export default subjectSlice.reducer;
