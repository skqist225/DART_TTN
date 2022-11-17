import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import api from "../axios";

export const fetchAllUsers = createAsyncThunk(
    "user/fetchAllUsers",
    async (
        {
            page = 1,
            query = "",
            sortField = "id",
            sortDir = "asc",
            roles = "",
            statuses = "1,0",
            role = "",
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
                data: { users, totalElements, totalPages },
            } = await api.get(
                `/admin/users?page=${page}&query=${query}&sortField=${sortField}&sortDir=${sortDir}&roles=${roles}&statuses=${statuses}&role=${role}`
            );

            return { users, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const fetchUser = createAsyncThunk("user/fetchUser", async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/admin/users/${id}`);

        return { data };
    } catch ({ data: { error } }) {
        return rejectWithValue(error);
    }
});

export const addUser = createAsyncThunk("user/addUser", async (user, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/auth/register", user, {
            headers: {
                "Content-Type": "multipart/formData",
            },
        });

        return { data };
    } catch ({ data: { error } }) {
        return rejectWithValue(error);
    }
});

export const deleteUser = createAsyncThunk("user/deleteUser", async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.delete(`/admin/users/${id}`);

        return { data };
    } catch ({ data: { error } }) {
        return rejectWithValue(error);
    }
});

export const enableOrDisableUser = createAsyncThunk(
    "user/enableOrDisableUser",
    async ({ id, action }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/admin/users/${id}/${action}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const editUser = createAsyncThunk("user/editUser", async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.post(`/auth/register?isEdit=true`, formData, {
            headers: {
                "Content-Type": "multipart/formData",
            },
        });

        return { data };
    } catch ({ data: { error } }) {
        return rejectWithValue(error);
    }
});

const initialState = {
    loading: true,
    user: null,
    users: [],
    totalElements: 0,
    totalPages: 0,
    editedUser: null,
    filterObject: {
        page: 1,
        query: "",
        sortField: "id",
        sortDir: "asc",
    },
    errorObject: null,
    addUser: {
        successMessage: null,
    },
    deleteUser: {
        successMessage: null,
        errorMessage: null,
    },
    editUser: {
        successMessage: null,
    },
    enableOrDisableUser: {
        successMessage: null,
    },
    roles: [],
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, { payload }) => {
            state.user = payload;
        },
        clearUserState: (state, { payload }) => {
            state.addUser.successMessage = null;
            state.errorObject = null;

            state.editUser.successMessage = null;

            state.deleteUser.successMessage = null;
            state.deleteUser.errorMessage = null;
        },
        setErrorField(state, { payload: { key, value } }) {
            state.errorObject[key] = value;
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
        setEditedUser(state, { payload }) {
            state.editedUser = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllUsers.pending, (state, { payload }) => {})
            .addCase(fetchAllUsers.fulfilled, (state, { payload }) => {
                state.users = payload.users;
                state.totalElements = payload.totalElements;
                state.totalPages = payload.totalPages;
            })
            .addCase(fetchAllUsers.rejected, (state, { payload }) => {})

            .addCase(fetchUser.pending, (state, { payload }) => {
                state.user = null;
            })
            .addCase(fetchUser.fulfilled, (state, { payload }) => {
                state.user = payload.data;
            })
            .addCase(fetchUser.rejected, (state, { payload }) => {})

            .addCase(addUser.pending, (state, { payload }) => {
                state.addUser.successMessage = null;
                state.errorObject = null;
            })
            .addCase(addUser.fulfilled, (state, { payload }) => {
                if (payload.data) {
                    state.addUser.successMessage = "Thêm người dùng thành công";
                }
            })
            .addCase(addUser.rejected, (state, { payload }) => {
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

            .addCase(editUser.pending, (state, { payload }) => {
                state.editUser.successMessage = null;
                state.errorObject = null;
            })
            .addCase(editUser.fulfilled, (state, { payload }) => {
                if (payload.data) {
                    state.editUser.successMessage = "Cập nhật người dùng thành công";
                }
            })
            .addCase(editUser.rejected, (state, { payload }) => {
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

            .addCase(deleteUser.pending, (state, { payload }) => {
                state.deleteUser.successMessage = null;
                state.deleteUser.errorMessage = null;
            })
            .addCase(deleteUser.fulfilled, (state, { payload }) => {
                state.deleteUser.successMessage = payload.data;
            })
            .addCase(deleteUser.rejected, (state, { payload }) => {
                state.deleteUser.errorMessage = payload;
            })

            .addCase(enableOrDisableUser.pending, (state, { payload }) => {
                state.enableOrDisableUser.successMessage = null;
            })
            .addCase(enableOrDisableUser.fulfilled, (state, { payload }) => {
                state.enableOrDisableUser.successMessage = payload.data;
            })
            .addCase(enableOrDisableUser.rejected, (state, { payload }) => {})

            .addCase(PURGE, state => {
                state.user = null;
                state.addUser.successMessage = null;
                state.errorObject = null;

                state.editUser.successMessage = null;

                state.deleteUser.successMessage = null;
                state.deleteUser.errorMessage = null;

                state.enableOrDisableUser.successMessage = null;
            });
    },
});

export const {
    setUser,
    clearUserState,
    clearErrorField,
    setFilterObject,
    setEditedUser,
    setErrorField,
} = userSlice.actions;

export const userState = state => state.user;
export default userSlice.reducer;
