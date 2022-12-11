import { Tab, Tabs } from "@mui/material";
import { Accordion, Badge, Card, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { viewCreditClassExamColumns } from "../../pages/columns";
import { tailwindCss } from "../../tailwind";
import { a11yProps, TabPanel } from "../exams/ExamModalBody";
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
    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <div>
            <Table striped={true}>
                <Table.Head>
                    <Table.HeadCell>STT</Table.HeadCell>
                    <Table.HeadCell>Loại</Table.HeadCell>
                    <Table.HeadCell>Số ca</Table.HeadCell>
                    <Table.HeadCell>Đã tạo</Table.HeadCell>
                    <Table.HeadCell>Chưa tạo</Table.HeadCell>
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

            <div>
                <Tabs value={tabValue} onChange={handleChange} centered>
                    <Tab
                        label={`Giữa kỳ (${
                            splitedExams.filter(({ type }) => type !== "Cuối kỳ").length
                        })`}
                        {...a11yProps(0)}
                    />
                    <Tab
                        label={`Cuối kỳ (${
                            splitedExams.filter(({ type }) => type !== "Giữa kỳ").length
                        })`}
                        {...a11yProps(1)}
                    />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    <Table striped={true}>
                        <Table.Head>
                            {viewCreditClassExamColumns.map(({ name }) => (
                                <Table.HeadCell>{name}</Table.HeadCell>
                            ))}
                        </Table.Head>
                        <Table.Body className='divide-y'>
                            {splitedExams
                                .filter(({ type }) => type !== "Cuối kỳ")
                                .map(
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
                                                {name.split("-")[5]}-{name.split("-")[6]}
                                            </Table.Cell>
                                            <Table.Cell className={tailwindCss.tableViewerCell}>
                                                {!status ? (
                                                    !taken ? (
                                                        <Badge color='info'>Chưa thi</Badge>
                                                    ) : (
                                                        <Badge color='success'>Đã thi</Badge>
                                                    )
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
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Table striped={true}>
                        <Table.Head>
                            {viewCreditClassExamColumns.map(({ name }) => (
                                <Table.HeadCell>{name}</Table.HeadCell>
                            ))}
                        </Table.Head>
                        <Table.Body className='divide-y'>
                            {splitedExams
                                .filter(({ type }) => type !== "Giữa kỳ")
                                .map(
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
                                                {!status ? (
                                                    !taken ? (
                                                        <Badge color='info'>Chưa thi</Badge>
                                                    ) : (
                                                        <Badge color='success'>Đã thi</Badge>
                                                    )
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
                </TabPanel>
            </div>
        </div>
    );
}

export default ExamList;
