import React from "react";
import { useDispatch } from "react-redux";
import { Badge, Button, Tooltip } from "flowbite-react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { deleteTest, enableOrDisableTest, setEditedTest } from "../../features/testSlice";
import { tailwindCss } from "../../tailwind";
import MyButton, { ButtonType } from "../common/MyButton";
import CriteriaList from "./CriteriaList";
import TableModalViewer from "../utils/tables/TableModalViewer";
import EnableOrDisable from "../common/EnableOrDisable";
import QuestionList from "./QuestionList";
import $ from "jquery";

function TestTableBody({ rows, examPage = false, setIsEdit }) {
    const dispatch = useDispatch();
    return (
        <tbody>
            {rows.map((row, index) => (
                <tr
                    className={`${tailwindCss.tr} ${
                        !row.status && "bg-gray-200 hover:bg-gray-200"
                    }`}
                    key={row.id}
                >
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
                        <Badge color={!row.used ? "indigo" : "success"} size='sm'>
                            {!row.used ? "Chưa sử dụng" : "Đã sử dụng"}
                        </Badge>
                    </td>
                    <td className={tailwindCss.tableCell + " flex justify-center"}>
                        {row.numberOfQuestions}
                    </td>
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
                                <Tooltip content='Xem danh sách câu hỏi' placement='top'>
                                    <Button
                                        onClick={() => {
                                            $(`#questionsViewer${index}`).css("display", "flex");
                                        }}
                                        color='success'
                                        style={{
                                            width: "46px",
                                            height: "42px",
                                            backgroundColor: "#0E9F6E",
                                        }}
                                    >
                                        <VisibilityIcon />
                                    </Button>
                                    <TableModalViewer
                                        modalId={`questionsViewer${index}`}
                                        modalLabel='Danh sách câu hỏi'
                                        ModalBody={<QuestionList questions={row.questions} />}
                                    />
                                </Tooltip>
                            </div>
                            <div className='mr-2'>
                                <MyButton
                                    type={ButtonType.edit}
                                    onClick={() => {
                                        console.log(row);
                                        $("#testModal").css("display", "flex");
                                        setIsEdit(true);
                                        dispatch(setEditedTest(row));
                                    }}
                                />
                            </div>
                            <div className='mr-2'>
                                <MyButton
                                    type={ButtonType.delete}
                                    onClick={() => {
                                        dispatch(deleteTest(row.id));
                                    }}
                                    disabled={row.used}
                                />
                            </div>
                            <EnableOrDisable
                                status={row.status}
                                enableOrDisable={enableOrDisableTest}
                                id={row.id}
                                disabled={row.used}
                            />
                        </td>
                    )}
                </tr>
            ))}
        </tbody>
    );
}

export default TestTableBody;
