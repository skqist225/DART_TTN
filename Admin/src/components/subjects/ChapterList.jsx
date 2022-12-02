import React from "react";
import { Table, Tooltip } from "flowbite-react";
import { tailwindCss } from "../../tailwind";
import MyButton from "../common/MyButton";
import QuestionList from "../tests/QuestionList";
import TableModalViewer from "../utils/tables/TableModalViewer";
import $ from "jquery";

function ChapterList({ chapters }) {
    return (
        <Table striped={true}>
            <Table.Head>
                <Table.HeadCell>STT</Table.HeadCell>
                <Table.HeadCell>Mã chương</Table.HeadCell>
                <Table.HeadCell>Tên chương</Table.HeadCell>
                <Table.HeadCell>Danh sách câu hỏi</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
                {chapters.map(({ id, name, tempQuestions: questions }, index) => {
                    console.log(questions);
                    return (
                        <Table.Row
                            className='bg-white dark:border-gray-700 dark:bg-gray-800'
                            key={id}
                        >
                            <Table.Cell className={tailwindCss.tableViewerCell}>
                                {index + 1}
                            </Table.Cell>
                            <Table.Cell className={tailwindCss.tableViewerCell}>{id}</Table.Cell>
                            <Table.Cell className={tailwindCss.tableViewerCell}>{name}</Table.Cell>
                            <Table.Cell className={tailwindCss.tableViewerCell}>
                                <Tooltip content='Xem danh sách câu hỏi' placement='top'>
                                    <MyButton
                                        type='view'
                                        onClick={() => {
                                            $(`#questionsViewer${id}`).css("display", "flex");
                                        }}
                                        disabled={questions.length === 0}
                                    />
                                    <TableModalViewer
                                        modalId={`questionsViewer${id}`}
                                        modalLabel='Danh sách câu hỏi'
                                        ModalBody={<QuestionList questions={questions} />}
                                    />
                                </Tooltip>
                            </Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
}

export default ChapterList;
