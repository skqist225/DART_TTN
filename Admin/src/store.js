import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

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

const persistConfig = {
    key: "root",
    version: 1,
    whitelist: ["persistUser"],
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store;
