import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Frame, ExamModalBody, ExamTableBody, Table } from "../../components";
import { examSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    addExam,
    clearExamState,
    editExam,
    examState,
    fetchAllExams,
    setEditedExam,
} from "../../features/examSlice";
import ExamFilter from "../../components/exams/ExamFilter";
import { fetchAllSubjects } from "../../features/subjectSlice";
import { creditClassState, fetchAllCreditClasses } from "../../features/creditClassSlice";
import { setTests } from "../../features/testSlice";
import { persistUserState } from "../../features/persistUserSlice";
import { examColumns, studentColumns } from "../columns";
import $ from "jquery";

function ExamsPage() {
    const dispatch = useDispatch();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);
    const { creditClasses } = useSelector(creditClassState);

    const modalId = "examModal";
    const formId = "examForm";
    const modalLabel = "ca thi";

    useEffect(() => {
        dispatch(fetchAllSubjects({ page: 0 }));
        if (!userRoles.includes("Sinh viên")) {
            dispatch(
                fetchAllCreditClasses({
                    page: 0,
                })
            );
            dispatch(
                fetchAllExams({
                    page: 1,
                })
            );
        } else {
            dispatch(
                fetchAllExams({
                    page: 1,
                    student: user.id,
                    taken: false,
                })
            );
        }
    }, []);

    const {
        register,
        setValue,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(examSchema),
    });

    const onSubmit = data => {
        let haveError = false;
        if (parseInt(data.numberOfStudents) > parseInt(data.numberOfActiveStudents)) {
            setError("numberOfStudents", {
                type: "custom",
                message: "Số SV thi phải ít hơn SV đang theo học",
            });
            haveError = true;
        }
        if (data.time > 120) {
            setError("time", {
                type: "custom",
                message: "Thời gian làm bài phải ít hơn 120 phút",
            });
            haveError = true;
        }

        let tests = [];
        $(".tests-checkbox").each(function () {
            if ($(this).prop("checked")) {
                tests.push($(this).data("id"));
            }
        });
        if (tests.length === 0) {
            callToast("error", "Chọn bộ đề cho ca thi");
            haveError = true;
        }

        let { examDate } = data;
        const examDt = new Date(
            `${examDate.split("/")[1]}/${examDate.split("/")[0]}/${examDate.split("/")[2]} 00:00:00`
        );

        if (!isEdit && examDt.getTime() <= new Date().getTime()) {
            callToast("error", "Ngày thi phải lớn hơn hiện tại");
            haveError = true;
        }

        if (haveError) {
            return;
        }

        data["tests"] = tests;

        examDate = examDate.split("/");
        examDate = examDate[2] + "-" + examDate[1] + "-" + examDate[0];
        data["examDate"] = examDate;

        const { schoolYear, semester, subjectName, group, exams } = creditClasses.find(
            ({ id }) => id.toString() === data.creditClassId.toString()
        );
        let index = 1;
        if (exams && exams.length) {
            exams.forEach(exam => {
                if (exam.type === data.type) {
                    index += 1;
                }
            });
        }
        data["name"] = `${schoolYear}-${semester}-${subjectName}-${group}-${data.type}-${index}`;

        if (isEdit) {
            dispatch(editExam(data));
        } else {
            dispatch(addExam(data));
        }
    };

    const {
        exams,
        totalElements,
        totalPages,
        filterObject,
        loading,
        addExam: { successMessage },
        editExam: { successMessage: esSuccessMessage },
        deleteExam: { successMessage: dsSuccessMessage },
        enableOrDisableExam: { successMessage: eodqSuccessMessage },
    } = useSelector(examState);

    const handleQueryChange = ({ target: { value: query } }) => {
        dispatch(
            fetchAllExams({
                ...filterObject,
                query,
            })
        );
    };

    const handleSortChange = (sortField, sortDir) => {
        dispatch(
            fetchAllExams({
                ...filterObject,
                sortField,
                sortDir,
            })
        );
    };

    useEffect(() => {
        return () => {
            dispatch(clearExamState());
        };
    }, []);

    function cleanForm(successMessage, type = "add") {
        callToast("success", successMessage);
        dispatch(fetchAllExams(filterObject));

        $(`#${modalId}`).css("display", "none");
        if (type === "add") {
            $(`#${formId}`)[0].reset();
        }

        if (type === "edit") {
            setIsEdit(false);
            dispatch(setEditedExam(null));
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
        if (eodqSuccessMessage) {
            cleanForm(eodqSuccessMessage, "enable");
        }
    }, [eodqSuccessMessage]);

    function onCloseForm() {
        dispatch(setEditedExam(null));
        dispatch(setTests([]));
    }

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={
                !userRoles.includes("Sinh viên")
                    ? `DANH SÁCH CA THI (${totalElements})`
                    : `DANH SÁCH LỊCH THI (${totalElements})`
            }
            children={
                <Table
                    searchPlaceHolder={`Tìm kiếm ${modalLabel}`}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={userRoles.includes("Sinh viên") ? studentColumns : examColumns}
                    rows={exams}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={ExamTableBody}
                    modalId={modalId}
                    formId={formId}
                    modalLabel={modalLabel}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    ModalBody={
                        <ExamModalBody
                            errors={errors}
                            register={register}
                            dispatch={dispatch}
                            setValue={setValue}
                        />
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    Filter={ExamFilter}
                    onCloseForm={onCloseForm}
                    loading={loading}
                />
            }
        />
    );
}

export default ExamsPage;
