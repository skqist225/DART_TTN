import { configureStore } from "@reduxjs/toolkit";
import {
    persistStore,
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
