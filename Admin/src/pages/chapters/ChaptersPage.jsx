import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Frame, ChapterModalBody, ChapterTableBody, Table, ChapterFilter } from "../../components";
import {
    addChapter,
    clearChapterState,
    editChapter,
    fetchAllChapters,
    chapterState,
    setEditedChapter,
} from "../../features/chapterSlice";
import $ from "jquery";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { chapterSchema } from "../../validation";
import { fetchAllSubjects } from "../../features/subjectSlice";

const columns = [
    {
        name: "Mã chương",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Tên chương",
        sortField: "name",
        sortable: true,
    },
    {
        name: "Môn học",
        sortField: "chapter",
        sortable: true,
    },
];

function ChaptersPage() {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const formId = "chapterForm";
    const modalId = "chapterModal";
    const modalLabel = "chương";

    useEffect(() => {
        dispatch(
            fetchAllChapters({
                page: 1,
            })
        );
        dispatch(fetchAllSubjects({ page: 0 }));
    }, []);

    const {
        register,
        setValue,
        handleSubmit,
        control,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(chapterSchema),
        defaultValues: {
            chapters: [],
        },
    });

    const onSubmit = ({ subjectId, chapters }) => {
        if (chapters.some(({ name }) => !name)) {
            chapters.forEach(({ index, name }) => {
                if (!name) {
                    setError(`chapters.${index}.name`, {
                        type: "custom",
                        message: `Tên chương ${parseInt(index) + 1} không được để trống`,
                    });
                }
            });
            return;
        }

        const chaptersSet = new Set();
        chapters.forEach(({ name }) => chaptersSet.add(name));
        if (chapters.length !== chaptersSet.size) {
            callToast("error", "Không được có 2 chương giống tên");
            return;
        }

        chapters = chapters.map(({ id, index, name }) => {
            let namePrefix = `Chương ${parseInt(index) + 1}:`;
            if (!name.startsWith(namePrefix)) {
                name = `${namePrefix} ${name}`;
            }
            return {
                id,
                name,
            };
        });

        if (isEdit) {
            dispatch(editChapter({ subjectId, chapters }));
        } else {
            dispatch(addChapter({ subjectId, chapters }));
        }
    };

    const {
        chapters,
        totalElements,
        totalPages,
        filterObject,
        addChapter: { successMessage },
        editChapter: { successMessage: esSuccessMessage },
        deleteChapter: { successMessage: dsSuccessMessage },
    } = useSelector(chapterState);

    const handleQueryChange = ({ target: { value: query } }) => {
        dispatch(
            fetchAllChapters({
                ...filterObject,
                query,
            })
        );
    };

    const handleSortChange = (sortField, sortDir) => {
        dispatch(
            fetchAllChapters({
                ...filterObject,
                sortField,
                sortDir,
            })
        );
    };

    useEffect(() => {
        return () => {
            dispatch(clearChapterState());
        };
    }, []);

    function cleanForm(successMessage, type = "normal") {
        callToast("success", successMessage);
        dispatch(fetchAllChapters(filterObject));

        $(`#${modalId}`).css("display", "none");
        if (type === "add") {
            $(`#${formId}`)[0].reset();
        }

        if (type === "edit") {
            setIsEdit(false);
            dispatch(setEditedChapter(null));
        }
    }

    useEffect(() => {
        if (successMessage) {
            cleanForm(successMessage, "add");
        }
    }, [successMessage]);

    useEffect(() => {
        if (esSuccessMessage) {
            cleanForm(esSuccessMessage, "edit");
        }
    }, [esSuccessMessage]);

    useEffect(() => {
        if (dsSuccessMessage) {
            cleanForm(dsSuccessMessage, "delete");
        }
    }, [dsSuccessMessage]);

    function onCloseForm() {
        dispatch(setEditedChapter(null));
        setValue("chapters", []);
        clearErrors("chapters");
    }

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"DANH SÁCH CHƯƠNG"}
            children={
                <Table
                    searchPlaceHolder={"Tìm kiếm theo tên và mã chương"}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={columns}
                    rows={chapters}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={ChapterTableBody}
                    modalId={modalId}
                    formId={formId}
                    modalLabel={modalLabel}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    ModalBody={
                        <ChapterModalBody
                            errors={errors}
                            register={register}
                            dispatch={dispatch}
                            setValue={setValue}
                            control={control}
                            clearErrors={clearErrors}
                            setError={setError}
                        />
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    onCloseForm={onCloseForm}
                    Filter={ChapterFilter}
                />
            }
        />
    );
}

export default ChaptersPage;
