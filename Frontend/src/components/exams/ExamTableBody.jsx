import { Badge, Tooltip } from "flowbite-react";
import $ from "jquery";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { enableOrDisableExam, setEditedExam } from "../../features/examSlice";
import { persistUserState } from "../../features/persistUserSlice";
import { tailwindCss } from "../../tailwind";
import EnableOrDisable from "../common/EnableOrDisable";
import MyButton from "../common/MyButton";
import TableModalViewer from "../utils/tables/TableModalViewer";
import RegisterList from "./RegisterList";
// import { noticePeriodMappings } from "../../pages/takeTests/TakeTestPage";
import checkExamTime, { noticePeriodMappings } from "../../utils/checkExamTime";

function ExamTableBody({ rows, setIsEdit }) {
    const dispatch = useDispatch();

    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name) || [];

    return (
        <tbody>
            {rows.map((row, index) => {
                let shouldCancel = true,
                    shouldEdit = true;
                let shouldCancelMessage = "",
                    shouldEditMessage = "";

                if (row.taken) {
                    shouldCancel = false;
                    shouldEdit = false;
                    shouldCancelMessage = "Ca thi đã thi";
                    shouldEditMessage = "Ca thi đã thi";
                } else if (
                    !checkExamTime({
                        examDate: row.examDate,
                        noticePeriod: row.noticePeriod,
                        type: "checkLesser",
                    })
                ) {
                    shouldEdit = false;
                    shouldCancel = false;
                    shouldCancelMessage = "Qua thời gian thi của ca thi";
                    shouldEditMessage = "Qua thời gian thi của ca thi";
                }

                return (
                    <tr
                        className={`${tailwindCss.tr} ${
                            row.status && "bg-gray-200 hover:bg-gray-200"
                        }`}
                        key={row.id}
                    >
                        <td className={tailwindCss.tableCell}>{row.id}</td>
                        <td className={tailwindCss.tableCell} style={{ maxWidth: "200px" }}>
                            {row.name.split("-")[5] + "-" + row.name.split("-")[6]}
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
                        <td className={tailwindCss.tableCell}>
                            {row.noticePeriod} (
                            {noticePeriodMappings[row.noticePeriod].split("-")[0]})
                        </td>
                        <td className={tailwindCss.tableCell}>{row.time} phút</td>
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
                                        modalLabel={`Danh sách sinh viên (${row.tempTakeExams.length})`}
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
                                            disabled={!shouldEdit}
                                            customTooltipMessage={shouldEditMessage}
                                        />
                                    </div>
                                    <EnableOrDisable
                                        status={row.status}
                                        enableOrDisable={enableOrDisableExam}
                                        id={row.id}
                                        disabled={!shouldCancel}
                                        creditClassPage={true}
                                        customTooltipMessage={shouldCancelMessage}
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
