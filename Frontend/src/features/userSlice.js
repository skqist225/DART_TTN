import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios";
import { setUser } from "./persistUserSlice";

export const fetchAllUsers = createAsyncThunk(
    "user/fetchAllUsers",
    async (
        {
            page = 1,
            query = "",
            sortField = "id",
            sortDir = "desc",
            roles = "",
            statuses = "1,0",
            role = "",
            limit = 0,
            creditClass = "",
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
                `/admin/users?page=${page}&query=${query}&sortField=${sortField}&sortDir=${sortDir}&roles=${roles}&statuses=${statuses}&role=${role}&limit=${limit}&creditClass=${creditClass}`
            );

            return { users, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const fetchUser = createAsyncThunk(
    "user/fetchUser",
    async ({ id }, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/users/${id}`);

            if (data) {
                dispatch(setUser(data));
            }

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

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

export const addMultipleUsers = createAsyncThunk(
    "user/addMultipleUsers",
    async ({ file }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.set("file", file);

            const { data } = await api.post(`/admin/users/save/multiple`, formData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    users: [],
    totalElements: 0,
    totalPages: 0,
    editedUser: null,
    currentEditedUser: null,
    currentEditedUserErrorObject: null,
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
    enableOrDisable: {
        successMessage: null,
        errorMessage: null,
    },
    addMultipleUsers: {
        loading: false,
        successMessage: null,
        errorMessage: null,
    },
    roles: [],
    userExcelAdd: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserState: (state, { payload }) => {
            state.addUser.successMessage = null;
            state.errorObject = null;

            state.editUser.successMessage = null;

            state.deleteUser.successMessage = null;
            state.deleteUser.errorMessage = null;

            state.addMultipleUsers.loading = false;
            state.addMultipleUsers.successMessage = null;
            state.addMultipleUsers.errorMessage = null;

            state.enableOrDisable.successMessage = null;
            state.enableOrDisable.errorMessage = null;

            state.currentEditedUser = null;
            state.currentEditedUserErrorObject = null;
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
        setUserExcelAdd(state, { payload }) {
            state.userExcelAdd = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllUsers.pending, (state, { payload }) => {
                state.loading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, { payload }) => {
                state.users = payload.users;
                state.totalElements = payload.totalElements;
                state.totalPages = payload.totalPages;
                state.loading = false;
            })
            .addCase(fetchAllUsers.rejected, (state, { payload }) => {
                state.loading = false;
            })

            .addCase(fetchUser.pending, (state, { payload }) => {
                state.currentEditedUser = null;
            })
            .addCase(fetchUser.fulfilled, (state, { payload }) => {
                state.currentEditedUser = payload.data;
            })
            .addCase(fetchUser.rejected, (state, { payload }) => {})

            .addCase(addUser.pending, (state, { payload }) => {
                state.addUser.successMessage = null;
                state.errorObject = null;
            })
            .addCase(addUser.fulfilled, (state, { payload }) => {
                state.addUser.successMessage = payload.data;
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
                state.editUser.successMessage = payload.data;
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
                state.deleteUser.errorMessage = "Không thể xóa người dùng vì ràng buộc dữ liệu";
            })

            .addCase(enableOrDisableUser.pending, (state, _) => {
                state.enableOrDisable.successMessage = null;
                state.enableOrDisable.errorMessage = null;
            })
            .addCase(enableOrDisableUser.fulfilled, (state, { payload }) => {
                state.enableOrDisable.successMessage = payload.data;
            })
            .addCase(enableOrDisableUser.rejected, (state, { payload }) => {
                state.enableOrDisable.errorMessage = payload;
            })

            .addCase(addMultipleUsers.pending, (state, _) => {
                state.addMultipleUsers.loading = true;
                state.addMultipleUsers.successMessage = null;
                state.addMultipleUsers.errorMessage = null;
            })
            .addCase(addMultipleUsers.fulfilled, (state, { payload }) => {
                state.addMultipleUsers.loading = false;
                state.addMultipleUsers.successMessage = payload.data;
            })
            .addCase(addMultipleUsers.rejected, (state, { payload }) => {
                state.addMultipleUsers.loading = false;
                state.addMultipleUsers.errorMessage = payload;
            });
    },
});

export const {
    clearUserState,
    clearErrorField,
    setFilterObject,
    setEditedUser,
    setErrorField,
    setUserExcelAdd,
} = userSlice.actions;

export const userState = state => state.user;
export default userSlice.reducer;
