import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchAllRegisters = createAsyncThunk(
    "register/fetchAllRegisters",
    async (
        { page = 1, query = "", sortField = "id", sortDir = "desc", creditClass = "" },
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
                field: "creditClass",
                value: creditClass,
            });

            dispatch(setFilterObject(filterArray));

            const {
                data: { registers, totalElements, totalPages },
            } = await api.get(
                `/registers?page=${page}&query=${query}&sortField=${sortField}&sortDir=${sortDir}&creditClass=${creditClass}`
            );

            return { registers, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const findRegister = createAsyncThunk(
    "register/findRegister",
    async ({ registerId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/registers/${registerId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addRegister = createAsyncThunk(
    "register/addRegister",
    async (postData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/registers/save`, postData, {
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

export const editRegister = createAsyncThunk(
    "register/editRegister",
    async (postData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/registers/save?isEdit=true`, postData, {
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

export const deleteRegister = createAsyncThunk(
    "register/deleteRegister",
    async (registerId, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/registers/${registerId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const enableOrDisableRegister = createAsyncThunk(
    "register/enableOrDisableRegister",
    async ({ id: { creditClassId, studentId }, action }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(
                `/registers/${creditClassId}/${studentId}?action=${action}`
            );

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addMultipleRegisters = createAsyncThunk(
    "register/addMultipleRegisters",
    async ({ file }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.set("file", file);

            const { data } = await api.post(`/registers/save/multiple`, formData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    registers: [],
    totalElements: 0,
    totalPages: 0,
    editedRegister: null,
    filterObject: {
        page: 1,
        query: "",
        sortField: "id",
        sortDir: "desc",
    },
    registerExcelAdd: false,
    errorObject: null,
    addRegister: {
        successMessage: null,
    },
    editRegister: {
        successMessage: null,
    },
    deleteRegister: {
        successMessage: null,
        errorMessage: null,
    },
    enableOrDisableRegister: {
        successMessage: null,
    },
    addMultipleRegisters: {
        loading: false,
        successMessage: null,
        errorMessage: null,
    },
};

const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        clearRegisterState(state) {
            state.addRegister.successMessage = null;
            state.errorObject = null;

            state.editRegister.successMessage = null;

            state.deleteRegister.successMessage = null;
            state.deleteRegister.errorMessage = null;

            state.enableOrDisableRegister.successMessage = null;

            state.addMultipleRegisters.loading = false;
            state.addMultipleRegisters.successMessage = null;
            state.addMultipleRegisters.errorMessage = null;
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
        setEditedRegister(state, { payload }) {
            state.editedRegister = payload;
        },
        resetLoadedRegisters(state, _) {
            state.loadedRegisters = [];
        },
        disableOrEnableLoadedRegisters(state, { payload }) {
            state.registers = state.registers.map(register => {
                if (register.id === payload) {
                    return {
                        ...register,
                        status: !register.status,
                    };
                }

                return register;
            });
        },
        setRegisterExcelAdd(state, { payload }) {
            state.registerExcelAdd = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllRegisters.pending, (state, { payload }) => {})
            .addCase(fetchAllRegisters.fulfilled, (state, { payload }) => {
                state.registers = payload.registers;
                state.totalElements = payload.totalElements;
                state.totalPages = payload.totalPages;
            })
            .addCase(fetchAllRegisters.rejected, (state, { payload }) => {})

            .addCase(enableOrDisableRegister.pending, (state, { payload }) => {
                state.enableOrDisableRegister.successMessage = null;
            })
            .addCase(enableOrDisableRegister.fulfilled, (state, { payload }) => {
                state.enableOrDisableRegister.successMessage = payload.data;
            })
            .addCase(enableOrDisableRegister.rejected, (state, { payload }) => {})

            .addCase(findRegister.pending, (state, { payload }) => {})
            .addCase(findRegister.fulfilled, (state, { payload }) => {
                // state.register = payload.data;
            })
            .addCase(findRegister.rejected, (state, { payload }) => {})

            .addCase(addRegister.pending, (state, _) => {
                state.addRegister.successMessage = null;
                state.errorObject = null;
            })
            .addCase(addRegister.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.addRegister.successMessage = "Thêm câu hỏi thành công";
                }
            })
            .addCase(addRegister.rejected, (state, { payload }) => {
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

            .addCase(editRegister.pending, (state, _) => {
                state.editRegister.successMessage = null;
                state.errorObject = null;
            })
            .addCase(editRegister.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.editRegister.successMessage = "Chỉnh sửa câu hỏi thành công";
                }
            })
            .addCase(editRegister.rejected, (state, { payload }) => {
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

            .addCase(deleteRegister.pending, (state, _) => {
                state.deleteRegister.successMessage = null;
                state.deleteRegister.errorMessage = null;
            })
            .addCase(deleteRegister.fulfilled, (state, { payload }) => {
                state.deleteRegister.successMessage = payload.data;
            })
            .addCase(deleteRegister.rejected, (state, { payload }) => {
                state.deleteRegister.errorMessage = payload;
            })

            .addCase(addMultipleRegisters.pending, (state, { payload }) => {
                state.addMultipleRegisters.loading = true;
                state.addMultipleRegisters.successMessage = null;
                state.addMultipleRegisters.errorMessage = null;
            })
            .addCase(addMultipleRegisters.fulfilled, (state, { payload }) => {
                state.addMultipleRegisters.loading = false;
                state.addMultipleRegisters.successMessage = payload.data;
            })
            .addCase(addMultipleRegisters.rejected, (state, { payload }) => {
                state.addMultipleRegisters.loading = false;
                state.addMultipleRegisters.errorMessage = payload.data;
            });
    },
});

export const {
    actions: {
        clearRegisterState,
        clearErrorField,
        setFilterObject,
        setEditedRegister,
        disableOrEnableLoadedRegisters,
        setRegisterExcelAdd,
    },
} = registerSlice;

export const registerState = state => state.register;
export default registerSlice.reducer;
