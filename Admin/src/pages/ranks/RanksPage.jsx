import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Frame, RankFilter, RankTableBody, Table } from "../../components";
import { fetchAllCreditClasses } from "../../features/creditClassSlice";
import { fetchAllExams } from "../../features/examSlice";
import { persistUserState } from "../../features/persistUserSlice";
import { fetchAllQuestions } from "../../features/questionSlice";
import { fetchAllSubjects } from "../../features/subjectSlice";
import { fetchAllTakeExams, takeExamState } from "../../features/takeExamSlice";
import { rankColumns, studentRankColumns } from "../columns";

function RanksPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();

    const { user, userRoles } = useSelector(persistUserState);

    useEffect(() => {
        if (userRoles.includes("Sinh viên")) {
            dispatch(
                fetchAllTakeExams({
                    page: 1,
                    student: user.id,
                })
            );
        } else {
            dispatch(
                fetchAllTakeExams({
                    page: 1,
                })
            );
        }
        dispatch(fetchAllSubjects({ page: 0, haveChapter: true }));
        dispatch(fetchAllExams({ page: 0 }));
        dispatch(fetchAllCreditClasses({ page: 0, active: true, student: user.id }));
    }, []);
    const { takeExams, totalElements, totalPages, filterObject, loading } =
        useSelector(takeExamState);

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
            title={`BẢNG XẾP HẠNG`}
            children={
                <Table
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={studentRankColumns}
                    rows={takeExams}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={RankTableBody}
                    fetchDataByPageNumber={fetchDataByPageNumber}
                    Filter={RankFilter}
                    loading={loading}
                    modalLabel='Bảng xếp hạng'
                />
            }
        />
    );
}

export default RanksPage;
