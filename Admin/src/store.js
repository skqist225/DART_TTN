import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { authSlice, questionSlice, subjectSlice, userSlice } from "./features";

const rootReducer = combineReducers({
    auth: authSlice,
    question: questionSlice,
    subject: subjectSlice,
    user: userSlice,
});

const localUser = localStorage.getItem("admin-user")
    ? JSON.parse(localStorage.getItem("admin-user"))
    : null;

const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
    preloadedState: {
        user: {
            user: localUser,
            loading: true,
            successMessage: null,
            errorMessage: null,
            wishlistsIDs: [],
            wishlists: [],
            bookedRooms: [],
            update: {
                loading: true,
                successMessage: null,
                errorMessage: null,
            },
            wishlistsIDsFetching: true,
            listing: {
                users: [],
                loading: true,
                totalElements: 0,
                totalPages: 0,
            },
            get: {
                loading: true,
                user: {},
            },
            addUserAction: {
                loading: true,
                successMessage: "",
                errorMessage: "",
            },
            deleteUserAction: {
                loading: true,
                successMessage: null,
                errorMessage: null,
            },
            updateUserAction: {
                loading: true,
                successMessage: null,
                errorMessage: null,
            },
            fetchRolesAction: {
                roles: [],
            },
        },
    },
});

export default store;
