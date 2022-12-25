import { yupResolver } from "@hookform/resolvers/yup";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ExamModalBody, ExamTableBody, Frame, Table } from "../../components";
import ExamFilter from "../../components/exams/ExamFilter";
import {
    creditClassState,
    fetchAllCreditClasses,
    fetchCreditClassesForExamAdded,
} from "../../features/creditClassSlice";
import {
    addExam,
    clearExamState,
    editExam,
    examState,
    fetchAllExams,
    setEditedExam,
} from "../../features/examSlice";
import { persistUserState } from "../../features/persistUserSlice";
import { fetchAllSubjects } from "../../features/subjectSlice";
import { setTests } from "../../features/testSlice";
import { callToast } from "../../helpers";
import { examSchema } from "../../validation";
import { examColumns, studentExamColumns } from "../columns";

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
            // Lấy ra danh sách lớp tín chỉ thoả điều kiện sau:
            // 1. Môn học của lớp tín chỉ phải có đề thi chưa được sử dụng.
            // 2. Có số SV chưa được tạo ca thi giữa kỳ hoặc cuối kỳ > 0
            // 3. Lớp tín chỉ chưa hủy : active: true,
            // 4. Lớp tín chỉ có danh sách đăng ký : haveRegister: true,
            dispatch(fetchCreditClassesForExamAdded());

            if (userRoles.includes("Quản trị viên")) {
                dispatch(
                    fetchAllExams({
                        page: 1,
                    })
                );
                dispatch(
                    fetchAllCreditClasses({
                        page: 0,
                        haveExam: true,
                    })
                );
            } else {
                dispatch(
                    fetchAllExams({
                        page: 1,
                        teacher: user.id,
                    })
                );
                dispatch(
                    fetchAllCreditClasses({
                        page: 0,
                        haveExam: true,
                        teacher: user.id,
                    })
                );
            }
        } else {
            // Lấy ra danh sách ca thi chưa thi của sinh viên
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
        clearErrors,
    } = useForm({
        resolver: yupResolver(examSchema),
    });

    const onSubmit = data => {
        let haveError = false;
        if (!data.time) {
            setError("time", {
                type: "custom",
                message: "Thời gian làm bài không được để trống",
            });
            haveError = true;
        }

        if (!data.numberOfStudents) {
            setError("numberOfStudents", {
                type: "custom",
                message: "Số  sinh viên thi không được để trống",
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
            setError("tests", {
                type: "custom",
                message: "Chọn đề thi cho ca thi",
            });
            haveError = true;
        }

        if (haveError) {
            return;
        }

        if (parseInt(data.numberOfStudents) > parseInt($("#numberOfActiveStudents").val())) {
            setError("numberOfStudents", {
                type: "custom",
                message: "Số sinh viên thi phải ít hơn sinh viên đang theo học",
            });
            haveError = true;
        }
        if (data.time > 120) {
            setError("time", {
                type: "custom",
                message: "Thời gian làm bài phải ít hơn hoặc bằng 120 phút",
            });
            haveError = true;
        }

        let { examDate } = data;
        const examDt = new Date(
            `${examDate.split("/")[1]}/${examDate.split("/")[0]}/${examDate.split("/")[2]} 00:00:00`
        );

        if (!isEdit && examDt.getTime() <= new Date().getTime()) {
            setError("examDate", {
                type: "custom",
                message: "Ngày thi phải lớn hơn ngày hiện tại",
            });
            haveError = true;
        }

        if (!isEdit) {
            if (data.examType === "Giữa kỳ") {
                if (parseInt($("#numberOfNoneCreatedMidtermExamStudents").val()) === 0) {
                    setError("examType", {
                        type: "custom",
                        message: `Kỳ thi Giữa kỳ của lớp tín chỉ này đã được tạo cho tất cả sinh viên. Vui lòng chọn loại kỳ thi khác`,
                    });
                    haveError = true;
                }
            } else if (data.examType === "Cuối kỳ") {
                if (parseInt($("#numberOfNoneCreatedFinalTermExamStudents").val()) === 0) {
                    setError("examType", {
                        type: "custom",
                        message: `Kỳ thi Cuối kỳ của lớp tín chỉ này đã được tạo cho tất cả sinh viên. Vui lòng chọn loại kỳ thi khác`,
                    });
                    haveError = true;
                }
            }
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
                if (exam.type === data.examType) {
                    index += 1;
                }
            });
        }

        data[
            "name"
        ] = `${schoolYear}-${semester}-${subjectName}-${group}-${data.examType}-${index}`;

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

    const fetchDataByPageNumber = pageNumber => {
        dispatch(fetchAllExams({ ...filterObject, page: pageNumber }));
    };

    const handleQueryChange = ({ target: { value: query } }) => {
        if (userRoles.includes("Quản trị viên")) {
            dispatch(
                fetchAllExams({
                    ...filterObject,
                    query,
                })
            );
        } else if (userRoles.includes("Giảng viên")) {
            dispatch(
                fetchAllExams({
                    ...filterObject,
                    query,
                    teacher: user.id,
                })
            );
        } else {
        }
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

    useEffect(() => {
        dispatch(clearExamState());
    }, []);

    function cleanForm(successMessage, type = "add") {
        callToast("success", successMessage);
        dispatch(fetchAllExams(filterObject));
        dispatch(fetchCreditClassesForExamAdded());

        $(`#${modalId}`).css("display", "none");
        onCloseForm();
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
        clearErrors();
    }

    const columns = userRoles.includes("Sinh viên") ? studentExamColumns : examColumns;

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
                    searchPlaceHolder={`Tìm kiếm ${modalLabel} :: mã ca thi, tên ca thi`}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={columns}
                    fetchDataByPageNumber={fetchDataByPageNumber}
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
                    examPage
                />
            }
        />
    );
}

export default ExamsPage;
