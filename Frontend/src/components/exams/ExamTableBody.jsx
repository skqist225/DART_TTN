import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Tooltip } from "flowbite-react";
import { tailwindCss } from "../../tailwind";
import MyButton from "../common/MyButton";
import TableModalViewer from "../utils/tables/TableModalViewer";
import { enableOrDisableExam, setEditedExam } from "../../features/examSlice";
import EnableOrDisable from "../common/EnableOrDisable";
import { persistUserState } from "../../features/persistUserSlice";
import RegisterList from "./RegisterList";
import $ from "jquery";

function ExamTableBody({ rows, setIsEdit }) {
    const dispatch = useDispatch();

    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name) || [];

    return (
        <tbody>
            {rows.map((row, index) => {
                return (
                    <tr
                        className={`${tailwindCss.tr} ${
                            row.status && "bg-gray-200 hover:bg-gray-200"
                        }`}
                        key={row.id}
                    >
                        <td className={tailwindCss.tableCell}>{row.id}</td>
                        <td className={tailwindCss.tableCell} style={{ maxWidth: "200px" }}>
                            {row.name}
                        </td>
                        <td className={tailwindCss.tableCell}>{row.subjectId}</td>
                        <td className={tailwindCss.tableCell}>{row.subjectName}</td>
                        {!userRoles.includes("Sinh viên") && (
                            <td className={tailwindCss.tableCell}>
                                <Badge color={row.taken ? "success" : "info"}>
                                    {row.taken ? "Đã thi" : "Chưa thi"}
                                </Badge>
                            </td>
                        )}
                        <td className={tailwindCss.tableCell}>{row.numberOfRegisters}</td>
                        <td className={tailwindCss.tableCell}>{row.examDate}</td>
                        <td className={tailwindCss.tableCell}>{row.noticePeriod}</td>
                        <td className={tailwindCss.tableCell}>{row.time} phút</td>
                        <td className={tailwindCss.tableCell}>{row.type}</td>
                        <td className={tailwindCss.tableCell}>{row.teacherName}</td>
                        <td className={`${tailwindCss.tableCell} flex items-center`}>
                            <div className='mr-2'>
                                <Tooltip content='Xem danh sách thi' placement='top'>
                                    <MyButton
                                        type='view'
                                        onClick={() => {
                                            $(`#studentsViewer${index}`).css("display", "flex");
                                        }}
                                    />
                                    <TableModalViewer
                                        modalId={`studentsViewer${index}`}
                                        modalLabel='Danh sách sinh viên'
                                        ModalBody={<RegisterList takeExams={row.tempTakeExams} />}
                                    />
                                </Tooltip>
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
                                        disabled={row.taken}
                                        creditClassPage={true}
                                    />
                                </>
                            )}
                        </td>
                    </tr>
                );
            })}
        </tbody>
    );
}

export default ExamTableBody;
