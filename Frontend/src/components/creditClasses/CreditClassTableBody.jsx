import { yupResolver } from "@hookform/resolvers/yup";
import { Badge, Button, Card, Tooltip } from "flowbite-react";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteCreditClass,
    enableOrDisableCreditClass,
    setEditedCreditClass,
} from "../../features/creditClassSlice";
import { addExam, editExam, examState, setEditedExam } from "../../features/examSlice";
import { persistUserState } from "../../features/persistUserSlice";
import { callToast } from "../../helpers";
import ExamIcon from "../../images/exam.png";
import { tailwindCss } from "../../tailwind";
import { examSchema } from "../../validation";
import EnableOrDisable from "../common/EnableOrDisable";
import MyButton, { ButtonType } from "../common/MyButton";
import ViewDetails from "../common/ViewDetails";
import ExamModalBody from "../exams/ExamModalBody";
import TableModal from "../utils/tables/TableModal";
import TableModalViewer from "../utils/tables/TableModalViewer";
import ExamList from "./ExamList";
import RegisterList from "./RegisterList";

function CreditClassTableBody({ rows, setIsEdit }) {
    const modalId = "examModal";
    const formId = "examForm";
    const modalLabel = "ca thi";
    const [isExamEdit, setIsExamEdit] = useState(false);
    const [creditClassId, setCreditClassId] = useState(0);

    const dispatch = useDispatch(0);

    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);

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
        let haveError = false;
        const creditClass = rows.find(({ id }) => id.toString() === data.creditClassId.toString());
        console.log(creditClass);
        if (parseInt(data.numberOfStudents) > parseInt(creditClass.numberOfActiveStudents)) {
            setError("numberOfStudents", {
                type: "custom",
                message: "Số SV thi phải ít hơn hoặc bằng số SV đang theo học",
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

        if (examDt.getTime() <= new Date().getTime()) {
            setError("time", {
                type: "examDate",
                message: "Ngày thi phải lớn hơn ngày hiện tại",
            });
            haveError = true;
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

        if (haveError) {
            return;
        }

        if (isExamEdit) {
            dispatch(editExam(data));
        } else {
            dispatch(addExam(data));
        }
    };

    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

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
                onCloseForm={() => {}}
            />
            {rows &&
                rows.length &&
                rows.map((row, index) => {
                    let couldNotCreateExamMessage = "Thêm ca thi";

                    let shouldCreateExam = true;

                    if (row.numberOfActiveStudents === 0) {
                        couldNotCreateExamMessage = "Không có danh sách đăng ký";
                        shouldCreateExam = false;
                    } else if (!row.shouldCreateExam) {
                        couldNotCreateExamMessage = "Môn học của lớp tín chỉ không có đề thi";
                        shouldCreateExam = false;
                    } else if (
                        row.numberOfActiveStudents - row.numberOfFinalTermExamCreated === 0 &&
                        row.numberOfActiveStudents - row.numberOfFinalTermExamCreated === 0
                    ) {
                        couldNotCreateExamMessage = "Đã tạo ca thi cho tất cả sinh viên";
                        shouldCreateExam = false;
                    } else if (row.status) {
                        couldNotCreateExamMessage = "Không thể tạo ca thi cho lớp tín chỉ đã hủy";
                        shouldCreateExam = false;
                    }

                    let couldNotCancelMessage = "",
                        couldNotDeleteMessage = "";
                    let shouldCancel = true,
                        shouldDelete = true;
                    if (row.exams.length > 0) {
                        shouldCancel = false;
                        couldNotCancelMessage = "Có ca thi, không thể hủy";
                        couldNotDeleteMessage = "Có ca thi, không thể xóa";
                    }

                    if (row.tempRegisters.length > 0) {
                        shouldDelete = false;
                        couldNotDeleteMessage = "Có danh sách đăng ký, không thể xóa";
                    }

                    let shouldShowInfoMessage = "Xem thông tin lớp tín chỉ";
                    let shouldShowInfo = true;

                    if (row.tempRegisters.length === 0 && row.exams.length === 0) {
                        shouldShowInfoMessage = "Không có danh sách đăng ký lẫn danh sách ca thi";
                        shouldShowInfo = false;
                    }

                    return (
                        <tr
                            className={`${tailwindCss.tr} ${
                                row.status && "bg-gray-200 hover:bg-gray-200"
                            }`}
                            key={row.id}
                        >
                            <td className={tailwindCss.tableCell}>
                                <Tooltip content={shouldShowInfoMessage}>
                                    <Button
                                        style={{ backgroundColor: "none" }}
                                        onClick={() => {
                                            $(`#viewCreditClassDetail${row.id}`).css(
                                                "display",
                                                "flex"
                                            );
                                        }}
                                        disabled={!shouldShowInfo}
                                    >
                                        {row.id}
                                    </Button>
                                    <TableModalViewer
                                        modalId={`viewCreditClassDetail${row.id}`}
                                        modalLabel='Thông tin lớp tín chỉ'
                                        ModalBody={
                                            <ViewDetails
                                                Header={
                                                    <Card>
                                                        <div
                                                            className='flex items-center justify-between w-3/6 m-auto
                                                        
                                                    '
                                                        >
                                                            <div>
                                                                <div>
                                                                    Môn học: {row.subjectName}
                                                                </div>
                                                                <div>Nhóm: {row.group}</div>
                                                                <div>
                                                                    Tổng đăng ký:{" "}
                                                                    {row.tempRegisters.length}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div>
                                                                    Niên khóa : {row.schoolYear}
                                                                </div>
                                                                <div>Học kỳ: {row.semester}</div>{" "}
                                                                <div>
                                                                    Tổng ca thi: {row.exams.length}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                }
                                                labels={[
                                                    `Danh sách đăng ký (${row.tempRegisters.length})`,
                                                    `Danh sách ca thi (${row.exams.length})`,
                                                ]}
                                                data={[
                                                    <RegisterList registers={row.tempRegisters} />,
                                                    <ExamList
                                                        exams={row.exams}
                                                        numberOfActiveStudents={
                                                            row.numberOfActiveStudents
                                                        }
                                                        numberOfMidTermExam={
                                                            row.numberOfMidTermExam
                                                        }
                                                        numberOfMidTermExamCreated={
                                                            row.numberOfMidTermExamCreated
                                                        }
                                                        numberOfFinalTermExam={
                                                            row.numberOfFinalTermExam
                                                        }
                                                        numberOfFinalTermExamCreated={
                                                            row.numberOfFinalTermExamCreated
                                                        }
                                                    />,
                                                ]}
                                            />
                                        }
                                    />
                                </Tooltip>
                            </td>
                            <td className={tailwindCss.tableCell}>{row.schoolYear}</td>
                            <td className={tailwindCss.tableCell}>{row.semester}</td>
                            <td className={tailwindCss.tableCell}>{row.subjectName}</td>
                            <td className={tailwindCss.tableCell}>{row.group}</td>
                            <td className={tailwindCss.tableCell}>
                                {row.status ? (
                                    <Badge color='failure'>Đã hủy</Badge>
                                ) : (
                                    <Badge color='success'>Đang mở</Badge>
                                )}
                            </td>
                            <td className={tailwindCss.tableCell}>{row.teacherName}</td>
                            <td className={`${tailwindCss.tableCell} flex items-center`}>
                                {userRoles.includes("Quản trị viên") && (
                                    <>
                                        <div className='mr-2'>
                                            <MyButton
                                                type={ButtonType.edit}
                                                onClick={() => {
                                                    $(`#creditClassModal`).css("display", "flex");
                                                    setIsEdit(true);
                                                    dispatch(setEditedCreditClass(row));
                                                }}
                                            />
                                        </div>
                                        <div className='mr-2'>
                                            <MyButton
                                                type={ButtonType.delete}
                                                onClick={() => {
                                                    dispatch(deleteCreditClass(row.id));
                                                }}
                                                disabled={!shouldDelete || !shouldCancel}
                                                customTooltipMessage={couldNotDeleteMessage}
                                            />
                                        </div>
                                        <EnableOrDisable
                                            status={row.status}
                                            enableOrDisable={enableOrDisableCreditClass}
                                            id={row.id}
                                            creditClassPage={true}
                                            disabled={!shouldCancel}
                                            customTooltipMessage={couldNotCancelMessage}
                                        />
                                    </>
                                )}
                                <div className='mx-2'>
                                    <Tooltip content={couldNotCreateExamMessage} placement='top'>
                                        <Button
                                            onClick={() => {
                                                $(`#examModal`).css("display", "flex");
                                                setCreditClassId(row.id);
                                                setValue("creditClassId", row.id);
                                            }}
                                            disabled={!shouldCreateExam}
                                        >
                                            <img src={ExamIcon} width='28px' height='28px' />
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
