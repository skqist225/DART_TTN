import React, { useEffect, useState } from "react";
import { adminQuestionColumnsTestPage, questionColumnsTestPage } from "../../pages/columns";
import TableHeader from "../utils/tables/TableHeader";
import TablePagination from "../utils/tables/TablePagination";
import QuestionTableBody from "../questions/QuestionTableBody";
import { useSelector } from "react-redux";
import { persistUserState } from "../../features/persistUserSlice";

function QuestionList({ questions, chapterListPage = false }) {
    const [pageNumber, setPageNumber] = useState(1);

    const [splitedQuestions, setSplitedQuestions] = useState([]);

    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);

    const recordsPerPage = 12;

    useEffect(() => {
        if (questions && questions.length) {
            setSplitedQuestions(questions.slice(0, recordsPerPage));
        }
    }, [questions]);

    const fetchDataByPageNumber = pageNumber => {
        // each page will have recordsPerPage records
        // 2: 13 -24
        setSplitedQuestions(
            questions.slice(
                (pageNumber - 1) * recordsPerPage,
                (pageNumber - 1) * recordsPerPage + recordsPerPage
            )
        );
        setPageNumber(pageNumber);
    };

    return (
        <>
            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <TableHeader
                    columns={
                        userRoles.includes("Quản trị viên")
                            ? adminQuestionColumnsTestPage
                            : questionColumnsTestPage
                    }
                    chapterListPage={chapterListPage}
                />
                <QuestionTableBody
                    rows={splitedQuestions}
                    addTest
                    chapterListPage={chapterListPage}
                    pageNumber={pageNumber}
                />
            </table>
            <TablePagination
                totalElements={questions.length}
                totalPages={Math.ceil(questions.length / recordsPerPage)}
                fetchDataByPageNumber={fetchDataByPageNumber}
                recordsPerPage={recordsPerPage}
            />
        </>
    );
}

export default QuestionList;
