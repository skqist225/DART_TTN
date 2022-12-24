import { Button, Table, Tooltip } from "flowbite-react";
import React from "react";
import { tailwindCss } from "../../tailwind";
import CriteriaList from "../tests/CriteriaList";
import QuestionList from "../tests/QuestionList";
import TableModalViewer from "../utils/tables/TableModalViewer";

import $ from "jquery";
import ViewDetails from "../common/ViewDetails";

function TestList({ rows, addCheckbox = false }) {
    return (
        <Table striped={true}>
            <Table.Head>
                <Table.HeadCell></Table.HeadCell>
                <Table.HeadCell>Mã đề thi</Table.HeadCell>
                <Table.HeadCell>Tên đề thi</Table.HeadCell>
                <Table.HeadCell>Số câu hỏi</Table.HeadCell>
                <Table.HeadCell>Môn học</Table.HeadCell>
                <Table.HeadCell>Người tạo</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y max-h-3 overflow-scroll'>
                {rows.map((row, index) => (
                    <Table.Row className={`${tailwindCss.tr}`} key={row.id}>
                        {addCheckbox && (
                            <Table.Cell scope='col' className='p-4'>
                                <div className='flex items-center'>
                                    <input
                                        type='checkbox'
                                        className='w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 tests-checkbox'
                                        data-id={row.id}
                                    />
                                </div>
                            </Table.Cell>
                        )}

                        <Table.Cell className={tailwindCss.tableCell}>
                            <Tooltip content={"Xem chi tiết đề thi"}>
                                <Button
                                    style={{ backgroundColor: "none" }}
                                    onClick={() => {
                                        $(`#viewTestDetail${row.id}`).css("display", "flex");
                                    }}
                                >
                                    {row.id}
                                </Button>
                                <TableModalViewer
                                    modalId={`viewTestDetail${row.id}`}
                                    modalLabel='Thông tin đề thi'
                                    ModalBody={
                                        <ViewDetails
                                            labels={[
                                                `Danh sách tiêu chí (${row.criteria.length})`,
                                                `Danh sách câu hỏi (${row.questions.length})`,
                                            ]}
                                            data={[
                                                <CriteriaList criteria={row.criteria} />,
                                                <QuestionList questions={row.questions} />,
                                            ]}
                                        />
                                    }
                                />
                            </Tooltip>
                        </Table.Cell>
                        <Table.Cell className={`${tailwindCss.tableCell} text-sm`}>
                            {row.name}
                        </Table.Cell>
                        <Table.Cell className={`${tailwindCss.tableCell} text-sm`}>
                            {row.questions.length}
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
