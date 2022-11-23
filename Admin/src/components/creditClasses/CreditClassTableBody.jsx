import React, { useEffect, useState } from "react";
import { tailwindCss } from "../../tailwind";
import MyButton from "../common/MyButton";
import $ from "jquery";
import { enableOrDisableCreditClass, setEditedCreditClass } from "../../features/creditClassSlice";
import { cellCss } from "../questions/QuestionTableBody";
import EnableOrDisable from "../common/EnableOrDisable";
import { useDispatch } from "react-redux";
import { persistUserState } from "../../features/persistUserSlice";
import { useSelector } from "react-redux";
import { Badge, Button, Table, Tooltip } from "flowbite-react";
import TableModalViewer from "../utils/tables/TableModalViewer";
import TablePagination from "../utils/tables/TablePagination";
import TableModal from "../utils/tables/TableModal";
import ExamModalBody from "../exams/ExamModalBody";
import { addExam, editExam, examState, setEditedExam } from "../../features/examSlice";
import { setTests } from "../../features/testSlice";
import { examSchema } from "../../validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RegisterList from "./RegisterList";
import ExamList from "./ExamList";
import ExamIcon from "../../images/exam.png";

function CreditClassTableBody({ rows, setIsEdit }) {
    const modalId = "examModal";
    const formId = "examForm";
    const modalLabel = "ca thi";
    const [isExamEdit, setIsExamEdit] = useState(false);
    const [creditClassId, setCreditClassId] = useState(0);

    const dispatch = useDispatch(0);

    const { userRoles } = useSelector(persistUserState);

    const {
        filterObject,
        addExam: { addExamsuccessMessage },
    } = useSelector(examState);

    function cleanForm(successMessage, type = "add") {
        callToast("success", successMessage);
        dispatch(fetchAllExams(filterObject));

        $(`#testModal`).css("display", "none");
        if (type === "add") {
            $(`#testModal`)[0].reset();
        }

        if (type === "edit") {
            setIsExamEdit(false);
            dispatch(setEditedExam(null));
        }
    }

    useEffect(() => {
        if (addExamsuccessMessage) {
            cleanForm(addExamsuccessMessage, "add");
        }
    }, [addExamsuccessMessage]);

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

        const { schoolYear, semester, subjectName, group, exams } = rows.find(
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

        if (isExamEdit) {
            dispatch(editExam(data));
        } else {
            dispatch(addExam(data));
        }
    };

    function onCloseForm() {
        dispatch(setEditedExam(null));
        dispatch(setTests([]));
    }

    return (
        <tbody>
            <TableModal
                modalId={modalId}
                formId={formId}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                modalLabel={isExamEdit ? `Chỉnh sửa ${modalLabel}` : `Thêm ${modalLabel}`}
                ModalBody={
                    <ExamModalBody
                        errors={errors}
                        register={register}
                        dispatch={dispatch}
                        setValue={setValue}
                        creditClassPage={true}
                        creditClassId={creditClassId}
                    />
                }
                buttonLabel={isExamEdit ? `Chỉnh sửa` : `Thêm`}
                setIsEdit={setIsExamEdit}
                onCloseForm={onCloseForm}
            />
            {rows &&
                rows.length &&
                rows.map((row, index) => {
                    return (
                        <tr
                            className={`${tailwindCss.tr} ${
                                row.status && "bg-gray-200 hover:bg-gray-200"
                            }`}
                            key={row.id}
                        >
                            <td className={cellCss}>{row.id}</td>
                            <td className={cellCss}>{row.schoolYear}</td>
                            <td className={cellCss}>{row.semester}</td>
                            <td className={cellCss}>{row.subjectName}</td>
                            <td className={cellCss}>{row.group}</td>
                            <td className={cellCss}>
                                {row.status ? (
                                    <Badge color='failure'>Đã hủy</Badge>
                                ) : (
                                    <Badge color='success'>Đang mở</Badge>
                                )}
                            </td>
                            <td className={cellCss}>{row.teacherName}</td>
                            <td className={cellCss + " flex items-center"}>
                                <div className='mr-3'>
                                    <Tooltip content='Xem danh sách đăng ký' placement='top'>
                                        <Button
                                            onClick={() => {
                                                $(`#studentsViewer${index}`).css("display", "flex");
                                            }}
                                            color='success'
                                            disabled={row.numberOfActiveStudents === 0}
                                            style={{
                                                width: "46px",
                                                height: "42px",
                                                backgroundColor: "#0E9F6E",
                                            }}
                                        >
                                            <VisibilityIcon />
                                        </Button>
                                    </Tooltip>
                                    <TableModalViewer
                                        modalId={`studentsViewer${index}`}
                                        modalLabel='Danh sách sinh viên'
                                        ModalBody={<RegisterList registers={row.tempRegisters} />}
                                    />
                                </div>
                                <div className='mr-3'>
                                    <Tooltip content='Xem danh sách ca thi' placement='top'>
                                        <Button
                                            onClick={() => {
                                                $(`#examsViewer${index}`).css("display", "flex");
                                            }}
                                            color='success'
                                            disabled={row.numberOfActiveStudents === 0}
                                            style={{
                                                width: "46px",
                                                height: "42px",
                                                backgroundColor: "#0E9F6E",
                                            }}
                                        >
                                            <VisibilityIcon />
                                        </Button>
                                    </Tooltip>
                                    <TableModalViewer
                                        modalId={`examsViewer${index}`}
                                        modalLabel='Danh sách ca thi'
                                        ModalBody={
                                            <ExamList
                                                exams={row.exams}
                                                numberOfActiveStudents={row.numberOfActiveStudents}
                                                numberOfMidTermExam={row.numberOfMidTermExam}
                                                numberOfMidTermExamCreated={
                                                    row.numberOfMidTermExamCreated
                                                }
                                                numberOfFinalTermExam={row.numberOfFinalTermExam}
                                                numberOfFinalTermExamCreated={
                                                    row.numberOfFinalTermExamCreated
                                                }
                                            />
                                        }
                                    />
                                </div>
                                {userRoles.includes("Quản trị viên") && (
                                    <>
                                        <div className='mr-2'>
                                            <MyButton
                                                type='edit'
                                                onClick={() => {
                                                    $(`#creditClassModal`).css("display", "flex");
                                                    setIsEdit(true);
                                                    dispatch(setEditedCreditClass(row));
                                                }}
                                            />
                                        </div>
                                        <EnableOrDisable
                                            status={row.status}
                                            enableOrDisable={enableOrDisableCreditClass}
                                            id={row.id}
                                            creditClassPage={true}
                                        />
                                    </>
                                )}
                                <div className='mx-2'>
                                    <Tooltip content='Thêm ca thi' placement='top'>
                                        <Button
                                            onClick={() => {
                                                $(`#examModal`).css("display", "flex");
                                                setCreditClassId(row.id);
                                                setValue("creditClassId", row.id);
                                            }}
                                            disabled={row.numberOfActiveStudents === 0}
                                        >
                                            <img src={ExamIcon} width='24px' height='24px' />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </td>
                        </tr>
                    );
                })}
        </tbody>
    );
}

export default CreditClassTableBody;
