import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Frame, TestModalBody, TestTableBody, Table, TestFilter } from "../../components";
import {
    addTest,
    clearTestState,
    editTest,
    fetchAllTests,
    setEditedTest,
    testState,
} from "../../features/testSlice";
import { testSchema } from "../../validation";
import { callToast } from "../../helpers";
import { fetchAllSubjects, subjectState } from "../../features/subjectSlice";
import {
    fetchAllQuestions,
    loadQuestionsByCriteria,
    questionState,
    setQueryAvailableQuestionsArr,
    setQuestions,
} from "../../features/questionSlice";
import { testColumns } from "../columns";
import $ from "jquery";

function TestsPage() {
    const dispatch = useDispatch();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const { subjects } = useSelector(subjectState);
    const {
        tests,
        totalElements,
        totalPages,
        filterObject,
        loading,
        addTest: { successMessage },
        editTest: { successMessage: esSuccessMessage },
        deleteTest: { successMessage: dsSuccessMessage },
        enableOrDisableTest: { successMessage: eodTest },
    } = useSelector(testState);
    const { queryAvailableQuestionsArr } = useSelector(questionState);

    const formId = "testForm";
    const modalId = "testModal";
    const modalLabel = "đề thi";

    useEffect(() => {
        dispatch(
            fetchAllTests({
                page: 1,
            })
        );
        dispatch(fetchAllSubjects({ page: 0, haveChapter: true, haveQuestion: true }));
        dispatch(setQuestions([]));
    }, []);

    const {
        control,
        register,
        setValue,
        handleSubmit,
        setError,
        clearErrors,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(testSchema),
        defaultValues: {
            criteria: [],
            editedQuestions: [],
            etdQsts: [],
        },
    });

    const onSubmit = data => {
        const {
            criteria,
            numberOfQuestions,
            testSubjectId: subject,
            testName,
            id,
            editedQuestions,
            etdQsts,
        } = data;

        console.log(data);

        let haveError = false;
        console.log("aaa");
        console.log(etdQsts);
        console.log("bbb");
        if (isEdit) {
            console.log(id, editedQuestions);
            console.log("go go go ");
            // dispatch(editTest(data));
        } else {
            // If there is no criteria
            if (criteria.length === 0) {
                if (!numberOfQuestions) {
                    setError("numberOfQuestions", {
                        type: "custom",
                        message: "Nhập số lượng câu hỏi",
                    });
                    haveError = true;
                } else {
                    const sb = subjects.find(({ id }) => id === subject);
                    if (sb && numberOfQuestions > sb.numberOfQuestions) {
                        setError("numberOfQuestions", {
                            type: "custom",
                            message: "Số lượng câu hỏi không thể lớn hơn số lượng hiện có",
                        });
                        haveError = true;
                    }

                    if (numberOfQuestions === "0") {
                        setError("numberOfQuestions", {
                            type: "custom",
                            message: "Số lượng câu hỏi phải lớn hơn 0",
                        });
                        haveError = true;
                    }

                    if (haveError) {
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
                criteria.forEach(({ chapterId, level, numberOfQuestions, fieldIndex }, index) => {
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
                    if (queryAvailableQuestionsArr[fieldIndex]) {
                        if (numberOfQuestions > queryAvailableQuestionsArr[fieldIndex]) {
                            setError(`criteria.${index}.numberOfQuestions`, {
                                type: "custom",
                                message: "Số lượng không thể lớn hơn hiện có",
                            });

                            haveError = true;
                        }
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

    useEffect(() => {
        if (eodTest) {
            cleanForm(eodTest, "");
        }
    }, [eodTest]);

    function onCloseForm() {
        dispatch(setEditedTest(null));
        setValue("criteria", []);

        setValue("testName", `Đề thi ${subjects[0].name} ${new Date().getTime()}`);
        setValue("testSubjectId", subjects[0].id);

        clearErrors("criteria");

        dispatch(setQueryAvailableQuestionsArr([]));
    }

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={`DANH SÁCH ${modalLabel.toUpperCase()} (${totalElements})`}
            children={
                <Table
                    searchPlaceHolder={`Tìm kiếm ${modalLabel}`}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={testColumns}
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
                            clearErrors={clearErrors}
                            control={control}
                            getValues={getValues}
                        />
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    addTest={addTest}
                    onCloseForm={onCloseForm}
                    Filter={TestFilter}
                    setError={setError}
                    testPage={true}
                    // loading={loading}
                />
            }
        />
    );
}

export default TestsPage;
