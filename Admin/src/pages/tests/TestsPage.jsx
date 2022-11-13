import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Frame, TestModalBody, TestTableBody, Table, TestFilter } from "../../components";
import {
    addTest,
    clearTestState,
    editTest,
    fetchAllTests,
    setEditedTest,
    testState,
} from "../../features/testSlice";
import $ from "jquery";
import { testSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchAllSubjects, subjectState } from "../../features/subjectSlice";
import {
    fetchAllQuestions,
    loadQuestionsByCriteria,
    setQuestions,
} from "../../features/questionSlice";

const columns = [
    {
        name: "Mã đề thi",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Tên đề thi",
        sortField: "name",
        sortable: true,
    },
    {
        name: "Trạng thái",
        sortField: "status",
        sortable: true,
    },
    {
        name: "Tổng số câu hỏi",
        sortField: "numberOfQuestions",
        sortable: true,
    },
    {
        name: "Tiêu chí",
        sortField: "criteria",
    },
    {
        name: "Môn học",
        sortField: "subject",
        sortable: true,
    },
    {
        name: "Người tạo",
        sortField: "teacher",
        sortable: true,
    },
    {
        name: "Thao tác",
        sortField: "teacher",
    },
];

function TestsPage() {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const { subjects } = useSelector(subjectState);

    const formId = "testForm";
    const modalId = "testModal";
    const modalLabel = "đề thi";

    useEffect(() => {
        dispatch(
            fetchAllTests({
                page: 1,
            })
        );
        dispatch(fetchAllSubjects({ page: 0 }));
        dispatch(setQuestions([]));
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
        resolver: yupResolver(testSchema),
        defaultValues: {
            criteria: [],
        },
    });

    const onSubmit = ({ criteria, numberOfQuestions, testSubjectId: subject }) => {
        console.log(subject);

        if (isEdit) {
            dispatch(editTest(data));
        } else {
            // If there is no criteria
            if (criteria.length === 0) {
                if (!numberOfQuestions) {
                    callToast("warning", "Nhập số lượng câu hỏi");
                    return;
                } else {
                    const sb = subjects.find(({ id }) => id === subject);
                    if (sb && numberOfQuestions > sb.numberOfQuestions) {
                        callToast("warning", "Số lượng câu hỏi không thể lớn hơn số lượng hiện có");
                        return;
                    }

                    dispatch(
                        fetchAllQuestions({
                            page: 0,
                            subject,
                            numberOfQuestions,
                        })
                    );
                }
            } else {
                let haveError = false;
                criteria.forEach(({ chapterId, level, numberOfQuestions }, index) => {
                    if (!chapterId) {
                        setError(`criteria.${index}.chapterId`, {
                            type: "custom",
                            message: "Chương không được để trống",
                        });
                        haveError = true;
                    }

                    if (!level) {
                        setError(`criteria.${index}.level`, {
                            type: "custom",
                            message: "Độ khó không được để trống",
                        });
                        haveError = true;
                    }

                    const number = parseInt(numberOfQuestions);
                    if (isNaN(number)) {
                        setError(`criteria.${index}.numberOfQuestions`, {
                            type: "custom",
                            message: "Số lượng câu hỏi phải là chữ số",
                        });
                        haveError = true;
                    }
                });
                if (haveError) {
                    return;
                }
                dispatch(
                    loadQuestionsByCriteria({
                        subject,
                        criteria,
                    })
                );
            }
        }
    };

    const {
        tests,
        totalElements,
        totalPages,
        filterObject,
        addTest: { successMessage },
        editTest: { successMessage: esSuccessMessage },
        deleteTest: { successMessage: dsSuccessMessage },
    } = useSelector(testState);

    const handleQueryChange = ({ target: { value: query } }) => {
        dispatch(
            fetchAllTests({
                ...filterObject,
                query,
            })
        );
    };

    const handleSortChange = (sortField, sortDir) => {
        dispatch(
            fetchAllTests({
                ...filterObject,
                sortField,
                sortDir,
            })
        );
    };

    useEffect(() => {
        return () => {
            dispatch(clearTestState());
        };
    }, []);

    function cleanForm(successMessage, type = "normal") {
        callToast("success", successMessage);
        dispatch(fetchAllTests(filterObject));

        $(`#${modalId}`).css("display", "none");

        if (type === "add") {
            $(`#${formId}`)[0].reset();
            dispatch(setQuestions([]));
        }

        if (type === "edit") {
            setIsEdit(false);
            dispatch(setEditedTest(null));
            dispatch(setQuestions([]));
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
        dispatch(setQuestions([]));
    }

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"DANH SÁCH ĐỀ THI"}
            children={
                <Table
                    searchPlaceHolder={"Tìm kiếm theo tên và mã đề thi"}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={columns}
                    rows={tests}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={TestTableBody}
                    modalId={modalId}
                    formId={formId}
                    modalLabel={modalLabel}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    ModalBody={
                        <TestModalBody
                            errors={errors}
                            register={register}
                            setValue={setValue}
                            control={control}
                        />
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    addTest={addTest}
                    onCloseForm={onCloseForm}
                    Filter={TestFilter}
                    setError={setError}
                />
            }
        />
    );
}

export default TestsPage;
