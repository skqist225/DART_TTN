import React from "react";
import { deleteSubject, setEditedSubject } from "../../features/subjectSlice";
import { tailwindCss } from "../../tailwind";
import MyButton from "../../components/common/MyButton";
import $ from "jquery";
import { useDispatch } from "react-redux";
import { cellCss } from "../questions/QuestionTableBody";
import { Table } from "flowbite-react";
import TableModalViewer from "../utils/tables/TableModalViewer";
import { persistUserState } from "../../features/persistUserSlice";
import { useSelector } from "react-redux";

function SubjectTableBody({ rows, setIsEdit }) {
    const dispatch = useDispatch();
    const { userRoles } = useSelector(persistUserState);

    return (
        <tbody>
            {rows.map((row, index) => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className={cellCss}>{row.id}</td>
                    <td className={cellCss}>{row.name}</td>
                    <td className={cellCss}>{row.numberOfTheoreticalPeriods}</td>
                    <td className={cellCss}>{row.numberOfPracticePeriods}</td>
                    <td className={cellCss}>{row.chapters.length}</td>
                    <td className={cellCss}>{row.numberOfTests}</td>
                    <td className={cellCss}>{row.numberOfQuestions}</td>
                    <td class={`${cellCss} flex items-center`}>
                        <div className='mr-2'>
                            <MyButton
                                type='view'
                                onClick={() => {
                                    $(`#chaptersViewer${index}`).css("display", "flex");
                                }}
                            />
                            <TableModalViewer
                                modalId={`chaptersViewer${index}`}
                                modalLabel='Danh sách chương'
                                ModalBody={
                                    <Table striped={true}>
                                        <Table.Head>
                                            <Table.HeadCell>STT</Table.HeadCell>
                                            <Table.HeadCell>Mã chương</Table.HeadCell>
                                            <Table.HeadCell>Tên chương</Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body className='divide-y'>
                                            {row.chapters.map(({ id, name }, index) => (
                                                <Table.Row
                                                    className='bg-white dark:border-gray-700 dark:bg-gray-800'
                                                    key={id}
                                                >
                                                    <Table.Cell
                                                        className={tailwindCss.tableViewerCell}
                                                    >
                                                        {index + 1}
                                                    </Table.Cell>
                                                    <Table.Cell
                                                        className={tailwindCss.tableViewerCell}
                                                    >
                                                        {id}
                                                    </Table.Cell>
                                                    <Table.Cell
                                                        className={tailwindCss.tableViewerCell}
                                                    >
                                                        {name}
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                }
                            />
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
            ))}
        </tbody>
    );
}

export default SubjectTableBody;
