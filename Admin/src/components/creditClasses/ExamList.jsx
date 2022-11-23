import { Badge, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { tailwindCss } from "../../tailwind";
import TablePagination from "../utils/tables/TablePagination";

function ExamList({
    exams,
    numberOfActiveStudents,
    numberOfMidTermExam,
    numberOfMidTermExamCreated,
    numberOfFinalTermExam,
    numberOfFinalTermExamCreated,
}) {
    const [pageNumber, setPageNumber] = useState(1);
    const [splitedExams, setSplitedExams] = useState([]);

    const recordsPerPage = 10;

    useEffect(() => {
        if (exams && exams.length) {
            setSplitedExams(exams.slice(0, recordsPerPage));
        }
    }, [exams]);

    const fetchDataByPageNumber = pageNumber => {
        // each page will have recordsPerPage records
        // 2: 13 -24
        setSplitedExams(
            exams.slice(
                (pageNumber - 1) * recordsPerPage,
                (pageNumber - 1) * recordsPerPage + recordsPerPage
            )
        );
        setPageNumber(pageNumber);
    };

    return (
        <div>
            <div>Tổng số SV : {numberOfActiveStudents}</div>
            <Table striped={true}>
                <Table.Head>
                    <Table.HeadCell>STT</Table.HeadCell>
                    <Table.HeadCell>Loại</Table.HeadCell>
                    <Table.HeadCell>Số ca</Table.HeadCell>
                    <Table.HeadCell>Đã thi</Table.HeadCell>
                    <Table.HeadCell>Chưa thi</Table.HeadCell>
                </Table.Head>
                <Table.Body className='divide-y'>
                    <Table.Row>
                        <Table.Cell className={tailwindCss.tableViewerCell}>1</Table.Cell>
                        <Table.Cell className={tailwindCss.tableViewerCell}>Giữa kỳ</Table.Cell>
                        <Table.Cell className={tailwindCss.tableViewerCell}>
                            {numberOfMidTermExam}
                        </Table.Cell>
                        <Table.Cell className={tailwindCss.tableViewerCell}>
                            {numberOfMidTermExamCreated}
                        </Table.Cell>
                        <Table.Cell className={tailwindCss.tableViewerCell}>
                            {numberOfActiveStudents - numberOfMidTermExamCreated}
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell className={tailwindCss.tableViewerCell}>2</Table.Cell>
                        <Table.Cell className={tailwindCss.tableViewerCell}>Cuối kỳ</Table.Cell>
                        <Table.Cell className={tailwindCss.tableViewerCell}>
                            {numberOfFinalTermExam}
                        </Table.Cell>
                        <Table.Cell className={tailwindCss.tableViewerCell}>
                            {numberOfFinalTermExamCreated}
                        </Table.Cell>
                        <Table.Cell className={tailwindCss.tableViewerCell}>
                            {numberOfActiveStudents - numberOfFinalTermExamCreated}
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
            <Table striped={true}>
                <Table.Head>
                    <Table.HeadCell>STT</Table.HeadCell>
                    <Table.HeadCell>Tên ca thi</Table.HeadCell>
                    <Table.HeadCell>Loại kỳ thi</Table.HeadCell>
                    <Table.HeadCell>Trạng thái</Table.HeadCell>
                    <Table.HeadCell>Tình trạng</Table.HeadCell>
                    <Table.HeadCell>Số SV thi</Table.HeadCell>
                    <Table.HeadCell>Ngày thi</Table.HeadCell>
                    <Table.HeadCell>Tiết báo danh</Table.HeadCell>
                </Table.Head>
                <Table.Body className='divide-y'>
                    {splitedExams.map(
                        (
                            {
                                id,
                                name,
                                noticePeriod,
                                status,
                                taken,
                                time,
                                type,
                                tests,
                                numberOfRegisters,
                                examDate,
                            },
                            index
                        ) => (
                            <Table.Row
                                className='bg-white dark:border-gray-700 dark:bg-gray-800'
                                key={id}
                            >
                                <Table.Cell className={tailwindCss.tableViewerCell}>
                                    {index + 1}
                                </Table.Cell>
                                <Table.Cell className={tailwindCss.tableViewerCell}>
                                    {name}
                                </Table.Cell>
                                <Table.Cell className={tailwindCss.tableViewerCell}>
                                    {type}
                                </Table.Cell>
                                <Table.Cell className={tailwindCss.tableViewerCell}>
                                    {!taken ? (
                                        <Badge color='info'>Chưa thi</Badge>
                                    ) : (
                                        <Badge color='success'>Đã thi</Badge>
                                    )}
                                </Table.Cell>
                                <Table.Cell className={tailwindCss.tableViewerCell}>
                                    {!status ? (
                                        <Badge color='warning'>Chưa hủy</Badge>
                                    ) : (
                                        <Badge color='failure'>Đã hủy</Badge>
                                    )}
                                </Table.Cell>
                                <Table.Cell className={tailwindCss.tableViewerCell}>
                                    {numberOfRegisters}
                                </Table.Cell>
                                <Table.Cell className={tailwindCss.tableViewerCell}>
                                    {examDate}
                                </Table.Cell>
                                <Table.Cell className={tailwindCss.tableViewerCell}>
                                    {noticePeriod}
                                </Table.Cell>
                            </Table.Row>
                        )
                    )}
                </Table.Body>
            </Table>
            <TablePagination
                totalElements={exams.length}
                totalPages={Math.ceil(exams.length / 10)}
                fetchDataByPageNumber={fetchDataByPageNumber}
            />
        </div>
    );
}

export default ExamList;
