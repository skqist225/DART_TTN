import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import api from "../../axios";

export const fetchAllUsers = createAsyncThunk(
    "user/fetchAllUsers",
    async (
        { page = 1, query = "", roles = "User,Host,Admin", statuses = "1,0" },
        { rejectWithValue }
    ) => {
        try {
            const {
                data: { users, totalElements, totalPages },
            } = await api.get(
                `/admin/users/listings/${page}?query=${query}&roles=${roles}&statuses=${statuses}`
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
        const { data } = await api.post("/auth/register", user);

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

export const disableUser = createAsyncThunk(
    "user/disableUser",
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await api.put(`/admin/users/${id}/disable`);

            if (data) {
                dispatch(fetchAllUsers(1));
            }

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const enableUser = createAsyncThunk(
    "user/enableUser",
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await api.put(`/admin/users/${id}/enable`);

            if (data) {
                dispatch(fetchAllUsers(1));
            }

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const editUser = createAsyncThunk(
    "user/editUser",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/admin/users/${id}/update`, formData, {
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

export const fetchAllRoles = createAsyncThunk(
    "user/fetchAllRoles",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/roles`);
            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

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
    fetchRoles: {
        roles: [],
    },
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
                state.loading = true;
                state.user = payload.data;
            })
            .addCase(fetchUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload.data;
            })
            .addCase(fetchUser.rejected, (state, { payload }) => {
                state.loading = false;
            })

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
                state.updateUserAction.loading = true;
                state.updateUserAction.successMessage = null;
                state.updateUserAction.errorMessage = null;
            })
            .addCase(editUser.fulfilled, (state, { payload }) => {
                state.updateUserAction.loading = false;
                if (payload.data) {
                    state.updateUserAction.successMessage = "Update User Successfully";
                }
            })
            .addCase(editUser.rejected, (state, { payload }) => {
                state.updateUserAction.loading = false;
                state.updateUserAction.errorMessage = JSON.parse(payload);
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
            });
    },
});

export const { setUser, clearUserState, clearErrorField, setFilterObject, setEditedUser } =
    userSlice.actions;

export const userState = state => state.user;
export default userSlice.reducer;
