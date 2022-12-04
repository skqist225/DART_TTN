import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { persistUserState } from "../../features/persistUserSlice";
import { tailwindCss } from "../../tailwind";
import TablePagination from "../utils/tables/TablePagination";

function RegisterList({ takeExams }) {
    const [pageNumber, setPageNumber] = useState(1);
    const [splitedRegisters, setSplitedRegisters] = useState([]);

    const { userRoles } = useSelector(persistUserState);

    const recordsPerPage = 12;

    useEffect(() => {
        if (takeExams && takeExams.length) {
            setSplitedRegisters(takeExams.slice(0, recordsPerPage));
        }
    }, [takeExams]);

    const fetchDataByPageNumber = pageNumber => {
        // each page will have recordsPerPage records
        // 2: 13 -24
        setSplitedRegisters(
            takeExams.slice(
                (pageNumber - 1) * recordsPerPage,
                (pageNumber - 1) * recordsPerPage + recordsPerPage
            )
        );
        setPageNumber(pageNumber);
    };

    return (
        <>
            <Table striped={true}>
                <Table.Head>
                    <Table.HeadCell>STT</Table.HeadCell>
                    <Table.HeadCell>MSSV</Table.HeadCell>
                    <Table.HeadCell>Họ tên</Table.HeadCell>
                    {!userRoles.includes("Sinh viên") && (
                        <>
                            <Table.HeadCell>Bộ đề</Table.HeadCell>
                            <Table.HeadCell>Điểm số</Table.HeadCell>
                        </>
                    )}
                </Table.Head>
                <Table.Body className='divide-y'>
                    {splitedRegisters.map(
                        (
                            {
                                register: {
                                    student: { fullName, id },
                                },
                                score,
                                testName,
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
                                    {id}
                                </Table.Cell>
                                <Table.Cell className={tailwindCss.tableViewerCell}>
                                    {fullName}
                                </Table.Cell>
                                {!userRoles.includes("Sinh viên") && (
                                    <>
                                        {" "}
                                        <Table.Cell className={tailwindCss.tableViewerCell}>
                                            {testName}
                                        </Table.Cell>
                                        <Table.Cell className={tailwindCss.tableViewerCell}>
                                            {score}
                                        </Table.Cell>
                                    </>
                                )}
                            </Table.Row>
                        )
                    )}
                </Table.Body>
            </Table>
            <TablePagination
                totalElements={takeExams.length}
                totalPages={Math.ceil(takeExams.length / recordsPerPage)}
                fetchDataByPageNumber={fetchDataByPageNumber}
                recordsPerPage={recordsPerPage}
            />
        </>
    );
}

export default RegisterList;
