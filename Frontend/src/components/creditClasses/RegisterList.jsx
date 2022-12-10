import React, { useEffect, useState } from "react";
import { Badge, Table } from "flowbite-react";
import { tailwindCss } from "../../tailwind";
import TablePagination from "../utils/tables/TablePagination";

function RegisterList({ registers }) {
    const [pageNumber, setPageNumber] = useState(1);
    const [splitedRegisters, setSplitedRegisters] = useState([]);

    const recordsPerPage = 12;

    useEffect(() => {
        if (registers && registers.length) {
            setSplitedRegisters(registers.slice(0, recordsPerPage));
        }
    }, [registers]);

    const fetchDataByPageNumber = pageNumber => {
        // each page will have recordsPerPage records
        // 2: 13 -24
        setSplitedRegisters(
            registers.slice(
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
                    <Table.HeadCell>Trạng thái</Table.HeadCell>
                    <Table.HeadCell>Điểm CC</Table.HeadCell>
                    <Table.HeadCell>Điểm GK</Table.HeadCell>
                    <Table.HeadCell>Điểm GK</Table.HeadCell>
                </Table.Head>
                <Table.Body className='divide-y'>
                    {splitedRegisters.map(
                        (
                            {
                                id,
                                student: { id: studentId, fullName },
                                status,
                                attendanceScore,
                                midTermScore,
                                finalTermScore,
                            },
                            index
                        ) => (
                            <Table.Row
                                className='bg-white dark:border-gray-700 dark:bg-gray-800'
                                key={id}
                            >
                                <Table.Cell className={tailwindCss.tableViewerCell}>
                                    {(pageNumber - 1) * recordsPerPage + index + 1}
                                </Table.Cell>
                                <Table.Cell className={tailwindCss.tableViewerCell}>
                                    {studentId}
                                </Table.Cell>
                                <Table.Cell className={tailwindCss.tableViewerCell}>
                                    {fullName}
                                </Table.Cell>
                                <Table.Cell className={tailwindCss.tableViewerCell}>
                                    {!status ? (
                                        <Badge color='success'>Đang học</Badge>
                                    ) : (
                                        <Badge color='failure'>Đã hủy</Badge>
                                    )}
                                </Table.Cell>
                                <Table.Cell className={tailwindCss.tableViewerCell}>
                                    {attendanceScore}
                                </Table.Cell>
                                <Table.Cell className={tailwindCss.tableViewerCell}>
                                    {midTermScore}
                                </Table.Cell>
                                <Table.Cell className={tailwindCss.tableViewerCell}>
                                    {finalTermScore}
                                </Table.Cell>
                            </Table.Row>
                        )
                    )}
                </Table.Body>
            </Table>
            <TablePagination
                totalElements={registers.length}
                totalPages={Math.ceil(registers.length / recordsPerPage)}
                fetchDataByPageNumber={fetchDataByPageNumber}
                recordsPerPage={recordsPerPage}
            />
        </>
    );
}

export default RegisterList;
