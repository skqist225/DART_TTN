import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Frame, SubjectModalBody, SubjectTableBody, Table } from "../../components";
import {
    addSubject,
    clearSubjectState,
    editSubject,
    fetchAllSubjects,
    setEditedSubject,
    subjectState,
} from "../../features/subjectSlice";
import $ from "jquery";
import { subjectSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";

const columns = [
    {
        name: "Mã môn học",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Tên môn học",
        sortField: "name",
        sortable: true,
    },
    {
        name: "Số tiết lý thuyết",
        sortField: "numberOfTheoreticalPeriods",
        sortable: true,
    },
    {
        name: "Số tiết thực hành",
        sortField: "numberOfPracticePeriods",
        sortable: true,
    },
    {
        name: "Số chương",
        sortField: "numberOfChapters",
        sortable: true,
    },
    {
        name: "Số bộ đề",
        sortField: "numberOfTests",
        sortable: true,
    },
    {
        name: "Số câu hỏi",
        sortField: "numberOfQuestions",
        sortable: true,
    },
];

function SubjectsPage() {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const formId = "subjectForm";
    const modalId = "subjectModal";
    const modalLabel = "môn học";

    useEffect(() => {
        dispatch(
            fetchAllSubjects({
                page: 1,
            })
        );
    }, []);

    const {
        control,
        register,
        setValue,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(subjectSchema),
        defaultValues: {
            chapters: [],
        },
    });

    const onSubmit = data => {
        console.info(data);
        let { numberOfTheoreticalPeriods, numberOfPracticePeriods, chapters } = data;

        if ((numberOfTheoreticalPeriods + numberOfPracticePeriods) % 3 != 0) {
            if (numberOfTheoreticalPeriods === 0 && numberOfPracticePeriods === 0) {
                setError("numberOfPracticePeriods", {
                    type: "custom",
                    message: "Số tiết lý thuyết và thực hành không thể đồng thời bằng 0",
                });
                setError("numberOfTheoreticalPeriods", {
                    type: "custom",
                    message: "Số tiết lý thuyết và thực hành không thể đồng thời bằng 0",
                });
            } else {
                setError("numberOfPracticePeriods", {
                    type: "custom",
                    message: "Tổng lý thuyết + thực hành phải là bội số của 3",
                });
                setError("numberOfTheoreticalPeriods", {
                    type: "custom",
                    message: "Tổng lý thuyết + thực hành phải là bội số của 3",
                });
            }
            return;
        }

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
            return {
                id,
                chapterNumber: parseInt(index) + 1,
                name,
            };
        });

        data["chapters"] = chapters;

        if (isEdit) {
            dispatch(editSubject(data));
        } else {
            dispatch(addSubject(data));
        }
    };

    const {
        subjects,
        errorObject,
        totalElements,
        totalPages,
        filterObject,
        addSubject: { successMessage },
        editSubject: { successMessage: esSuccessMessage },
        deleteSubject: { successMessage: dsSuccessMessage, errorMessage: dsErrorMessage },
    } = useSelector(subjectState);

    useEffect(() => {
        if (errorObject) {
            Object.keys(errorObject).forEach(key => {
                if (key.startsWith("chapters")) {
                    setError(`chapters.${key.split(".")[1]}.name`, {
                        type: "custom",
                        message: "Tên chương đã tồn tại",
                    });
                }
            });
        }
    }, [errorObject]);

    useEffect(() => {
        if (!isEdit) {
            setValue("id", "");
            setValue("name", "");
        }
    }, [isEdit]);

    const handleQueryChange = ({ target: { value: query } }) => {
        dispatch(
            fetchAllSubjects({
                ...filterObject,
                query,
            })
        );
    };

    const handleSortChange = (sortField, sortDir) => {
        dispatch(
            fetchAllSubjects({
                ...filterObject,
                sortField,
                sortDir,
            })
        );
    };

    useEffect(() => {
        return () => {
            dispatch(clearSubjectState());
        };
    }, []);

    function cleanForm(successMessage, type = "normal") {
        callToast("success", successMessage);
        dispatch(fetchAllSubjects(filterObject));

        $(`#${modalId}`).css("display", "none");
        if (type === "add") {
            $(`#${formId}`)[0].reset();
        }

        if (type === "edit") {
            setIsEdit(false);
            dispatch(setEditedSubject(null));
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
        dispatch(setEditedSubject(null));
        setValue("chapters", []);
        clearErrors("chapters");
    }

    useEffect(() => {
        if (dsErrorMessage) {
            callToast("error", dsErrorMessage);
        }
    }, [dsErrorMessage]);

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"DANH SÁCH MÔN HỌC"}
            children={
                <Table
                    searchPlaceHolder={"Tìm kiếm theo tên và mã môn học"}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={columns}
                    rows={subjects}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={SubjectTableBody}
                    modalId={modalId}
                    formId={formId}
                    modalLabel={modalLabel}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    ModalBody={
                        <SubjectModalBody
                            errors={errors}
                            register={register}
                            dispatch={dispatch}
                            setValue={setValue}
                            clearErrors={clearErrors}
                            control={control}
                        />
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    onCloseForm={onCloseForm}
                />
            }
        />
    );
}

export default SubjectsPage;
