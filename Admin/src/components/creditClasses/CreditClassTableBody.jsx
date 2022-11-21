import React from "react";
import { tailwindCss } from "../../tailwind";
import MyButton from "../common/MyButton";
import $ from "jquery";
import {
    deleteCreditClass,
    enableOrDisableCreditClass,
    setEditedCreditClass,
} from "../../features/creditClassSlice";
import { cellCss } from "../questions/QuestionTableBody";
import EnableOrDisable from "../common/EnableOrDisable";
import { useDispatch } from "react-redux";
import { persistUserState } from "../../features/persistUserSlice";
import { useSelector } from "react-redux";
import AddIcon from "../../images/add.png";
import { Badge, Button, Table, Tooltip } from "flowbite-react";
import TableModalViewer from "../utils/tables/TableModalViewer";
import TablePagination from "../utils/tables/TablePagination";

function CreditClassTableBody({ rows, setIsEdit }) {
    const dispatch = useDispatch(0);

    const { userRoles } = useSelector(persistUserState);

    return (
        <tbody>
            {rows.map((row, index) => (
                <tr
                    className={`${tailwindCss.tr} ${row.status && "bg-gray-200 hover:bg-gray-200"}`}
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
                                <MyButton
                                    type='view'
                                    onClick={() => {
                                        $(`#studentsViewer${index}`).css("display", "flex");
                                    }}
                                />
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
                                                            student: { id: studentId, fullName },
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
                                                                    <Badge color='error'>
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
                                <MyButton
                                    type='view'
                                    onClick={() => {
                                        $(`#examsViewer${index}`).css("display", "flex");
                                    }}
                                />
                            </Tooltip>
                            <TableModalViewer
                                modalId={`examsViewer${index}`}
                                modalLabel='Danh sách sinh viên'
                                ModalBody={
                                    <>
                                        <Table striped={true}>
                                            <Table.Head>
                                                <Table.HeadCell>STT</Table.HeadCell>
                                                <Table.HeadCell>Tên ca thi</Table.HeadCell>
                                                <Table.HeadCell>Loại kỳ thi</Table.HeadCell>
                                                <Table.HeadCell>Trạng thái</Table.HeadCell>
                                                <Table.HeadCell>Số SV thi</Table.HeadCell>
                                                <Table.HeadCell>Ngày thi</Table.HeadCell>
                                                <Table.HeadCell>Tiết báo danh</Table.HeadCell>
                                            </Table.Head>
                                            <Table.Body className='divide-y'>
                                                {row.exams.map(
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
                                                                {!status ? (
                                                                    <Badge color='success'>
                                                                        Đang học
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge color='error'>
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
                                    $(`#creditClassModal`).css("display", "flex");
                                }}
                            >
                                {/* <img src={AddIcon} width='30px' height='30px' /> */}
                                <span>Thêm ca thi</span>
                            </Button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default CreditClassTableBody;
