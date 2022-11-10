import { configureStore } from "@reduxjs/toolkit";
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import {
    authSlice,
    chapterSlice,
    creditClassSlice,
    examSlice,
    questionSlice,
    registerSlice,
    roleSlice,
    subjectSlice,
    takeExamDetailSlice,
    takeExamSlice,
    testSlice,
    userSlice,
} from "./features";

const rootReducer = combineReducers({
    auth: authSlice,
    chapter: chapterSlice,
    creditClass: creditClassSlice,
    exam: examSlice,
    question: questionSlice,
    reigster: registerSlice,
    role: roleSlice,
    subject: subjectSlice,
    takeExam: takeExamSlice,
    takeExamDetail: takeExamDetailSlice,
    test: testSlice,
    user: userSlice,
});

const persistConfig = {
    key: "root",
    version: 1,
    whitelist: ["user"],
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
