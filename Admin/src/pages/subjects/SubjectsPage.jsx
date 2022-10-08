import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Frame, Input, Table } from "../../components";
import {
    addSubject,
    clearErrorField,
    clearSubjectState,
    deleteSubject,
    editSubject,
    fetchAllSubjects,
    setEditedsubject,
    subjectState,
} from "../../features/subjectSlice";
import { tailwindCss } from "../../tailwind";
import MyButton from "../../components/common/MyButton";
import $ from "jquery";
import { subjectSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";

const FormBody = ({ errors, register, dispatch, setValue }) => {
    const { editedSubject, errorObject } = useSelector(subjectState);

    const onKeyDown = ({ target: { name } }) => {
        if (errorObject) {
            dispatch(clearErrorField(name));
        }
        if (editSubject) {
            dispatch(setEditedsubject(null));
        }
    };

    if (editedSubject) {
        setValue("id", editedSubject.id);
        setValue("name", editedSubject.name);
    }

    return (
        <div className='mt-5'>
            <div className='col-flex items-center justify-center w-full'>
                <div className='w-full'>
                    <Input
                        label='Mã môn học *'
                        error={(errors.id && errors.id.message) || (errorObject && errorObject.id)}
                        register={register}
                        name='id'
                        onKeyDown={onKeyDown}
                        readOnly={editedSubject}
                    />
                </div>
                <div className='w-full my-5'>
                    <Input
                        label='Tên môn học *'
                        error={
                            (errors.name && errors.name.message) ||
                            (errorObject && errorObject.name)
                        }
                        register={register}
                        name='name'
                        onKeyDown={onKeyDown}
                    />
                </div>
            </div>
        </div>
    );
};

const SubjectTableBody = ({ rows, setIsEdit, dispatch }) => {
    return (
        <tbody>
            {rows.map(row => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className='p-4 w-4'>
                        <div className='flex items-center'>
                            <input
                                id='checkbox-table-search-1'
                                type='checkbox'
                                className={tailwindCss.checkbox}
                            />
                            <label for='checkbox-table-search-1' className='sr-only'>
                                checkbox
                            </label>
                        </div>
                    </td>
                    <td className='py-4 px-6  whitespace-nowrap dark:text-white'>{row.id}</td>
                    <td className='py-4 px-6'>{row.name}</td>
                    <td class='py-4 px-6 flex items-center'>
                        <MyButton
                            type='edit'
                            onClick={() => {
                                $("#subjectModal").css("display", "flex");
                                setIsEdit(true);
                                dispatch(setEditedsubject(row));
                            }}
                        />
                        <div className='mx-3'>
                            <MyButton
                                type='delete'
                                onClick={() => {
                                    dispatch(deleteSubject(row.id));
                                }}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

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
            sortable: true,
        },
        {
            name: "Tên môn học",
            sortable: true,
        },
    ];

    const handleQueryChange = e => {
        dispatch(
            fetchAllSubjects({
                ...filterObject,
                query: e.target.value,
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
                    columns={columns}
                    rows={subjects}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    handleQueryChange={handleQueryChange}
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
                        <FormBody
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
