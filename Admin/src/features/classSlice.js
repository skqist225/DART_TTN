import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchAllClasses = createAsyncThunk(
    "class/fetchAllClasses",
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
                data: { classes, totalElements, totalPages },
            } = await api.get(
                `/classes?page=${page}&query=${query}&sortField=${sortField}&sortDir=${sortDir}`
            );

            return { classes, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const findClass = createAsyncThunk(
    "class/findClass",
    async ({ ClassId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/classes/${ClassId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addClass = createAsyncThunk(
    "class/addClass",
    async (postData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/classes/save`, postData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const editClass = createAsyncThunk(
    "class/editClass",
    async (postData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/classes/save?isEdit=true`, postData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const enableClass = createAsyncThunk(
    "class/enableClass",
    async (classId, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/classes/${classId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const disableClass = createAsyncThunk(
    "class/disableClass",
    async (classId, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/classes/${classId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    classes: [],
    totalElements: 0,
    totalPages: 0,
    editedClass: null,
    filterObject: {
        page: 1,
        query: "",
        sortField: "id",
        sortDir: "asc",
    },
    errorObject: null,
    addClass: {
        successMessage: null,
    },
    editClass: {
        successMessage: null,
    },
    deleteClass: {
        successMessage: null,
        errorMessage: null,
    },
};

const classSlice = createSlice({
    name: "class",
    initialState,
    reducers: {
        clearClassState(state) {
            state.addClass.successMessage = null;
            state.errorObject = null;

            state.editClass.successMessage = null;

            state.deleteClass.successMessage = null;
            state.deleteClass.errorObject = null;
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
        setEditedClass(state, { payload }) {
            state.editedClass = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllClasses.pending, (state, { payload }) => {})
            .addCase(fetchAllClasses.fulfilled, (state, { payload }) => {
                state.classes = payload.classes;
                state.totalElements = payload.totalElements;
                state.totalPages = payload.totalPages;
            })
            .addCase(fetchAllClasses.rejected, (state, { payload }) => {})

            .addCase(findClass.pending, (state, { payload }) => {})
            .addCase(findClass.fulfilled, (state, { payload }) => {
                // state.Class = payload.data;
            })
            .addCase(findClass.rejected, (state, { payload }) => {})

            .addCase(addClass.pending, (state, _) => {
                state.addClass.successMessage = null;
                state.errorObject = null;
            })
            .addCase(addClass.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.addClass.successMessage = "Thêm môn học thành công";
                }
            })
            .addCase(addClass.rejected, (state, { payload }) => {
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

            .addCase(editClass.pending, (state, _) => {
                state.editClass.successMessage = null;
                state.errorObject = null;
            })
            .addCase(editClass.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.editClass.successMessage = "Chỉnh sửa môn học thành công";
                }
            })
            .addCase(editClass.rejected, (state, { payload }) => {
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
            });
    },
});

export const {
    actions: { clearClassState, clearErrorField, setFilterObject, setEditedClass },
} = classSlice;

export const classState = state => state.class;
export default classSlice.reducer;
