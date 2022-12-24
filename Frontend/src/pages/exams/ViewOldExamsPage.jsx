import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Frame, Table } from "../../components";
import ViewOldExamsFilter from "../../components/exams/ViewOldExamsFilter";
import ViewOldExamTableBody from "../../components/exams/ViewOldExamTableBody";
import { clearExamState, examState, fetchAllExams } from "../../features/examSlice";
import { persistUserState } from "../../features/persistUserSlice";
import { fetchAllSubjects } from "../../features/subjectSlice";
import { getTestedExam } from "../../features/takeExamSlice";
import { examColumns, studentOldExamColumns } from "../columns";

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
            title={"DANH SÁCH BÀI THI ĐÃ LÀM"}
            children={
                <Table
                    searchPlaceHolder={`Tìm kiếm ${modalLabel} :: mã ca thi, tên ca thi, ngày thi, tiết báo danh`}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={userRoles.includes("Sinh viên") ? studentOldExamColumns : examColumns}
                    modalLabel='bài thi đã làm'
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
