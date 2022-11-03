import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Frame, ChapterModalBody, ChapterTableBody, Table } from "../../components";
import {
    addChapter,
    clearChapterState,
    editChapter,
    fetchAllChapters,
    chapterState,
} from "../../features/chapterSlice";
import $ from "jquery";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { chapterSchema } from "../../validation";
import { fetchAllSubjects } from "../../features/subjectSlice";

function ChaptersPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(chapterSchema),
    });

    const onSubmit = data => {
        if (isEdit) {
            dispatch(editChapter(data));
        } else {
            dispatch(addChapter(data));
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

    useEffect(() => {
        if (successMessage) {
            callToast("success", successMessage);
            $("#chapterForm")[0].reset();
            $("#chapterModal").css("display", "none");
            dispatch(fetchAllChapters(filterObject));
        }
    }, [successMessage]);

    useEffect(() => {
        if (esSuccessMessage) {
            callToast("success", esSuccessMessage);
            dispatch(fetchAllChapters(filterObject));
            $("#chapterModal").css("display", "none");
            setIsEdit(false);
        }
    }, [esSuccessMessage]);

    useEffect(() => {
        if (dsSuccessMessage) {
            callToast("success", dsSuccessMessage);
            dispatch(fetchAllChapters(filterObject));
        }
    }, [dsSuccessMessage]);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            fetchAllChapters({
                page: 1,
            })
        );
        dispatch(fetchAllSubjects({ page: 0 }));
    }, []);

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
                    TableBody={
                        <ChapterTableBody
                            rows={chapters}
                            setIsEdit={setIsEdit}
                            dispatch={dispatch}
                        />
                    }
                    modalId='chapterModal'
                    formId='chapterForm'
                    modalLabel='chương'
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    ModalBody={
                        <ChapterModalBody
                            errors={errors}
                            register={register}
                            dispatch={dispatch}
                            setValue={setValue}
                        />
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                />
            }
        />
    );
}

export default ChaptersPage;
