import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "flowbite-react";
import { tailwindCss } from "../../tailwind";
import MyButton from "../../components/common/MyButton";
import TableModalViewer from "../utils/tables/TableModalViewer";
import { persistUserState } from "../../features/persistUserSlice";
import { deleteSubject, setEditedSubject } from "../../features/subjectSlice";
import ChapterList from "./ChapterList";
import $ from "jquery";

function SubjectTableBody({ rows, setIsEdit }) {
    const dispatch = useDispatch();
    const { user } = useSelector(persistUserState);

    return (
        <tbody>
            {rows.map((row, index) => {
                const haveChapter = row.chapters.length > 0;

                return (
                    <tr className={tailwindCss.tr} key={row.id}>
                        <td className={tailwindCss.tableCell}>{row.id}</td>
                        <td className={tailwindCss.tableCell}>{row.name}</td>
                        <td className={tailwindCss.tableCell}>{row.numberOfTheoreticalPeriods}</td>
                        <td className={tailwindCss.tableCell}>{row.numberOfPracticePeriods}</td>
                        <td className={tailwindCss.tableCell}>{row.chapters.length}</td>
                        <td className={tailwindCss.tableCell}>{row.numberOfTests}</td>
                        <td className={tailwindCss.tableCell}>{row.numberOfQuestions}</td>
                        <td class={`${tailwindCss.tableCell} flex items-center`}>
                            <div className='mr-2'>
                                <Tooltip
                                    content={
                                        haveChapter ? "Xem danh sách chương" : "Không có chương"
                                    }
                                    placement='top'
                                >
                                    <MyButton
                                        type='view'
                                        onClick={() => {
                                            $(`#chaptersViewer${row.id}`).css("display", "flex");
                                        }}
                                        disabled={!haveChapter}
                                    />
                                    <TableModalViewer
                                        modalId={`chaptersViewer${row.id}`}
                                        modalLabel={`Danh sách chương (${row.chapters.length})`}
                                        ModalBody={<ChapterList chapters={row.chapters} />}
                                    />
                                </Tooltip>
                            </div>
                            <div className='mr-3'>
                                <MyButton
                                    type='edit'
                                    onClick={() => {
                                        $("#subjectModal").css("display", "flex");
                                        setIsEdit(true);
                                        dispatch(setEditedSubject(row));
                                    }}
                                />
                            </div>
                            {user.roles.map(({ name }) => name).includes("Quản trị viên") && (
                                <div>
                                    <MyButton
                                        type='delete'
                                        onClick={() => {
                                            dispatch(deleteSubject(row.id));
                                        }}
                                    />
                                </div>
                            )}
                        </td>
                    </tr>
                );
            })}
        </tbody>
    );
}

export default SubjectTableBody;