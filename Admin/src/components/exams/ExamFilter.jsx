import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { creditClassState } from "../../features/creditClassSlice";
import { examState, fetchAllExams } from "../../features/examSlice";
import { persistUserState } from "../../features/persistUserSlice";
import { schoolYears, semesters } from "../creditClasses/CreditClassModalBody";
import Select from "../utils/userInputs/Select";
import { examTypes } from "./ExamModalBody";

function ExamFilter() {
    const dispatch = useDispatch();
    const { creditClasses } = useSelector(creditClassState);
    const { filterObject } = useSelector(examState);
    const { register, handleSubmit } = useForm();

    const { user, userRoles } = useSelector(persistUserState);

    const handleCreditClassChange = event => {
        dispatch(fetchAllExams({ ...filterObject, creditClass: event.target.value }));
    };

    const handleSchoolYearChange = ({ target: { value } }) => {
        dispatch(fetchAllExams({ ...filterObject, student: user.id, schoolYear: value }));
    };

    const handleSemesterChange = ({ target: { value } }) => {
        dispatch(fetchAllExams({ ...filterObject, student: user.id, type: value }));
    };

    const handleExamTypesChange = ({ target: { value } }) => {
        dispatch(fetchAllExams({ ...filterObject, student: user.id, type: value }));
    };

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(onSubmit)(e);
            }}
            className='flex items-center'
        >
            <div className='mr-2 w-full flex items-center justify-start'>
                {!userRoles.includes("Sinh viên") ? (
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
                        width={"w-52"}
                    />
                ) : (
                    <>
                        <div>
                            <Select
                                label='niên khóa'
                                name='schoolYearsFilter'
                                register={register}
                                options={schoolYears}
                                onChangeHandler={handleSchoolYearChange}
                                hiddenOption
                                width={"w-52"}
                            />
                        </div>
                        <div className='mx-3'>
                            <Select
                                label='học kỳ'
                                name='semestersFilter'
                                register={register}
                                options={semesters}
                                onChangeHandler={handleSemesterChange}
                                hiddenOption
                                width={"w-52"}
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
                )}
            </div>
            <div>
                <button
                    type='button'
                    className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-40'
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

                        dispatch(setResetFilter(true));
                    }}
                >
                    Xóa bộ lọc
                </button>
            </div>
        </form>
    );
}

export default ExamFilter;
