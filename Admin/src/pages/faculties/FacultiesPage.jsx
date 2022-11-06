import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Frame, ClassModalBody, ClassTableBody, Table } from "../../components";
import {
    addClass,
    clearClassState,
    editClass,
    fetchAllClasses,
    classState,
} from "../../features/classSlice";
import $ from "jquery";
import { classSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";

const columns = [
    {
        name: "Mã lớp",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Tên lớp",
        sortField: "name",
        sortable: true,
    },
];

function FacultiesPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(classSchema),
    });

    const onSubmit = data => {
        if (isEdit) {
            dispatch(editClass(data));
        } else {
            dispatch(addClass(data));
        }
    };

    const {
        classes,
        totalElements,
        totalPages,
        filterObject,
        addClass: { successMessage },
        editClass: { successMessage: esSuccessMessage },
        deleteClass: { successMessage: dsSuccessMessage },
    } = useSelector(classState);

    const handleQueryChange = ({ target: { value: query } }) => {
        dispatch(
            fetchAllClasses({
                ...filterObject,
                query,
            })
        );
    };

    const handleSortChange = (sortField, sortDir) => {
        dispatch(
            fetchAllClasses({
                ...filterObject,
                sortField,
                sortDir,
            })
        );
    };

    useEffect(() => {
        return () => {
            dispatch(clearClassState());
        };
    }, []);

    function closeForm(successMessage) {
        callToast("success", successMessage);
        $("#classForm")[0].reset();
        $("#classModal").css("display", "none");
        dispatch(fetchAllClasses(filterObject));
    }

    useEffect(() => {
        if (successMessage) {
            closeForm(successMessage);
        }
    }, [successMessage]);

    useEffect(() => {
        if (esSuccessMessage) {
            closeForm(successMessage);
            setIsEdit(false);
        }
    }, [esSuccessMessage]);

    useEffect(() => {
        if (dsSuccessMessage) {
            callToast("success", dsSuccessMessage);
            dispatch(fetchAllClasses(filterObject));
        }
    }, [dsSuccessMessage]);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            fetchAllClasses({
                page: 1,
            })
        );
    }, []);

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"DANH SÁCH LỚP HỌC"}
            children={
                <Table
                    searchPlaceHolder={"Tìm kiếm theo tên và mã lớp"}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={columns}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={
                        <ClassTableBody
                            rows={classes}
                            setIsEdit={setIsEdit}
                            dispatch={dispatch}
                            modalId='classModal'
                        />
                    }
                    modalId='classModal'
                    formId='classForm'
                    modalLabel='lớp'
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    ModalBody={
                        <>
                            <ClassModalBody
                                errors={errors}
                                register={register}
                                dispatch={dispatch}
                                setValue={setValue}
                            />
                        </>
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                />
            }
        />
    );
}

export default FacultiesPage;
