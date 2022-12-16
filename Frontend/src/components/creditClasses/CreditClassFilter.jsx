import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { creditClassState, fetchAllCreditClasses } from "../../features/creditClassSlice";
import { persistUserState } from "../../features/persistUserSlice";
import { subjectState } from "../../features/subjectSlice";
import { userState } from "../../features/userSlice";
import Select from "../utils/userInputs/Select";
import $ from "jquery";

function CreditClassFilter() {
    const dispatch = useDispatch();
    const { filterObject } = useSelector(creditClassState);
    const { subjects } = useSelector(subjectState);
    const { register, handleSubmit } = useForm();

    const { user } = useSelector(persistUserState);
    const { users } = useSelector(userState);

    const handleSubjectChange = event => {
        if (user.roles.map(({ name }) => name).includes("Quản trị viên")) {
            dispatch(fetchAllCreditClasses({ ...filterObject, subject: event.target.value }));
        } else {
            dispatch(
                fetchAllCreditClasses({
                    ...filterObject,
                    subject: event.target.value,
                    teacher: user.id,
                })
            );
        }
    };

    const handleTeacherChange = ({ target: { value } }) => {
        dispatch(
            fetchAllCreditClasses({
                ...filterObject,
                teacher: value,
            })
        );
    };

    useEffect(() => {
        $("#subjectFilter").val("");
        $("#teacherFilter").val("");
    }, []);

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
                <Select
                    label='môn học'
                    name='subjectFilter'
                    register={register}
                    options={subjects.map(subject => ({
                        title: subject.id.includes("CLC")
                            ? `${subject.name} CLC`
                            : `${subject.name}`,
                        value: subject.id,
                    }))}
                    onChangeHandler={handleSubjectChange}
                    hiddenOption
                    width={"w-60"}
                />
            </div>
            {user.roles.map(({ name }) => name).includes("Quản trị viên") && (
                <div className='mr-2 w-full flex items-center justify-start'>
                    <Select
                        label='giảng viên'
                        name='teacherFilter'
                        register={register}
                        options={users.map(user => ({
                            title: user.fullName,
                            value: user.id,
                        }))}
                        onChangeHandler={handleTeacherChange}
                        hiddenOption
                        width={"w-60"}
                    />
                </div>
            )}

            <div>
                <button
                    type='button'
                    className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-40'
                    onClick={() => {
                        if (!user.roles.map(({ name }) => name).includes("Quản trị viên")) {
                            dispatch(
                                fetchAllCreditClasses({
                                    page: 1,
                                    query: "",
                                    sortField: "id",
                                    sortDir: "desc",
                                    subject: "",
                                    teacher: user.id,
                                })
                            );
                        } else {
                            dispatch(
                                fetchAllCreditClasses({
                                    page: 1,
                                    query: "",
                                    sortField: "id",
                                    sortDir: "desc",
                                    subject: "",
                                    teacher: "",
                                })
                            );
                        }
                        $("#subjectFilter").val("");
                        $("#teacherFilter").val("");
                    }}
                >
                    Xóa bộ lọc
                </button>
            </div>
        </form>
    );
}

export default CreditClassFilter;
