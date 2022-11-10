import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchAllTests = createAsyncThunk(
    "test/fetchAllTests",
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
                data: { tests, totalElements, totalPages },
            } = await api.get(
                `/tests?page=${page}&query=${query}&sortField=${sortField}&sortDir=${sortDir}`
            );

            return { tests, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const findTest = createAsyncThunk(
    "test/findTest",
    async ({ subjectId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/tests/${subjectId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addTest = createAsyncThunk("test/addTest", async (postData, { rejectWithValue }) => {
    try {
        const { data } = await api.post(`/tests/save`, postData);

        return { data };
    } catch ({ data: { error } }) {
        return rejectWithValue(error);
    }
});

export const editTest = createAsyncThunk("test/editTest", async (postData, { rejectWithValue }) => {
    try {
        const { data } = await api.post(`/tests/save?isEdit=true`, postData);

        return { data };
    } catch ({ data: { error } }) {
        return rejectWithValue(error);
    }
});

export const deleteTest = createAsyncThunk(
    "test/deleteTest",
    async (subjectId, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/tests/${subjectId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    tests: [],
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
    addTest: {
        successMessage: null,
    },
    editTest: {
        successMessage: null,
    },
    deleteTest: {
        successMessage: null,
        errorMessage: null,
    },
};

const testSlice = createSlice({
    name: "test",
    initialState,
    reducers: {
        clearTestState(state) {
            state.addTest.successMessage = null;
            state.errorObject = null;

            state.editTest.successMessage = null;

            state.deleteTest.successMessage = null;
            state.deleteTest.errorObject = null;
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
            state.editedTest = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllTests.pending, (state, { payload }) => {})
            .addCase(fetchAllTests.fulfilled, (state, { payload }) => {
                state.tests = payload.tests;
                state.totalElements = payload.totalElements;
                state.totalPages = payload.totalPages;
            })
            .addCase(fetchAllTests.rejected, (state, { payload }) => {})

            .addCase(findTest.pending, (state, { payload }) => {})
            .addCase(findTest.fulfilled, (state, { payload }) => {
                // state.test = payload.data;
            })
            .addCase(findTest.rejected, (state, { payload }) => {})

            .addCase(addTest.pending, (state, _) => {
                state.addTest.successMessage = null;
                state.errorObject = null;
            })
            .addCase(addTest.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.addTest.successMessage = "Thêm môn học thành công";
                }
            })
            .addCase(addTest.rejected, (state, { payload }) => {
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

            .addCase(editTest.pending, (state, _) => {
                state.editTest.successMessage = null;
                state.errorObject = null;
            })
            .addCase(editTest.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.editTest.successMessage = "Chỉnh sửa môn học thành công";
                }
            })
            .addCase(editTest.rejected, (state, { payload }) => {
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

            .addCase(deleteTest.pending, (state, _) => {
                state.deleteTest.successMessage = null;
                state.deleteTest.errorMessage = null;
            })
            .addCase(deleteTest.fulfilled, (state, { payload }) => {
                state.deleteTest.successMessage = payload.data;
            })
            .addCase(deleteTest.rejected, (state, { payload }) => {
                state.deleteTest.errorMessage = payload;
            });
    },
});

export const {
    actions: { clearTestState, clearErrorField, setFilterObject, setEditedTest },
} = testSlice;

export const testState = state => state.test;
export default testSlice.reducer;
