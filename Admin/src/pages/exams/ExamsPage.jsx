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
import $ from "jquery";
import { fetchAllSubjects } from "../../features/subjectSlice";
import { fetchAllCreditClasses } from "../../features/creditClassSlice";
import { setErrorField } from "../../features/userSlice";
import { setTests } from "../../features/testSlice";
import { persistUserState } from "../../features/persistUserSlice";

const columns = [
    {
        name: "Tên ca thi",
        sortField: "name",
        sortable: true,
    },
    {
        name: "Mã môn học",
        sortField: "subjectId",
        // sortable: true,
    },
    {
        name: "Tên môn học",
        sortField: "subjectName",
        // sortable: true,
    },
    {
        name: "Trạng thái",
        sortField: "taken",
        // sortable: true,
    },
    {
        name: "Số lượng",
        sortField: "numberOfStudents",
        // sortable: true,
    },
    {
        name: "Ngày thi",
        sortField: "examDate",
        sortable: true,
    },
    {
        name: "Tiết báo danh",
        sortField: "noticePeriod",
        sortable: true,
    },
    {
        name: "Thời gian thi",
        sortField: "time",
        sortable: true,
    },
    {
        name: "Loại thi",
        sortField: "type",
        sortable: true,
    },
    {
        name: "Giảng viên",
        sortField: "time",
        // sortable: true,
    },
    // {
    //     name: "Người tạo",
    //     sortField: "name",
    //     sortable: true,
    // },
    {
        name: "Thao tác",
        sortField: "name",
    },
];

function ExamsPage() {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const { userRoles, user } = useSelector(persistUserState);

    const modalId = "examModal";
    const formId = "examForm";
    const modalLabel = "ca thi";

    useEffect(() => {
        dispatch(fetchAllSubjects({ page: 0 }));
        if (userRoles.includes("Quản trị viên")) {
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
        } else if (userRoles.includes("Giảng viên")) {
            dispatch(
                fetchAllCreditClasses({
                    page: 0,
                    teacher: user.id,
                })
            );
            dispatch(
                fetchAllExams({
                    page: 1,
                    teacher: user.id,
                })
            );
        } else {
            dispatch(
                fetchAllExams({
                    page: 1,
                    student: user.id,
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
        let have;
        if (parseInt(data.numberOfStudents) > parseInt(data.numberOfActiveStudents)) {
            setError("numberOfStudents", {
                type: "custom",
                message: "Số SV thi phải ít hơn SV  đang theo học",
            });
        }
        if (data.time > 120) {
            setError("time", {
                type: "custom",
                message: "Thời gian làm bài phải ít hơn 120 phút",
            });
        }

        let tests = [];
        $(".tests-checkbox").each(function () {
            if ($(this).prop("checked")) {
                tests.push($(this).data("id"));
            }
        });

        if (tests.length === 0) {
            callToast("error", "Chọn bộ đề cho ca thi");
            return;
        }
        let { examDate } = data;
        const examDt = new Date(
            `${examDate.split("/")[1]}/${examDate.split("/")[0]}/${examDate.split("/")[2]} 00:00:00`
        );

        if (!isEdit && examDt.getTime() <= new Date().getTime()) {
            callToast("error", "Ngày thi phải lớn hơn hiện tại");
            return;
        }

        data["tests"] = tests;

        examDate = examDate.split("/");
        examDate = examDate[2] + "-" + examDate[1] + "-" + examDate[0];
        data["examDate"] = examDate;

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
            title={!userRoles.includes("Sinh viên") ? "DANH SÁCH CA THI" : "DANH SÁCH LỊCH THI"}
            children={
                <Table
                    searchPlaceHolder={"Tìm kiếm theo tên và mã ca thi"}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={columns}
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
                />
            }
        />
    );
}

export default ExamsPage;
