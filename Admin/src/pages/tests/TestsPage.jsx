import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Frame, TestModalBody, TestTableBody, Table } from "../../components";
import {
    addTest,
    clearTestState,
    editTest,
    fetchAllTests,
    testState,
} from "../../features/testSlice";
import $ from "jquery";
import { testSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchAllSubjects, subjectState } from "../../features/subjectSlice";
import { fetchAllQuestions } from "../../features/questionSlice";

const columns = [
    {
        name: "Mã bộ đề",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Tên bộ đề",
        sortField: "name",
        sortable: true,
    },
];

function TestsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(testSchema),
        defaultValues: {
            criteria: [],
        },
    });

    const onSubmit = data => {
        console.log(data);
        if (isEdit) {
            dispatch(editTest(data));
        } else {
            dispatch(
                fetchAllQuestions({
                    page: 0,
                    subject: data.testSubjectId,
                    criteria: data.criteria,
                })
            );
        }
    };

    const {
        tests,
        totalElements,
        totalPages,
        filterObject,
        addTest: { successMessage },
        editTest: { successMessage: esSuccessMessage },
        deleteTest: { successMessage: dsSuccessMessage },
    } = useSelector(testState);

    const handleQueryChange = ({ target: { value: query } }) => {
        dispatch(
            fetchAllTests({
                ...filterObject,
                query,
            })
        );
    };

    const handleSortChange = (sortField, sortDir) => {
        dispatch(
            fetchAllTests({
                ...filterObject,
                sortField,
                sortDir,
            })
        );
    };

    useEffect(() => {
        return () => {
            dispatch(clearTestState());
        };
    }, []);

    useEffect(() => {
        if (successMessage) {
            callToast("success", successMessage);
            $("#testForm")[0].reset();
            $("#testModal").css("display", "none");
            dispatch(fetchAllTests(filterObject));
        }
    }, [successMessage]);

    useEffect(() => {
        if (esSuccessMessage) {
            callToast("success", esSuccessMessage);
            dispatch(fetchAllTests(filterObject));
            $("#testModal").css("display", "none");
            setIsEdit(false);
        }
    }, [esSuccessMessage]);

    useEffect(() => {
        if (dsSuccessMessage) {
            callToast("success", dsSuccessMessage);
            dispatch(fetchAllTests(filterObject));
        }
    }, [dsSuccessMessage]);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            fetchAllTests({
                page: 1,
            })
        );
        dispatch(fetchAllSubjects({ page: 0 }));
    }, []);

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"DANH SÁCH BỘ ĐỀ"}
            children={
                <Table
                    searchPlaceHolder={"Tìm kiếm theo tên và mã bộ đề"}
                    handleQueryChange={handleQueryChange}
                    handleSortChange={handleSortChange}
                    columns={columns}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    TableBody={
                        <TestTableBody rows={tests} setIsEdit={setIsEdit} dispatch={dispatch} />
                    }
                    modalId='testModal'
                    formId='testForm'
                    modalLabel='bộ đề'
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    ModalBody={
                        <TestModalBody
                            errors={errors}
                            register={register}
                            dispatch={dispatch}
                            setValue={setValue}
                            control={control}
                        />
                    }
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    addTest={addTest}
                />
            }
        />
    );
}

export default TestsPage;