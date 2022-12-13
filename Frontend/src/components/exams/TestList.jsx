import { Button, Table, Tooltip } from "flowbite-react";
import React from "react";
import { tailwindCss } from "../../tailwind";
import MyButton, { ButtonType } from "../common/MyButton";
import CriteriaList from "../tests/CriteriaList";
import QuestionList from "../tests/QuestionList";
import TableModalViewer from "../utils/tables/TableModalViewer";
import VisibilityIcon from "@mui/icons-material/Visibility";

import $ from "jquery";

function TestList({ rows }) {
    return (
        <Table striped={true}>
            <Table.Head>
                <Table.HeadCell></Table.HeadCell>
                <Table.HeadCell>Mã đề thi</Table.HeadCell>
                <Table.HeadCell>Tên đề thi</Table.HeadCell>
                <Table.HeadCell>Tiêu chí</Table.HeadCell>
                <Table.HeadCell>Danh sách câu hỏi</Table.HeadCell>
                <Table.HeadCell>Môn học</Table.HeadCell>
                <Table.HeadCell>Người tạo</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
                {rows.map((row, index) => (
                    <Table.Row className={`${tailwindCss.tr}`} key={row.id}>
                        <Table.Cell scope='col' className='p-4'>
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
                        </Table.Cell>

                        <Table.Cell className={tailwindCss.tableCell}>{row.id}</Table.Cell>
                        <Table.Cell className={`${tailwindCss.tableCell} text-sm`}>
                            {row.name}
                        </Table.Cell>

                        <Table.Cell className={tailwindCss.tableCell} style={{ zIndex: "9999" }}>
                            <Tooltip
                                content={<CriteriaList criteria={row.criteria} />}
                                placement='bottom'
                                animation='duration-300'
                                style='light'
                            >
                                <MyButton type={ButtonType.view} />
                            </Tooltip>
                        </Table.Cell>
                        <Table.Cell className={`${tailwindCss.tableCell} flex items-center`}>
                            <div className='mr-2'>
                                <Tooltip content='Xem danh sách câu hỏi' placement='top'>
                                    <Button
                                        onClick={() => {
                                            $(`#questionsViewer${row.id}`).css("display", "flex");
                                        }}
                                        color='success'
                                        style={{
                                            width: "46px",
                                            height: "42px",
                                            backgroundColor: "#0E9F6E",
                                        }}
                                        type='button'
                                    >
                                        <VisibilityIcon />
                                    </Button>
                                    <TableModalViewer
                                        modalId={`questionsViewer${row.id}`}
                                        modalLabel='Danh sách câu hỏi'
                                        ModalBody={<QuestionList questions={row.questions} />}
                                    />
                                </Tooltip>
                            </div>
                        </Table.Cell>
                        <Table.Cell className={tailwindCss.tableCell}>{row.subjectName}</Table.Cell>
                        <Table.Cell className={tailwindCss.tableCell}>{row.teacherName}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}

export default TestList;
