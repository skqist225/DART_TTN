import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
    clearErrorField,
    questionState,
    readExcelFile,
    setEditedQuestion,
} from "../../features/questionSlice";
import $ from "jquery";
import TableHeader from "../utils/tables/TableHeader";
import { useDispatch } from "react-redux";
import QuestionTableBody from "./QuestionTableBody";
import TablePagination from "../utils/tables/TablePagination";

const columns = [
    {
        name: "STT",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Nội dung",
        sortField: "content",
        sortable: true,
    },
    {
        name: "A",
        sortField: "answerA",
        sortable: true,
    },
    {
        name: "B",
        sortField: "answerB",
        sortable: true,
    },
    {
        name: "C",
        sortField: "answerC",
        sortable: true,
    },
    {
        name: "D",
        sortField: "answerD",
        sortable: true,
    },
    {
        name: "Đáp án",
        sortField: "finalAnswer",
        sortable: true,
    },
    {
        name: "Mức độ",
        sortField: "level",
        sortable: true,
    },
    {
        name: "Môn học",
        sortField: "subjectName",
        sortable: true,
    },
];

function QuestionExcelModalBody() {
    const [page, setPage] = useState(0);

    const dispatch = useDispatch();
    const { questionsExcel, totalExcelElements, totalExcelPages } = useSelector(questionState);

    const handleExcelChange = e => {
        dispatch(readExcelFile(e.target.files[0]));
    };

    return (
        <div id='questionExcelModal'>
            <div>
                <label
                    class='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                    for='file_input'
                >
                    Chọn file Excel
                </label>
                <input
                    class='block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
                    id='file_input'
                    type='file'
                    onChange={handleExcelChange}
                />
            </div>
            {questionsExcel && questionsExcel.length > 0 && (
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
            )}
        </div>
    );
}

export default QuestionExcelModalBody;
