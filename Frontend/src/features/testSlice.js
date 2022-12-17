import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchAllTests = createAsyncThunk(
    "test/fetchAllTests",
    async (
        {
            page = 1,
            query = "",
            sortField = "id",
            sortDir = "desc",
            subject = "",
            notUsedTest = false,
            activeTest = false,
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
                data: { tests, totalElements, totalPages },
            } = await api.get(
                `/tests?page=${page}&query=${query}&sortField=${sortField}&sortDir=${sortDir}&subject=${subject}&notUsedTest=${notUsedTest}&activeTest=${activeTest}`
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

export const getTest = createAsyncThunk(
    "test/getTest",
    async ({ student = "", exam = "" }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/tests/get-test?student=${student}&exam=${exam}`);

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

export const handIn = createAsyncThunk(
    "test/handIn",
    async ({ exam, answers }, { rejectWithValue }) => {
        try {
            let ans = [];
            for (let [key, value] of answers) {
                ans.push({ questionId: key, answer: value });
            }
            const { data } = await api.post(`/tests/${exam}/handIn`, ans);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const editTest = createAsyncThunk("test/editTest", async (postData, { rejectWithValue }) => {
    try {
        const { data } = await api.post(`/tests/save?isEdit=true`, postData);

        return { data };
    } catch ({ data: { error } }) {
        return rejectWithValue(error);
    }
});

export const enableOrDisableTest = createAsyncThunk(
    "test/enableOrDisableTest",
    async ({ id, action }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/tests/${id}?action=${action}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const deleteTest = createAsyncThunk(
    "test/deleteTest",
    async (testId, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/tests/${testId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    tests: [],
    test: {},
    totalElements: 0,
    totalPages: 0,
    editedTest: null,
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
    enableOrDisableTest: {
        successMessage: null,
    },
    addTestDisabled: false,
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

            state.enableOrDisableTest.successMessage = null;

            state.tests = [];
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
        setEditedTest(state, { payload }) {
            state.editedTest = payload;
        },
        setTests(state, { payload }) {
            state.tests = payload;
        },
        setAddTestDisabled(state, { payload }) {
            state.addTestDisabled = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllTests.pending, (state, { payload }) => {
                state.loading = true;
            })
            .addCase(fetchAllTests.fulfilled, (state, { payload }) => {
                state.tests = payload.tests;
                state.totalElements = payload.totalElements;
                state.totalPages = payload.totalPages;
                state.loading = false;
            })
            .addCase(fetchAllTests.rejected, (state, { payload }) => {
                state.loading = false;
            })

            .addCase(findTest.pending, (state, { payload }) => {})
            .addCase(findTest.fulfilled, (state, { payload }) => {
                state.test = payload.data;
            })
            .addCase(findTest.rejected, (state, { payload }) => {})

            .addCase(getTest.pending, (state, { payload }) => {})
            .addCase(getTest.fulfilled, (state, { payload }) => {
                state.test = payload.data;
            })
            .addCase(getTest.rejected, (state, { payload }) => {})

            .addCase(handIn.pending, (state, { payload }) => {})
            .addCase(handIn.fulfilled, (state, { payload }) => {
                state.test = payload.data;
            })
            .addCase(handIn.rejected, (state, { payload }) => {})

            .addCase(addTest.pending, (state, _) => {
                state.addTest.successMessage = null;
                state.errorObject = null;
            })
            .addCase(addTest.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.addTest.successMessage = "Thêm đề thi thành công";
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
                    state.editTest.successMessage = "Chỉnh sửa đề thi thành công";
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

            .addCase(enableOrDisableTest.pending, (state, { payload }) => {
                state.enableOrDisableTest.successMessage = null;
            })
            .addCase(enableOrDisableTest.fulfilled, (state, { payload }) => {
                state.enableOrDisableTest.successMessage = payload.data;
            })
            .addCase(enableOrDisableTest.rejected, (state, { payload }) => {})

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
    actions: { clearTestState, setFilterObject, setEditedTest, setTests, setAddTestDisabled },
} = testSlice;

export const testState = state => state.test;
export default testSlice.reducer;
