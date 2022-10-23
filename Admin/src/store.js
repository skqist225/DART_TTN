import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
    authSlice,
    classSlice,
    questionSlice,
    subjectSlice,
    testSlice,
    userSlice,
} from "./features";

const rootReducer = combineReducers({
    auth: authSlice,
    question: questionSlice,
    subject: subjectSlice,
    user: userSlice,
    class: classSlice,
    test: testSlice,
});

const localUser = localStorage.getItem("admin-user")
    ? JSON.parse(localStorage.getItem("admin-user"))
    : null;

const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
    preloadedState: {
        user: {
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
            roles: [],
        },
    },
});

export default store;
