import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Frame, Table } from "../../components";
import { fetchAllSubjects, subjectState } from "../../features/subjectSlice";

function SubjectsPage() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            fetchAllSubjects({
                page: 1,
            })
        );
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { subjects, totalElements, totalPages } = useSelector(subjectState);

    const columns = [
        {
            name: "Mã môn học",
            sortable: true,
        },
        {
            name: "Tên môn học",
            sortable: true,
        },
    ];

    console.log(subjects);

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"DANH SÁCH MÔN HỌC"}
            children={
                <Table
                    columns={columns}
                    rows={subjects}
                    totalElements={totalElements}
                    totalPages={totalPages}
                />
            }
        />
    );
}

export default SubjectsPage;
