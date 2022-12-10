import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
    authSlice,
    chapterSlice,
    creditClassSlice,
    examSlice,
    persistUserSlice,
    questionSlice,
    registerSlice,
    roleSlice,
    subjectSlice,
    takeExamDetailSlice,
    takeExamSlice,
    testSlice,
    userSlice,
    statisticSlice,
} from "./features";

const rootReducer = combineReducers({
    auth: authSlice,
    chapter: chapterSlice,
    creditClass: creditClassSlice,
    exam: examSlice,
    question: questionSlice,
    register: registerSlice,
    role: roleSlice,
    subject: subjectSlice,
    takeExam: takeExamSlice,
    takeExamDetail: takeExamDetailSlice,
    test: testSlice,
    user: userSlice,
    persistUser: persistUserSlice,
    statistic: statisticSlice,
});

const localUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
    preloadedState: {
        persistUser: {
            user: localUser,
        },
    },
});

export default store;
