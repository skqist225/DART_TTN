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

const columns = [
    {
        name: "Mã ca thi",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Mã môn học",
        sortField: "subjectId",
        sortable: true,
    },
    {
        name: "Tên môn học",
        sortField: "subjectName",
        sortable: true,
    },
    {
        name: "Trạng thái",
        sortField: "taken",
        sortable: true,
    },
    {
        name: "Số lượng",
        sortField: "numberOfStudents",
        sortable: true,
    },
    {
        name: "Ngày thi",
        sortField: "examDate",
        sortable: true,
    },
    {
        name: "Tiết báo danh",
        sortField: "time",
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
        sortable: true,
    },
    {
        name: "Người tạo",
        sortField: "name",
        sortable: true,
    },
    {
        name: "Thao tác",
        sortField: "name",
        sortable: true,
    },
];

function ExamsPage() {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const modalId = "examModal";
    const formId = "examForm";
    const modalLabel = "ca thi";

    useEffect(() => {
        dispatch(
            fetchAllExams({
                page: 1,
            })
        );
        dispatch(fetchAllSubjects({ page: 0 }));
        dispatch(fetchAllCreditClasses({ page: 0 }));
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

        if (examDt.getTime() <= new Date().getTime()) {
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
            cleanForm(successMessage, "edit");
        }
    }, [esSuccessMessage]);

    useEffect(() => {
        if (dsSuccessMessage) {
            cleanForm(successMessage, "delete");
        }
    }, [dsSuccessMessage]);

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"DANH SÁCH CA THI"}
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
                />
            }
        />
    );
}

export default ExamsPage;
