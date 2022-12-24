import { Button, Tooltip } from "flowbite-react";
import $ from "jquery";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MyButton from "../../components/common/MyButton";
import { persistUserState } from "../../features/persistUserSlice";
import { deleteSubject, setEditedSubject, subjectState } from "../../features/subjectSlice";
import { tailwindCss } from "../../tailwind";
import ViewDetails from "../common/ViewDetails";
import TableModalViewer from "../utils/tables/TableModalViewer";
import ChapterList from "./ChapterList";

function SubjectTableBody({ rows, setIsEdit }) {
    const dispatch = useDispatch();

    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);
    const { subjectsHaveQuestion: subjects } = useSelector(subjectState);

    return (
        <tbody>
            {rows.map((row, index) => {
                const haveChapter = row.chapters.length > 0;

                return (
                    <tr className={tailwindCss.tr} key={row.id}>
                        <td className={tailwindCss.tableCell}>
                            {" "}
                            <Tooltip content={"Xem chi tiết môn học"}>
                                <Button
                                    style={{ backgroundColor: "none", width: "100px" }}
                                    onClick={() => {
                                        $(`#viewTestDetail${row.id}`).css("display", "flex");
                                    }}
                                >
                                    {row.id}
                                </Button>
                                <TableModalViewer
                                    modalId={`viewTestDetail${row.id}`}
                                    modalLabel='Thông tin môn học'
                                    ModalBody={
                                        <ViewDetails
                                            Header={<></>}
                                            labels={[`Danh sách chương (${row.chapters.length})`]}
                                            data={[<ChapterList chapters={row.chapters} />, ,]}
                                        />
                                    }
                                />
                            </Tooltip>
                        </td>
                        <td className={tailwindCss.tableCell}>{row.name}</td>
                        <td className={tailwindCss.tableCell}>{row.numberOfTheoreticalPeriods}</td>
                        <td className={tailwindCss.tableCell}>{row.numberOfPracticePeriods}</td>
                        <td className={tailwindCss.tableCell}>{row.chapters.length}</td>
                        <td className={tailwindCss.tableCell}>{row.numberOfTests}</td>
                        <td className={tailwindCss.tableCell}>{row.numberOfQuestions}</td>
                        <td class={`${tailwindCss.tableCell} flex items-center`}>
                            {userRoles.includes("Quản trị viên") ||
                            subjects.map(({ id }) => id).includes(row.id) ? (
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
                            ) : (
                                <></>
                            )}

                            {userRoles.includes("Quản trị viên") && (
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
