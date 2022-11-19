import React from "react";
import { deleteTest, setEditedTest } from "../../features/testSlice";
import { tailwindCss } from "../../tailwind";
import MyButton from "../common/MyButton";
import { useDispatch } from "react-redux";
import $ from "jquery";
import { cellCss } from "../questions/QuestionTableBody";
import { Badge, Button, Table, Tooltip } from "flowbite-react";
import LevelBadge from "../common/LevelBadge";

function TestTableBody({ rows, setIsEdit, examPage = false }) {
    const dispatch = useDispatch();

    return (
        <tbody>
            {rows.map(row => (
                <tr className={tailwindCss.tr} key={row.id}>
                    {examPage && (
                        <th scope='col' className='p-4'>
                            <div className='flex items-center'>
                                <input
                                    type='checkbox'
                                    className='w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 tests-checkbox'
                                    data-id={row.id}
                                />
                                <label htmlFor='checkbox-all' class='sr-only'>
                                    checkbox
                                </label>
                            </div>
                        </th>
                    )}
                    <td className={cellCss}>{row.id}</td>
                    <td
                        className={cellCss + ` text-sm`}
                        style={{ maxWidth: `${examPage && "150px"}` }}
                    >
                        {row.name}
                    </td>
                    <td className={cellCss}>
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
                    <td className={cellCss}>{row.numberOfQuestions}</td>
                    <td className={cellCss} style={{ zIndex: "9999" }}>
                        <Tooltip
                            content={
                                <Table striped={true}>
                                    <Table.Head>
                                        <Table.HeadCell>Chương</Table.HeadCell>
                                        <Table.HeadCell>Số câu hỏi</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className='divide-y'>
                                        {row.criteria.map(({ chapter, levelAndNumbers }) => (
                                            <Table.Row
                                                className='bg-white dark:border-gray-700 dark:bg-gray-800'
                                                key={chapter}
                                            >
                                                <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                                                    {chapter}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {levelAndNumbers.map(
                                                        ({ level, numberOfQuestions }) => (
                                                            <LevelBadge
                                                                level={level}
                                                                numberOfQuestions={
                                                                    numberOfQuestions
                                                                }
                                                                key={
                                                                    chapter +
                                                                    level +
                                                                    numberOfQuestions
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            }
                            placement='bottom'
                            animation='duration-300'
                            style='light'
                        >
                            <Button color='purple'>Xem tiêu chí</Button>
                        </Tooltip>
                    </td>
                    <td className={cellCss}>{row.subjectName}</td>
                    <td className={cellCss}>{row.teacherName}</td>
                    {!examPage && (
                        <td className={`${cellCss} flex items-center`}>
                            <MyButton
                                type='edit'
                                onClick={() => {
                                    $("#subjectModal").css("display", "flex");
                                    setIsEdit(true);
                                    dispatch(setEditedTest(row));
                                }}
                            />
                            <div className='mx-3'>
                                <MyButton
                                    type='delete'
                                    onClick={() => {
                                        dispatch(deleteTest(row.id));
                                    }}
                                />
                            </div>
                        </td>
                    )}
                </tr>
            ))}
        </tbody>
    );
}

export default TestTableBody;
