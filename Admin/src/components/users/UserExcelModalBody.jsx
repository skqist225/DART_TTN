import React, { useState } from "react";
import { useSelector } from "react-redux";
import { questionState, readExcelFile } from "../../features/questionSlice";
import TableHeader from "../utils/tables/TableHeader";
import { useDispatch } from "react-redux";
import TablePagination from "../utils/tables/TablePagination";

// const columns = [
//     {
//         name: "STT",
//         sortField: "id",
//         sortable: true,
//     },
//     {
//         name: "Nội dung",
//         sortField: "content",
//         sortable: true,
//     },
//     {
//         name: "Loại câu hỏi",
//         sortField: "type",
//         sortable: true,
//     },
//     {
//         name: "Độ khó",
//         sortField: "level",
//         sortable: true,
//     },
//     {
//         name: "Chương",
//         sortField: "chapterName",
//         sortable: true,
//     },
//     {
//         name: "Môn học",
//         sortField: "subjectName",
//         sortable: true,
//     },
// ];

function UserExcelModalBody({ setExcelFile }) {
    const [page, setPage] = useState(1);

    const dispatch = useDispatch();
    // const { questionsExcel, totalExcelElements, totalExcelPages } = useSelector(questionState);

    // const handleExcelChange = e => {
    //     dispatch(readExcelFile(e.target.files[0]));
    // };

    return (
        <div id='questionExcelModal'>
            <div>
                <label
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                    htmlFor='file_input'
                >
                    Chọn file Excel
                </label>
                <input
                    className='block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
                    id='file_input'
                    type='file'
                    onChange={event => {
                        if (setExcelFile) {
                            setExcelFile(event.target.files[0]);
                        }
                    }}
                />
            </div>
            {/* {questionsExcel && questionsExcel.length > 0 && (
                <>
                    <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                        <TableHeader columns={columns} />
                        <QuestionTableBody rows={questionsExcel} page={page} />
                    </table>
                    <TablePagination
                        totalElements={totalExcelElements}
                        totalPages={totalExcelPages}
                        setPage={setPage}
                    />
                </>
            )} */}
        </div>
    );
}

export default UserExcelModalBody;