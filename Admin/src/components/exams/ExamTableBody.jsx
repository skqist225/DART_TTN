import React from "react";
import { tailwindCss } from "../../tailwind";
import MyButton from "../common/MyButton";
import $ from "jquery";
// import { deleteCreditClass } from "../../features/creditClassSlice";
import { useDispatch, useSelector } from "react-redux";
import { cellCss } from "../questions/QuestionTableBody";
import TableModalViewer from "../utils/tables/TableModalViewer";
import { Badge, Table } from "flowbite-react";
import { enableOrDisableExam, setEditedExam } from "../../features/examSlice";
import EnableOrDisable from "../common/EnableOrDisable";
import { persistUserState } from "../../features/persistUserSlice";

function ExamTableBody({ rows, setIsEdit }) {
    const dispatch = useDispatch();

    const { userRoles } = useSelector(persistUserState);

    return (
        <>
            <tbody>
                {rows.map((row, index) => {
                    return (
                        <tr
                            className={`${tailwindCss.tr} ${
                                row.status && "bg-gray-200 hover:bg-gray-200"
                            }`}
                            key={row.id}
                        >
                            <td className={cellCss}>{row.name}</td>
                            <td className={cellCss}>{row.subjectId}</td>
                            <td className={cellCss}>{row.subjectName}</td>
                            <td className={cellCss}>
                                {row.taken ? (
                                    <Badge color='success'>Đã thi</Badge>
                                ) : (
                                    <Badge color='info'>Chưa thi</Badge>
                                )}
                            </td>
                            <td className={cellCss}>{row.numberOfRegisters}</td>
                            <td className={cellCss}>{row.examDate}</td>
                            <td className={cellCss}>{row.noticePeriod}</td>
                            <td className={cellCss}>{row.time} phút</td>
                            <td className={cellCss}>{row.type}</td>
                            {/* <td className={cellCss}>{row.teacherName}</td> */}
                            {userRoles.includes("Quản trị viên") && (
                                <td className={cellCss}>{row.createdBy}</td>
                            )}
                            <td className={`${cellCss} flex items-center`}>
                                <div className='mr-2'>
                                    <MyButton
                                        type='view'
                                        onClick={() => {
                                            $(`#studentsViewer${index}`).css("display", "flex");
                                            // setIsEdit(false);
                                        }}
                                    />
                                    <TableModalViewer
                                        modalId={`studentsViewer${index}`}
                                        modalLabel='Danh sách sinh viên'
                                        ModalBody={
                                            <Table striped={true}>
                                                <Table.Head>
                                                    <Table.HeadCell>STT</Table.HeadCell>
                                                    <Table.HeadCell>MSSV</Table.HeadCell>
                                                    <Table.HeadCell>Họ tên</Table.HeadCell>
                                                    {!userRoles.includes("Sinh viên") && (
                                                        <>
                                                            {" "}
                                                            <Table.HeadCell>Bộ đề</Table.HeadCell>
                                                            <Table.HeadCell>Điểm số</Table.HeadCell>
                                                        </>
                                                    )}
                                                </Table.Head>
                                                <Table.Body className='divide-y'>
                                                    {row.takeExams.map(
                                                        (
                                                            {
                                                                register: {
                                                                    student: { fullName, id },
                                                                },
                                                                score,
                                                                testName,
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
                                                                    {id}
                                                                </Table.Cell>
                                                                <Table.Cell
                                                                    className={
                                                                        tailwindCss.tableViewerCell
                                                                    }
                                                                >
                                                                    {fullName}
                                                                </Table.Cell>
                                                                {!userRoles.includes(
                                                                    "Sinh viên"
                                                                ) && (
                                                                    <>
                                                                        {" "}
                                                                        <Table.Cell
                                                                            className={
                                                                                tailwindCss.tableViewerCell
                                                                            }
                                                                        >
                                                                            {testName}
                                                                        </Table.Cell>
                                                                        <Table.Cell
                                                                            className={
                                                                                tailwindCss.tableViewerCell
                                                                            }
                                                                        >
                                                                            {score}
                                                                        </Table.Cell>
                                                                    </>
                                                                )}
                                                            </Table.Row>
                                                        )
                                                    )}
                                                </Table.Body>
                                            </Table>
                                        }
                                    />
                                </div>
                                {!userRoles.includes("Sinh viên") && (
                                    <>
                                        <div className='mr-2'>
                                            <MyButton
                                                type='edit'
                                                onClick={() => {
                                                    $(`#examModal`).css("display", "flex");
                                                    setIsEdit(true);
                                                    dispatch(setEditedExam(row));
                                                }}
                                            />
                                        </div>
                                        <EnableOrDisable
                                            status={row.status}
                                            enableOrDisable={enableOrDisableExam}
                                            id={row.id}
                                            taken={row.taken}
                                            creditClassPage={true}
                                        />
                                    </>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </>
    );
}

export default ExamTableBody;
