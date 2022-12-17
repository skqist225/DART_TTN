import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { creditClassState } from "../../features/creditClassSlice";
import { examState, fetchAllExams } from "../../features/examSlice";
import { persistUserState } from "../../features/persistUserSlice";
import Select from "../utils/userInputs/Select";
import { examTypes } from "./ExamModalBody";
import $ from "jquery";
import { tailwindCss } from "../../tailwind";

function ExamFilter({ setValue }) {
    const dispatch = useDispatch();
    const { creditClasses } = useSelector(creditClassState);
    const { filterObject } = useSelector(examState);
    const { register, handleSubmit } = useForm();

    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);

    const handleCreditClassChange = event => {
        dispatch(fetchAllExams({ ...filterObject, creditClass: event.target.value }));
    };

    const handleExamTypesChange = ({ target: { value } }) => {
        if (userRoles.includes("Sinh viên")) {
            dispatch(
                fetchAllExams({ ...filterObject, student: user.id, examType: value, taken: false })
            );
        } else {
            dispatch(fetchAllExams({ ...filterObject, examType: value }));
        }
    };

    useEffect(() => {
        $("#creditClassFilter").val("");
        $("#examTypesFilter").val("");
    }, []);

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(onSubmit)(e);
            }}
        >
            <div className='flex items-center'>
                <div className='mr-2 w-full flex items-center'>
                    {!userRoles.includes("Sinh viên") ? (
                        <>
                            <div className='mr-5'>
                                <Select
                                    label='lớp tín chỉ'
                                    name='creditClassFilter'
                                    register={register}
                                    options={creditClasses.map(
                                        ({ id, schoolYear, semester, subjectName, group }) => ({
                                            title: `${schoolYear} ${semester} ${subjectName} ${group}`,
                                            value: id,
                                        })
                                    )}
                                    onChangeHandler={handleCreditClassChange}
                                    hiddenOption
                                    width={"w-80"}
                                />
                            </div>
                            <div>
                                <Select
                                    label='loại kỳ thi'
                                    name='examTypesFilter'
                                    register={register}
                                    options={examTypes}
                                    onChangeHandler={handleExamTypesChange}
                                    hiddenOption
                                    width={"w-52"}
                                />
                            </div>
                        </>
                    ) : (
                        <div>
                            <Select
                                label='loại kỳ thi'
                                name='examTypesFilter'
                                register={register}
                                options={examTypes}
                                onChangeHandler={handleExamTypesChange}
                                hiddenOption
                                width={"w-52"}
                            />
                        </div>
                    )}
                </div>
                <div>
                    <button
                        type='button'
                        className={tailwindCss.clearFilterButton}
                        onClick={() => {
                            if (userRoles.includes("Sinh viên")) {
                                dispatch(
                                    fetchAllExams({
                                        page: 1,
                                        query: "",
                                        sortField: "id",
                                        sortDir: "desc",
                                        subject: "",
                                        student: user.id,
                                        schoolYears: "",
                                        semester: "",
                                        type: "",
                                    })
                                );
                            } else {
                                dispatch(
                                    fetchAllExams({
                                        page: 1,
                                        query: "",
                                        sortField: "id",
                                        sortDir: "desc",
                                        subject: "",
                                        teacher: "",
                                        student: "",
                                        type: "",
                                    })
                                );
                            }

                            $("#creditClassFilter").val("");
                            $("#examTypesFilter").val("");
                        }}
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            </div>
        </form>
    );
}

export default ExamFilter;
