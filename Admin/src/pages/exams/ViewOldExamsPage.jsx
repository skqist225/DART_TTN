import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Frame, Table } from "../../components";
import { clearExamState, examState, fetchAllExams } from "../../features/examSlice";
import ExamFilter from "../../components/exams/ExamFilter";
import { fetchAllSubjects } from "../../features/subjectSlice";
import { persistUserState } from "../../features/persistUserSlice";
import { examColumns, studentExamColumns } from "../columns";
import { getTestedExam } from "../../features/takeExamSlice";
import ViewOldExamTableBody from "../../components/exams/ViewOldExamTableBody";
import ViewOldExamsFilter from "../../components/exams/ViewOldExamsFilter";

function ViewOldExamsPage() {
    const dispatch = useDispatch();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);

    const modalLabel = "ca thi";

    useEffect(() => {
        dispatch(fetchAllSubjects({ page: 0 }));
        dispatch(
            fetchAllExams({
                page: 1,
                student: user.id,
                taken: true,
            })
        );
        dispatch(getTestedExam());
    }, []);

    const { exams, totalElements, totalPages, filterObject, loading } = useSelector(examState);

    const handleQueryChange = ({ target: { value: query } }) => {
        dispatch(
            fetchAllExams({
                ...filterObject,
                query,
            })
        );
    };

    const handleSortChange = (sortField, sortDir) => {
        dispatch(
            fetchAllExams({
                ...filterObject,
                sortField,
                sortDir,
            })
        );
    };

    useEffect(() => {
        return () => {
            dispatch(clearExamState());
        };
    }, []);

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"Các bài thi đã thi"}
            children={
                <Table
                    searchPlaceHolder={`Tìm kiếm ${modalLabel}`}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={userRoles.includes("Sinh viên") ? studentExamColumns : examColumns}
                    modalLabel='ca thi'
                    rows={exams}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={ViewOldExamTableBody}
                    Filter={ViewOldExamsFilter}
                    loading={loading}
                />
            }
        />
    );
}

export default ViewOldExamsPage;
