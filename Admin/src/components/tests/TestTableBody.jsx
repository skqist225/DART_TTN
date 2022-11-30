import React from "react";
import { deleteTest, setEditedTest } from "../../features/testSlice";
import { tailwindCss } from "../../tailwind";
import MyButton, { ButtonType } from "../common/MyButton";
import { useDispatch } from "react-redux";
import $ from "jquery";
import { Badge, Button, Table, Tooltip } from "flowbite-react";
import CriteriaList from "./CriteriaList";
import TableModalViewer from "../utils/tables/TableModalViewer";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LevelBadge from "../common/LevelBadge";
import EnableOrDisable from "../common/EnableOrDisable";
import QuestionTableBody from "../questions/QuestionTableBody";
import QuestionList from "./QuestionList";

function TestTableBody({ rows, setIsEdit, examPage = false }) {
    const dispatch = useDispatch();

    return (
        <tbody>
            {rows.map((row, index) => (
                <tr className={tailwindCss.tr} key={row.id}>
                    {examPage && (
                        <th scope='col' className='p-4'>
                            <div className='flex items-center'>
                                <input
                                    type='checkbox'
                                    className='w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 tests-checkbox'
                                    data-id={row.id}
                                />
                                <label htmlFor='checkbox-all' className='sr-only'>
                                    checkbox
                                </label>
                            </div>
                        </th>
                    )}
                    <td className={tailwindCss.tableCell}>{row.id}</td>
                    <td
                        className={`${tailwindCss.tableCell} text-sm`}
                        style={{ maxWidth: `${examPage && "150px"}` }}
                    >
                        {row.name}
                    </td>
                    <td className={tailwindCss.tableCell}>
                        {row.status === "Chưa sử dụng" ? (
                            <Badge color='indigo' size='sm'>
                                {row.status}
                            </Badge>
                        ) : (
                            <Badge color='success' size='sm'>
                                {row.status}
                            </Badge>
                        )}
                    </td>
                    <td className={tailwindCss.tableCell}>{row.numberOfQuestions}</td>
                    <td className={tailwindCss.tableCell} style={{ zIndex: "9999" }}>
                        <Tooltip
                            content={<CriteriaList criteria={row.criteria} />}
                            placement='bottom'
                            animation='duration-300'
                            style='light'
                        >
                            <MyButton type={ButtonType.view} />
                        </Tooltip>
                    </td>
                    <td className={tailwindCss.tableCell}>{row.subjectName}</td>
                    <td className={tailwindCss.tableCell}>{row.teacherName}</td>
                    {!examPage && (
                        <td className={`${tailwindCss.tableCell} flex items-center`}>
                            <div className='mr-2'>
                                <MyButton
                                    type='view'
                                    onClick={() => {
                                        $(`#questionsViewer${index}`).css("display", "flex");
                                    }}
                                />
                                <TableModalViewer
                                    modalId={`questionsViewer${index}`}
                                    modalLabel='Danh sách câu hỏi'
                                    ModalBody={<QuestionList questions={row.questions} />}
                                />
                            </div>
                            <div className='mr-2'>
                                <MyButton
                                    type={ButtonType.edit}
                                    onClick={() => {
                                        $("#testModal").css("display", "flex");
                                        setIsEdit(true);
                                        dispatch(setEditedTest(row));
                                    }}
                                />
                            </div>
                            <EnableOrDisable
                                status={row.status}
                                // enableOrDisable={enableOrDisableTest}
                                id={row.id}
                            />
                        </td>
                    )}
                </tr>
            ))}
        </tbody>
    );
}

export default TestTableBody;
