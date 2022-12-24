import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { QuestionTableBody } from "../..";
import { questionState } from "../../../features/questionSlice";
import { questionColumnsTestPage } from "../../../pages/columns";
import TableHeader from "./TableHeader";
import TableModalViewer from "./TableModalViewer";
import TablePagination from "./TablePagination";

function QuestionsViewer() {
    const dispatch = useDispatch();

    const [pageNumber, setPageNumber] = useState(1);
    const [splitedQuestions, setSplitedQuestions] = useState([]);
    const recordsPerPage = 12;

    const { questions } = useSelector(questionState);

    useEffect(() => {
        if (questions && questions.length) {
            setSplitedQuestions(questions.slice(0, recordsPerPage));
        }
    }, [questions]);

    const fetchDataByPageNumber = pageNumber => {
        setSplitedQuestions(
            questions.slice(
                (pageNumber - 1) * recordsPerPage,
                (pageNumber - 1) * recordsPerPage + recordsPerPage
            )
        );
        setPageNumber(pageNumber);
    };

    return (
        <div className='w-full'>
            <TableModalViewer
                modalId={`questionsListModalViewer`}
                modalLabel={`Danh sách câu hỏi (${questions.length})`}
                removeMt
                ModalBody={
                    <div className='w-full'>
                        <div className='w-full'>
                            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                                <TableHeader columns={questionColumnsTestPage} />
                                <QuestionTableBody
                                    rows={splitedQuestions}
                                    pageNumber={pageNumber}
                                    addTest
                                    dispatch={dispatch}
                                    recordsPerPage={recordsPerPage}
                                />
                            </table>
                        </div>
                        <TablePagination
                            totalElements={questions.length}
                            setPage={setPageNumber}
                            recordsPerPage={recordsPerPage}
                            totalPages={Math.ceil(questions.length / recordsPerPage)}
                            fetchDataByPageNumber={fetchDataByPageNumber}
                        />
                    </div>
                }
            />
        </div>
    );
}

export default QuestionsViewer;
