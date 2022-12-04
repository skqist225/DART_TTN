import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchAllRoles = createAsyncThunk(
    "role/fetchAllRoles",
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
                data: { roles, totalElements, totalPages },
            } = await api.get(
                `/admin/roles?page=${page}&query=${query}&sortField=${sortField}&sortDir=${sortDir}`
            );

            return { roles, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const findRole = createAsyncThunk(
    "role/findRole",
    async ({ roleId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/roles/${roleId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addRole = createAsyncThunk("role/addRole", async (postData, { rejectWithValue }) => {
    try {
        const { data } = await api.post(`/admin/roles/save`, postData);

        return { data };
    } catch ({ data: { error } }) {
        return rejectWithValue(error);
    }
});

export const editRole = createAsyncThunk("role/editRole", async (postData, { rejectWithValue }) => {
    try {
        const { data } = await api.post(`/admin/roles/save?isEdit=true`, postData);

        return { data };
    } catch ({ data: { error } }) {
        return rejectWithValue(error);
    }
});

export const deleteRole = createAsyncThunk(
    "role/deleteRole",
    async (roleId, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/admin/roles/${roleId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    roles: [],
    totalElements: 0,
    totalPages: 0,
    editedRole: null,
    filterObject: {
        page: 1,
        query: "",
        sortField: "id",
        sortDir: "asc",
    },
    errorObject: null,
    addRole: {
        successMessage: null,
    },
    editRole: {
        successMessage: null,
    },
    deleteRole: {
        successMessage: null,
        errorMessage: null,
    },
};

const roleSlice = createSlice({
    name: "role",
    initialState,
    reducers: {
        clearRoleState(state) {
            state.addRole.successMessage = null;
            state.errorObject = null;

            state.editRole.successMessage = null;

            state.deleteRole.successMessage = null;
            state.deleteRole.errorMessage = null;
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
        setEditedRole(state, { payload }) {
            state.editedRole = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllRoles.pending, (state, { payload }) => {
                state.loading = true;
            })
            .addCase(fetchAllRoles.fulfilled, (state, { payload }) => {
                state.roles = payload.roles;
                state.totalElements = payload.totalElements;
                state.totalPages = payload.totalPages;
                state.loading = false;
            })
            .addCase(fetchAllRoles.rejected, (state, { payload }) => {
                state.loading = false;
            })

            .addCase(findRole.pending, (state, { payload }) => {})
            .addCase(findRole.fulfilled, (state, { payload }) => {
                // state.role = payload.data;
            })
            .addCase(findRole.rejected, (state, { payload }) => {})

            .addCase(addRole.pending, (state, _) => {
                state.addRole.successMessage = null;
                state.errorObject = null;
            })
            .addCase(addRole.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.addRole.successMessage = "Thêm vai trò thành công";
                }
            })
            .addCase(addRole.rejected, (state, { payload }) => {
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

            .addCase(editRole.pending, (state, _) => {
                state.editRole.successMessage = null;
                state.errorObject = null;
            })
            .addCase(editRole.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.editRole.successMessage = "Chỉnh sửa vai trò thành công";
                }
            })
            .addCase(editRole.rejected, (state, { payload }) => {
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

            .addCase(deleteRole.pending, (state, _) => {
                state.deleteRole.successMessage = null;
                state.deleteRole.errorMessage = null;
            })
            .addCase(deleteRole.fulfilled, (state, { payload }) => {
                state.deleteRole.successMessage = payload.data;
            })
            .addCase(deleteRole.rejected, (state, { payload }) => {
                state.deleteRole.errorMessage = payload;
            });
    },
});

export const {
    actions: { clearRoleState, clearErrorField, setFilterObject, setEditedRole },
} = roleSlice;

export const roleState = state => state.role;
export default roleSlice.reducer;
