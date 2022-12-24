import $ from "jquery";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerState } from "../../../features/registerSlice";
import RegisterTableBody from "../../registers/RegisterTableBody";
import TableHeader from "./TableHeader";
import TableModalViewer from "./TableModalViewer";
import TablePagination from "./TablePagination";

const columns = [
    {
        name: "STT",
    },
    {
        name: "Mã SV",
    },
    {
        name: "Họ tên",
    },
];

function RegistersViewer() {
    const dispatch = useDispatch();

    const [pageNumber, setPageNumber] = useState(1);
    const [splitedRegisters, setSplitedRegisters] = useState([]);

    const { registers } = useSelector(registerState);

    const recordsPerPage = 12;

    useEffect(() => {
        if (registers && registers.length) {
            setSplitedRegisters(registers.slice(0, recordsPerPage));
        }
    }, [registers]);

    const fetchDataByPageNumber = pageNumber => {
        setSplitedRegisters(
            registers.slice(
                (pageNumber - 1) * recordsPerPage,
                (pageNumber - 1) * recordsPerPage + recordsPerPage
            )
        );
        setPageNumber(pageNumber);
    };

    return (
        <div className='w-full'>
            <TableModalViewer
                modalId={`registerModalViewerExamPage`}
                modalLabel={`Danh sách đăng ký (${registers.length})`}
                ModalBody={
                    <>
                        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                            <TableHeader columns={columns} />
                            <RegisterTableBody
                                rows={splitedRegisters}
                                type={$("#examType").val()}
                                addExam
                                page={pageNumber}
                            />
                        </table>
                        <TablePagination
                            totalElements={registers.length}
                            totalPages={Math.ceil(registers.length / recordsPerPage)}
                            fetchDataByPageNumber={fetchDataByPageNumber}
                            recordsPerPage={recordsPerPage}
                        />
                    </>
                }
            />
        </div>
    );
}

export default RegistersViewer;
