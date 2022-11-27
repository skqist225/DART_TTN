import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Frame, RankFilter, RankTableBody, Table } from "../../components";
import { fetchAllCreditClasses } from "../../features/creditClassSlice";
import { fetchAllExams } from "../../features/examSlice";
import { fetchAllQuestions } from "../../features/questionSlice";
import { fetchAllSubjects } from "../../features/subjectSlice";
import { fetchAllTakeExams, takeExamState } from "../../features/takeExamSlice";

const columns = [
    {
        name: "STT",
        sortField: "index",
        sortable: true,
    },
    {
        name: "MSSV",
        sortField: "studentId",
        sortable: true,
    },
    {
        name: "Họ và tên",
        sortField: "studentName",
        sortable: true,
    },
    {
        name: "Điểm",
        sortField: "score",
        sortable: true,
    },
    {
        name: "Tên ca thi",
        sortField: "examName",
        sortable: true,
    },
];

function RanksPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            fetchAllTakeExams({
                page: 1,
            })
        );
        dispatch(fetchAllSubjects({ page: 0, haveChapter: true }));
        dispatch(fetchAllExams({ page: 0 }));
        dispatch(fetchAllCreditClasses({ page: 0, active: true }));
    }, []);
    const { takeExams, totalElements, totalPages, filterObject } = useSelector(takeExamState);

    const handleQueryChange = ({ target: { value: query } }) => {
        dispatch(
            fetchAllTakeExams({
                ...filterObject,
                query,
            })
        );
    };

    const handleSortChange = (sortField, sortDir) => {
        dispatch(
            fetchAllTakeExams({
                ...filterObject,
                sortField,
                sortDir,
            })
        );
    };
    const fetchDataByPageNumber = pageNumber => {
        dispatch(fetchAllQuestions({ ...filterObject, page: pageNumber }));
    };

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"BẢNG XẾP HẠNG"}
            children={
                <>
                    <Table
                        handleQueryChange={handleQueryChange}
                        handleSortChange={handleSortChange}
                        columns={columns}
                        rows={takeExams}
                        totalElements={totalElements}
                        totalPages={totalPages}
                        TableBody={RankTableBody}
                        fetchDataByPageNumber={fetchDataByPageNumber}
                        Filter={RankFilter}
                    />
                </>
            }
        />
    );
}

export default RanksPage;
