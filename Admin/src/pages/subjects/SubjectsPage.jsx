import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Frame, SubjectModalBody, SubjectTableBody, Table } from "../../components";
import {
    addSubject,
    clearSubjectState,
    editSubject,
    fetchAllSubjects,
    subjectState,
} from "../../features/subjectSlice";
import $ from "jquery";
import { subjectSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";

function SubjectsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(subjectSchema),
    });

    const onSubmit = data => {
        if (isEdit) {
            dispatch(editSubject(data));
        } else {
            dispatch(addSubject(data));
        }
    };

    const {
        subjects,
        totalElements,
        totalPages,
        filterObject,
        addSubject: { successMessage },
        editSubject: { successMessage: esSuccessMessage },
        deleteSubject: { successMessage: dsSuccessMessage },
    } = useSelector(subjectState);

    const columns = [
        {
            name: "Mã môn học",
            sortField: "id",
            sortable: true,
        },
        {
            name: "Tên môn học",
            sortField: "name",
            sortable: true,
        },
    ];

    const handleQueryChange = ({ target: { value: query } }) => {
        dispatch(
            fetchAllSubjects({
                ...filterObject,
                query,
            })
        );
    };

    const handleSortChange = (sortField, sortDir) => {
        dispatch(
            fetchAllSubjects({
                ...filterObject,
                sortField,
                sortDir,
            })
        );
    };

    useEffect(() => {
        return () => {
            dispatch(clearSubjectState());
        };
    }, []);

    useEffect(() => {
        if (successMessage) {
            callToast("success", successMessage);
            $("#subjectForm")[0].reset();
            $("#subjectModal").css("display", "none");
            dispatch(fetchAllSubjects(filterObject));
        }
    }, [successMessage]);

    useEffect(() => {
        if (esSuccessMessage) {
            callToast("success", esSuccessMessage);
            dispatch(fetchAllSubjects(filterObject));
            $("#subjectModal").css("display", "none");
            setIsEdit(false);
        }
    }, [esSuccessMessage]);

    useEffect(() => {
        if (dsSuccessMessage) {
            callToast("success", dsSuccessMessage);
            dispatch(fetchAllSubjects(filterObject));
        }
    }, [dsSuccessMessage]);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            fetchAllSubjects({
                page: 1,
            })
        );
    }, []);

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"DANH SÁCH MÔN HỌC"}
            children={
                <Table
                    searchPlaceHolder={"Tìm kiếm theo tên và mã môn học"}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={columns}
                    rows={subjects}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={
                        <SubjectTableBody
                            rows={subjects}
                            setIsEdit={setIsEdit}
                            dispatch={dispatch}
                        />
                    }
                    modalId='subjectModal'
                    formId='subjectForm'
                    modalLabel='môn học'
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    ModalBody={
                        <SubjectModalBody
                            errors={errors}
                            register={register}
                            dispatch={dispatch}
                            setValue={setValue}
                        />
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                />
            }
        />
    );
}

export default SubjectsPage;
