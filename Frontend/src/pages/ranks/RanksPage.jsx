import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Frame, RankFilter, RankTableBody, Table } from "../../components";
import { creditClassState, fetchAllCreditClasses } from "../../features/creditClassSlice";
import { persistUserState } from "../../features/persistUserSlice";
import {
    fetchAllTakeExams,
    getStudentRankingPosition,
    takeExamState,
} from "../../features/takeExamSlice";
import { rankColumns, studentRankColumns } from "../columns";

function RanksPage() {
    const dispatch = useDispatch();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { takeExams, totalElements, totalPages, filterObject, loading } =
        useSelector(takeExamState);
    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);

    const { creditClasses } = useSelector(creditClassState);

    useEffect(() => {
        if (userRoles.includes("Sinh viên")) {
            // Lấy ra danh sách tất cả lớp tín chỉ chưa hủy của sinh viên đang theo học
            dispatch(
                fetchAllCreditClasses({
                    page: 0,
                    active: true,
                    student: user.id,
                    haveRegister: false,
                })
            );
        } else {
            dispatch(fetchAllCreditClasses({ page: 0, active: true, haveRegister: false }));
        }
    }, []);

    useEffect(() => {
        if (creditClasses && creditClasses.length) {
            dispatch(
                fetchAllTakeExams({
                    page: 1,
                    creditClass: creditClasses[0].id,
                    examType: "Giữa kỳ",
                })
            );
            dispatch(
                getStudentRankingPosition({ creditClass: creditClasses[0].id, examType: "Giữa kỳ" })
            );
        }
    }, [creditClasses]);

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
        dispatch(fetchAllTakeExams({ ...filterObject, page: pageNumber }));
    };

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={`BẢNG XẾP HẠNG`}
            children={
                <Table
                    searchPlaceHolder='Tìm theo tên và mã sinh viên'
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={userRoles.includes("Sinh viên") ? studentRankColumns : rankColumns}
                    rows={takeExams}
                    recordsPerPage={15}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={RankTableBody}
                    fetchDataByPageNumber={fetchDataByPageNumber}
                    Filter={RankFilter}
                    loading={loading}
                    modalLabel='Bảng xếp hạng'
                    ranksPage={true}
                />
            }
        />
    );
}

export default RanksPage;
