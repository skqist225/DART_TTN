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
                                <Badge color='success'>{row.status ? "Đã hủy" : "Đang mở"}</Badge>
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
                                        ModalBody={
                                            <>
                                                <Table striped={true}>
                                                    <Table.Head>
                                                        <Table.HeadCell>STT</Table.HeadCell>
                                                        <Table.HeadCell>MSSV</Table.HeadCell>
                                                        <Table.HeadCell>Họ tên</Table.HeadCell>
                                                        <Table.HeadCell>Trạng thái</Table.HeadCell>
                                                        <Table.HeadCell>Điểm CC</Table.HeadCell>
                                                        <Table.HeadCell>Điểm GK</Table.HeadCell>
                                                        <Table.HeadCell>Điểm GK</Table.HeadCell>
                                                    </Table.Head>
                                                    <Table.Body className='divide-y'>
                                                        {row.tempRegisters.map(
                                                            (
                                                                {
                                                                    id,
                                                                    student: {
                                                                        id: studentId,
                                                                        fullName,
                                                                    },
                                                                    status,
                                                                    attendanceScore,
                                                                    midTermScore,
                                                                    finalTermScore,
                                                                },
                                                                index
                                                            ) => (
                                                                <Table.Row
                                                                    className='bg-white dark:border-gray-700 dark:bg-gray-800'
                                                                    key={id}
                                                                >
                                                                    <Table.Cell
                                                                        className={
                                                                            tailwindCss.tableViewerCell
                                                                        }
                                                                    >
                                                                        {index + 1}
                                                                    </Table.Cell>
                                                                    <Table.Cell
                                                                        className={
                                                                            tailwindCss.tableViewerCell
                                                                        }
                                                                    >
                                                                        {studentId}
                                                                    </Table.Cell>
                                                                    <Table.Cell
                                                                        className={
                                                                            tailwindCss.tableViewerCell
                                                                        }
                                                                    >
                                                                        {fullName}
                                                                    </Table.Cell>
                                                                    <Table.Cell
                                                                        className={
                                                                            tailwindCss.tableViewerCell
                                                                        }
                                                                    >
                                                                        {!status ? (
                                                                            <Badge color='success'>
                                                                                Đang học
                                                                            </Badge>
                                                                        ) : (
                                                                            <Badge color='failure'>
                                                                                Đã hủy
                                                                            </Badge>
                                                                        )}
                                                                    </Table.Cell>
                                                                    <Table.Cell
                                                                        className={
                                                                            tailwindCss.tableViewerCell
                                                                        }
                                                                    >
                                                                        {attendanceScore}
                                                                    </Table.Cell>
                                                                    <Table.Cell
                                                                        className={
                                                                            tailwindCss.tableViewerCell
                                                                        }
                                                                    >
                                                                        {midTermScore}
                                                                    </Table.Cell>
                                                                    <Table.Cell
                                                                        className={
                                                                            tailwindCss.tableViewerCell
                                                                        }
                                                                    >
                                                                        {finalTermScore}
                                                                    </Table.Cell>
                                                                </Table.Row>
                                                            )
                                                        )}
                                                    </Table.Body>
                                                </Table>
                                                <TablePagination
                                                    totalElements={row.tempRegisters.length}
                                                    totalPages={row.tempRegisters / 10 + 1}
                                                />
                                            </>
                                        }
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
                                            <>
                                                <div>Tổng số SV : {row.numberOfActiveStudents}</div>
                                                <Table striped={true}>
                                                    <Table.Head>
                                                        <Table.HeadCell>STT</Table.HeadCell>
                                                        <Table.HeadCell>Loại</Table.HeadCell>
                                                        <Table.HeadCell>Số ca</Table.HeadCell>
                                                        <Table.HeadCell>Đã thi</Table.HeadCell>
                                                        <Table.HeadCell>Chưa thi</Table.HeadCell>
                                                    </Table.Head>
                                                    <Table.Body className='divide-y'>
                                                        <Table.Row>
                                                            <Table.Cell
                                                                className={
                                                                    tailwindCss.tableViewerCell
                                                                }
                                                            >
                                                                1
                                                            </Table.Cell>
                                                            <Table.Cell
                                                                className={
                                                                    tailwindCss.tableViewerCell
                                                                }
                                                            >
                                                                Giữa kỳ
                                                            </Table.Cell>
                                                            <Table.Cell
                                                                className={
                                                                    tailwindCss.tableViewerCell
                                                                }
                                                            >
                                                                {row.numberOfMidTermExam}
                                                            </Table.Cell>
                                                            <Table.Cell
                                                                className={
                                                                    tailwindCss.tableViewerCell
                                                                }
                                                            >
                                                                {row.numberOfMidTermExamCreated}
                                                            </Table.Cell>
                                                            <Table.Cell
                                                                className={
                                                                    tailwindCss.tableViewerCell
                                                                }
                                                            >
                                                                {row.numberOfActiveStudents -
                                                                    row.numberOfMidTermExamCreated}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row>
                                                            <Table.Cell
                                                                className={
                                                                    tailwindCss.tableViewerCell
                                                                }
                                                            >
                                                                2
                                                            </Table.Cell>
                                                            <Table.Cell
                                                                className={
                                                                    tailwindCss.tableViewerCell
                                                                }
                                                            >
                                                                Cuối kỳ
                                                            </Table.Cell>
                                                            <Table.Cell
                                                                className={
                                                                    tailwindCss.tableViewerCell
                                                                }
                                                            >
                                                                {row.numberOfFinalTermExam}
                                                            </Table.Cell>
                                                            <Table.Cell
                                                                className={
                                                                    tailwindCss.tableViewerCell
                                                                }
                                                            >
                                                                {row.numberOfFinalTermExamCreated}
                                                            </Table.Cell>
                                                            <Table.Cell
                                                                className={
                                                                    tailwindCss.tableViewerCell
                                                                }
                                                            >
                                                                {row.numberOfActiveStudents -
                                                                    row.numberOfFinalTermExamCreated}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    </Table.Body>
                                                </Table>
                                                <Table striped={true}>
                                                    <Table.Head>
                                                        <Table.HeadCell>STT</Table.HeadCell>
                                                        <Table.HeadCell>Tên ca thi</Table.HeadCell>
                                                        <Table.HeadCell>Loại kỳ thi</Table.HeadCell>
                                                        <Table.HeadCell>Trạng thái</Table.HeadCell>
                                                        <Table.HeadCell>Tình trạng</Table.HeadCell>
                                                        <Table.HeadCell>Số SV thi</Table.HeadCell>
                                                        <Table.HeadCell>Ngày thi</Table.HeadCell>
                                                        <Table.HeadCell>
                                                            Tiết báo danh
                                                        </Table.HeadCell>
                                                    </Table.Head>
                                                    <Table.Body className='divide-y'>
                                                        {row.exams &&
                                                            row.exams.length &&
                                                            row.exams.map(
                                                                (
                                                                    {
                                                                        id,
                                                                        name,
                                                                        noticePeriod,
                                                                        status,
                                                                        taken,
                                                                        time,
                                                                        type,
                                                                        tests,
                                                                        numberOfRegisters,
                                                                        examDate,
                                                                    },
                                                                    index
                                                                ) => (
                                                                    <Table.Row
                                                                        className='bg-white dark:border-gray-700 dark:bg-gray-800'
                                                                        key={id}
                                                                    >
                                                                        <Table.Cell
                                                                            className={
                                                                                tailwindCss.tableViewerCell
                                                                            }
                                                                        >
                                                                            {index + 1}
                                                                        </Table.Cell>
                                                                        <Table.Cell
                                                                            className={
                                                                                tailwindCss.tableViewerCell
                                                                            }
                                                                        >
                                                                            {name}
                                                                        </Table.Cell>
                                                                        <Table.Cell
                                                                            className={
                                                                                tailwindCss.tableViewerCell
                                                                            }
                                                                        >
                                                                            {type}
                                                                        </Table.Cell>
                                                                        <Table.Cell
                                                                            className={
                                                                                tailwindCss.tableViewerCell
                                                                            }
                                                                        >
                                                                            {!taken ? (
                                                                                <Badge color='info'>
                                                                                    Chưa thi
                                                                                </Badge>
                                                                            ) : (
                                                                                <Badge color='success'>
                                                                                    Đã thi
                                                                                </Badge>
                                                                            )}
                                                                        </Table.Cell>
                                                                        <Table.Cell
                                                                            className={
                                                                                tailwindCss.tableViewerCell
                                                                            }
                                                                        >
                                                                            {!status ? (
                                                                                <Badge color='warning'>
                                                                                    Chưa hủy
                                                                                </Badge>
                                                                            ) : (
                                                                                <Badge color='failure'>
                                                                                    Đã hủy
                                                                                </Badge>
                                                                            )}
                                                                        </Table.Cell>
                                                                        <Table.Cell
                                                                            className={
                                                                                tailwindCss.tableViewerCell
                                                                            }
                                                                        >
                                                                            {numberOfRegisters}
                                                                        </Table.Cell>
                                                                        <Table.Cell
                                                                            className={
                                                                                tailwindCss.tableViewerCell
                                                                            }
                                                                        >
                                                                            {examDate}
                                                                        </Table.Cell>
                                                                        <Table.Cell
                                                                            className={
                                                                                tailwindCss.tableViewerCell
                                                                            }
                                                                        >
                                                                            {noticePeriod}
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                )
                                                            )}
                                                    </Table.Body>
                                                </Table>
                                                <TablePagination
                                                    totalElements={row.tempRegisters.length}
                                                    totalPages={row.tempRegisters / 10 + 1}
                                                />
                                            </>
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
                                <div className='mr-2'>
                                    <Button
                                        onClick={() => {
                                            $(`#examModal`).css("display", "flex");
                                            setCreditClassId(row.id);
                                            setValue("creditClassId", row.id);
                                        }}
                                        disabled={row.numberOfActiveStudents === 0}
                                    >
                                        {/* <img src={AddIcon} width='30px' height='30px' /> */}
                                        <span>Thêm ca thi</span>
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
        </tbody>
    );
}

export default CreditClassTableBody;
