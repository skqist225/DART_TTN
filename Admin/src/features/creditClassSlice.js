import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchAllCreditClasses = createAsyncThunk(
    "creditClass/fetchAllCreditClasses",
    async (
        {
            page = 1,
            query = "",
            sortField = "id",
            sortDir = "desc",
            subject = "",
            active = false,
            teacher,
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

            dispatch(setFilterObject(filterArray));

            const {
                data: { creditClasses, totalElements, totalPages },
            } = await api.get(
                `/creditClasses?page=${page}&query=${query}&sortField=${sortField}&sortDir=${sortDir}&subject=${subject}&active=${active}&teacher=${teacher}`
            );

            return { creditClasses, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const findCreditClass = createAsyncThunk(
    "creditClass/findCreditClass",
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/creditClasses/${id}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addCreditClass = createAsyncThunk(
    "creditClass/addCreditClass",
    async (postData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/creditClasses/save`, postData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const editCreditClass = createAsyncThunk(
    "creditClass/editCreditClass",
    async (postData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/creditClasses/save?isEdit=true`, postData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const deleteCreditClass = createAsyncThunk(
    "creditClass/deleteClass",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/creditClasses/${id}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const enableOrDisableCreditClass = createAsyncThunk(
    "creditClass/enableOrDisableCreditClass",
    async ({ id, action }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/creditClasses/${id}?action=${action}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    creditClasses: [],
    totalElements: 0,
    totalPages: 0,
    editedCreditClass: null,
    filterObject: {
        page: 1,
        query: "",
        sortField: "id",
        sortDir: "asc",
    },
    errorObject: null,
    addCreditClass: {
        successMessage: null,
    },
    editCreditClass: {
        successMessage: null,
    },
    deleteCreditClass: {
        successMessage: null,
        errorMessage: null,
    },
    enableOrDisableCreditClass: {
        successMessage: null,
    },
};

const creditClassSlice = createSlice({
    name: "creditClass",
    initialState,
    reducers: {
        clearCreditClassState(state) {
            state.addCreditClass.successMessage = null;
            state.errorObject = null;

            state.editCreditClass.successMessage = null;

            state.deleteCreditClass.successMessage = null;
            state.deleteCreditClass.errorObject = null;
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
        setEditedCreditClass(state, { payload }) {
            state.editedCreditClass = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllCreditClasses.pending, (state, { payload }) => {})
            .addCase(fetchAllCreditClasses.fulfilled, (state, { payload }) => {
                state.creditClasses = payload.creditClasses;
                state.totalElements = payload.totalElements;
                state.totalPages = payload.totalPages;
            })
            .addCase(fetchAllCreditClasses.rejected, (state, { payload }) => {})

            .addCase(findCreditClass.pending, (state, { payload }) => {})
            .addCase(findCreditClass.fulfilled, (state, { payload }) => {
                // state.Class = payload.data;
            })
            .addCase(findCreditClass.rejected, (state, { payload }) => {})

            .addCase(addCreditClass.pending, (state, _) => {
                state.addCreditClass.successMessage = null;
                state.errorObject = null;
            })
            .addCase(addCreditClass.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.addCreditClass.successMessage = "Thêm lớp tín chỉ thành công";
                }
            })
            .addCase(addCreditClass.rejected, (state, { payload }) => {
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
            .addCase(editCreditClass.pending, (state, _) => {
                state.editCreditClass.successMessage = null;
                state.errorObject = null;
            })
            .addCase(editCreditClass.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.editCreditClass.successMessage = "Chỉnh sửa lớp tín chỉ thành công";
                }
            })
            .addCase(editCreditClass.rejected, (state, { payload }) => {
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
            .addCase(deleteCreditClass.fulfilled, (state, { payload }) => {
                state.deleteCreditClass.successMessage = payload.data;
            })

            .addCase(enableOrDisableCreditClass.pending, (state, { payload }) => {
                state.enableOrDisableCreditClass.successMessage = null;
            })
            .addCase(enableOrDisableCreditClass.fulfilled, (state, { payload }) => {
                state.enableOrDisableCreditClass.successMessage = payload.data;
            })
            .addCase(enableOrDisableCreditClass.rejected, (state, { payload }) => {});
    },
});

export const {
    actions: { clearCreditClassState, clearErrorField, setFilterObject, setEditedCreditClass },
} = creditClassSlice;

export const creditClassState = state => state.creditClass;
export default creditClassSlice.reducer;
