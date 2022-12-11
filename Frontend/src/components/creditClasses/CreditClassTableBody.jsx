import { yupResolver } from "@hookform/resolvers/yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Tab, Tabs } from "@mui/material";
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
import { setTests } from "../../features/testSlice";
import { callToast } from "../../helpers";
import ExamIcon from "../../images/exam.png";
import { tailwindCss } from "../../tailwind";
import { examSchema } from "../../validation";
import EnableOrDisable from "../common/EnableOrDisable";
import MyButton, { ButtonType } from "../common/MyButton";
import ExamModalBody, { a11yProps, TabPanel } from "../exams/ExamModalBody";
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
                            <td className={tailwindCss.tableCell}>
                                <Tooltip content='Xem thông tin lớp tín chỉ'>
                                    <Button
                                        style={{ backgroundColor: "none" }}
                                        onClick={() => {
                                            $(`#viewCreditClassDetail${row.id}`).css(
                                                "display",
                                                "flex"
                                            );
                                        }}
                                    >
                                        {row.id}
                                    </Button>
                                    <TableModalViewer
                                        modalId={`viewCreditClassDetail${row.id}`}
                                        modalLabel='Thông tin lớp tín chỉ'
                                        ModalBody={
                                            <div>
                                                <Card>
                                                    <div
                                                        className='flex items-center justify-between w-3/6 m-auto
                                                        
                                                    '
                                                    >
                                                        <div>
                                                            <div>Môn học: {row.subjectName}</div>
                                                            <div>Nhóm: {row.group}</div>
                                                            <div>
                                                                Tổng đăng ký:{" "}
                                                                {row.tempRegisters.length}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>Niên khóa : {row.schoolYear}</div>
                                                            <div>Học kỳ: {row.semester}</div>{" "}
                                                            <div>
                                                                Tổng ca thi: {row.exams.length}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                                <Tabs
                                                    value={tabValue}
                                                    onChange={handleChange}
                                                    centered
                                                >
                                                    <Tab
                                                        label={`Danh sách đăng ký (${row.tempRegisters.length})`}
                                                        {...a11yProps(0)}
                                                    />
                                                    <Tab
                                                        label={`Danh sách ca thi (${row.exams.length})`}
                                                        {...a11yProps(1)}
                                                    />
                                                </Tabs>
                                                <TabPanel value={tabValue} index={0}>
                                                    <RegisterList registers={row.tempRegisters} />
                                                </TabPanel>
                                                <TabPanel value={tabValue} index={1}>
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
                                                    />
                                                </TabPanel>
                                            </div>
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
                                                disabled={
                                                    row.tempRegisters.length > 0 ||
                                                    row.exams.length > 0
                                                }
                                            />
                                        </div>
                                        <EnableOrDisable
                                            status={row.status}
                                            enableOrDisable={enableOrDisableCreditClass}
                                            id={row.id}
                                            creditClassPage={true}
                                            disabled={row.exams.length > 0}
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
                                            disabled={
                                                row.numberOfActiveStudents === 0 ||
                                                !row.shouldCreateExam
                                            }
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
