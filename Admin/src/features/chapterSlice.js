import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchAllChapters = createAsyncThunk(
    "chapter/fetchAllChapters",
    async (
        { page = 1, query = "", sortField = "id", sortDir = "asc", subject = "" },
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
                data: { chapters, totalElements, totalPages },
            } = await api.get(
                `/chapters?page=${page}&query=${query}&sortField=${sortField}&sortDir=${sortDir}&subject=${subject}`
            );

            return { chapters, totalElements, totalPages };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const findChapter = createAsyncThunk(
    "chapter/findChapter",
    async ({ subjectId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/chapters/${subjectId}`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const addChapter = createAsyncThunk(
    "chapter/addChapter",
    async (postData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/chapters/save`, postData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const editChapter = createAsyncThunk(
    "chapter/editChapter",
    async (postData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/chapters/save?isEdit=true`, postData);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

export const deleteChapter = createAsyncThunk(
    "chapter/deleteChapter",
    async (subjectId, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/chapters/${subjectId}/delete`);

            return { data };
        } catch ({ data: { error } }) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: true,
    chapters: [],
    totalElements: 0,
    totalPages: 0,
    editedChapter: null,
    filterObject: {
        page: 1,
        query: "",
        sortField: "id",
        sortDir: "asc",
    },
    errorObject: null,
    addChapter: {
        successMessage: null,
    },
    editChapter: {
        successMessage: null,
    },
    deleteChapter: {
        successMessage: null,
        errorMessage: null,
    },
};

const chapterSlice = createSlice({
    name: "chapter",
    initialState,
    reducers: {
        clearChapterState(state) {
            state.addChapter.successMessage = null;
            state.errorObject = null;

            state.editChapter.successMessage = null;

            state.deleteChapter.successMessage = null;
            state.deleteChapter.errorObject = null;
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
        setEditedChapter(state, { payload }) {
            state.editedChapter = payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllChapters.pending, (state, { payload }) => {
                state.loading = true;
            })
            .addCase(fetchAllChapters.fulfilled, (state, { payload }) => {
                state.chapters = payload.chapters;
                state.totalElements = payload.totalElements;
                state.totalPages = payload.totalPages;
                state.loading = false;
            })
            .addCase(fetchAllChapters.rejected, (state, { payload }) => {
                state.loading = false;
            })

            .addCase(findChapter.pending, (state, { payload }) => {})
            .addCase(findChapter.fulfilled, (state, { payload }) => {
                // state.chapter = payload.data;
            })
            .addCase(findChapter.rejected, (state, { payload }) => {})

            .addCase(addChapter.pending, (state, _) => {
                state.addChapter.successMessage = null;
                state.errorObject = null;
            })
            .addCase(addChapter.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.addChapter.successMessage = "Thêm chương thành công";
                }
            })
            .addCase(addChapter.rejected, (state, { payload }) => {
                if (payload) {
                    const errors = JSON.parse(payload);
                    errors.forEach(error => {
                        if (error.id) {
                            state.errorObject = {
                                ...state.errorObject,
                                id: error.id,
                            };
                        }
                        if (error.name) {
                            state.errorObject = {
                                ...state.errorObject,
                                name: error.name,
                            };
                        }
                    });
                }
            })

            .addCase(editChapter.pending, (state, _) => {
                state.editChapter.successMessage = null;
                state.errorObject = null;
            })
            .addCase(editChapter.fulfilled, (state, { payload }) => {
                if (payload) {
                    state.editChapter.successMessage = "Chỉnh sửa chương thành công";
                }
            })
            .addCase(editChapter.rejected, (state, { payload }) => {
                if (payload) {
                    const errors = JSON.parse(payload);
                    errors.forEach(error => {
                        if (error.id) {
                            state.errorObject = {
                                ...state.errorObject,
                                id: error.id,
                            };
                        }
                        if (error.name) {
                            state.errorObject = {
                                ...state.errorObject,
                                name: error.name,
                            };
                        }
                    });
                }
            })

            .addCase(deleteChapter.pending, (state, _) => {
                state.deleteChapter.successMessage = null;
                state.deleteChapter.errorMessage = null;
            })
            .addCase(deleteChapter.fulfilled, (state, { payload }) => {
                state.deleteChapter.successMessage = payload.data;
            })
            .addCase(deleteChapter.rejected, (state, { payload }) => {
                state.deleteChapter.errorMessage = payload;
            });
    },
});

export const {
    actions: { clearChapterState, clearErrorField, setFilterObject, setEditedChapter },
} = chapterSlice;

export const chapterState = state => state.chapter;
export default chapterSlice.reducer;
