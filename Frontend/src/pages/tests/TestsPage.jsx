import { yupResolver } from "@hookform/resolvers/yup";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Frame, Table, TestFilter, TestModalBody, TestTableBody } from "../../components";
import { persistUserState } from "../../features/persistUserSlice";
import {
    clearQuestionState,
    fetchAllQuestions,
    loadQuestionsByCriteria,
    questionState,
    setQueryAvailableQuestionsArr,
    setQuestions,
} from "../../features/questionSlice";
import {
    fetchAllSubjects,
    fetchAllSubjectsFiltered,
    subjectState,
} from "../../features/subjectSlice";
import {
    addTest,
    clearTestState,
    fetchAllTests,
    findTestByUser,
    setEditedTest,
    testState,
} from "../../features/testSlice";
import { callToast } from "../../helpers";
import { testSchema } from "../../validation";
import { testColumns } from "../columns";

function TestsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const { subjectsHaveQuestion: subjects } = useSelector(subjectState);
    const {
        tests,
        totalElements,
        totalPages,
        filterObject,
        loading,
        addTest: { successMessage },
        editTest: { successMessage: esSuccessMessage },
        deleteTest: { successMessage: dsSuccessMessage, errorMessage: dtErrorMessage },
        enableOrDisableTest: { successMessage: eodTest },
    } = useSelector(testState);
    const { queryAvailableQuestionsArr, loadedQuestionsSuccessMessage } =
        useSelector(questionState);
    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);

    const formId = "testForm";
    const modalId = "testModal";
    const modalLabel = "đề thi";

    if (userRoles.includes("Sinh viên")) {
        navigate("/");
    }

    useEffect(() => {
        dispatch(
            fetchAllTests({
                page: 1,
            })
        );

        //subjects for adding
        if (userRoles.includes("Quản trị viên")) {
            //subjects have chapter
            dispatch(fetchAllSubjects({ page: 0, haveChapter: true }));
        } else {
            //subjects teacher teaches
            dispatch(fetchAllSubjects({ page: 0, teacher: user.id }));
        }

        dispatch(fetchAllSubjectsFiltered({ haveChapter: true, haveQuestion: true }));
        dispatch(setQuestions([]));

        dispatch(findTestByUser());
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
            criteria2: [],
        },
    });

    const onSubmit = data => {
        const { criteria, numberOfQuestions, testSubjectId: subject, id, criteria2 } = data;

        let haveError = false;

        if (isEdit) {
            criteria2.forEach(({ chapterId, level, numberOfQuestions, fieldIndex }, index) => {
                if (!chapterId) {
                    setError(`criteria2.${index}.chapterId`, {
                        type: "custom",
                        message: "Chương không được để trống",
                    });
                    haveError = true;
                }

                if (!level) {
                    setError(`criteria2.${index}.level`, {
                        type: "custom",
                        message: "Độ khó không được để trống",
                    });
                    haveError = true;
                }

                if (parseInt(numberOfQuestions) == 0) {
                    setError(`criteria2.${index}.numberOfQuestions`, {
                        type: "custom",
                        message: "Số lượng phải lớn hơn 0",
                    });

                    haveError = true;
                } else {
                    if (queryAvailableQuestionsArr[fieldIndex] !== null) {
                        if (parseInt(numberOfQuestions) > queryAvailableQuestionsArr[fieldIndex]) {
                            setError(`criteria2.${index}.numberOfQuestions`, {
                                type: "custom",
                                message: "Số lượng không thể lớn hơn hiện có",
                            });

                            haveError = true;
                        }
                    }
                }
            });

            if (haveError) {
                dispatch(setQuestions([]));
                return;
            }

            dispatch(
                loadQuestionsByCriteria({
                    subject,
                    criteria: criteria2,
                })
            );
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
                    if (sb && numberOfQuestions > sb.numberOfActiveQuestions) {
                        setError("numberOfQuestions", {
                            type: "custom",
                            message: "Số lượng câu hỏi không thể lớn hơn số lượng hiện có",
                        });
                        haveError = true;
                    }

                    if (parseInt(numberOfQuestions) === 0) {
                        setError("numberOfQuestions", {
                            type: "custom",
                            message: "Số lượng câu hỏi phải lớn hơn 0",
                        });
                        haveError = true;
                    }

                    if (haveError) {
                        dispatch(setQuestions([]));
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

                    if (parseInt(numberOfQuestions) == 0) {
                        setError(`criteria.${index}.numberOfQuestions`, {
                            type: "custom",
                            message: "Số lượng phải lớn hơn 0",
                        });

                        haveError = true;
                    } else {
                        if (queryAvailableQuestionsArr[fieldIndex] !== null) {
                            if (
                                parseInt(numberOfQuestions) > queryAvailableQuestionsArr[fieldIndex]
                            ) {
                                setError(`criteria.${index}.numberOfQuestions`, {
                                    type: "custom",
                                    message: "Số lượng không thể lớn hơn hiện có",
                                });

                                haveError = true;
                            }
                        }
                    }
                });

                if (haveError) {
                    dispatch(setQuestions([]));
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

    const fetchDataByPageNumber = pageNumber => {
        dispatch(fetchAllTests({ ...filterObject, page: pageNumber }));
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
            dispatch(clearQuestionState());
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

        onCloseForm();
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
        if (dtErrorMessage) {
            callToast("error", dtErrorMessage);
        }
    }, [dtErrorMessage]);

    useEffect(() => {
        if (eodTest) {
            cleanForm(eodTest, "");
        }
    }, [eodTest]);

    useEffect(() => {
        if (loadedQuestionsSuccessMessage) {
            console.log(loadedQuestionsSuccessMessage);
            callToast("success", loadedQuestionsSuccessMessage);
        }
    }, [loadedQuestionsSuccessMessage]);

    function onCloseForm() {
        dispatch(setEditedTest(null));
        setValue("criteria", []);
        setValue("criteria2", []);

        dispatch(setQuestions([]));

        setValue("testName", `Đề thi ${subjects[0].name} ${new Date().getTime()}`);
        setValue("testSubjectId", subjects[0].id);

        clearErrors("criteria");
        clearErrors("criteria2");
        dispatch(setQueryAvailableQuestionsArr({}));
    }

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={`DANH SÁCH ${modalLabel.toUpperCase()} (${totalElements})`}
            children={
                <Table
                    searchPlaceHolder={`Tìm kiếm ${modalLabel} :: mã đề thi, tên đề thi, môn học, người tạo`}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    fetchDataByPageNumber={fetchDataByPageNumber}
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
