import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { fetchAllQuestions, questionState, setResetFilter } from "../../features/questionSlice";
import { subjectState } from "../../features/subjectSlice";
import Select from "../utils/userInputs/Select";
import { levelOptions } from "./QuestionModalBody";
import { userState } from "../../features/userSlice";

function QuestionsFilter() {
    const dispatch = useDispatch();

    const { filterObject } = useSelector(questionState);
    const { subjects } = useSelector(subjectState);
    const { users } = useSelector(userState);

    const { register, handleSubmit } = useForm();

    const handleTeacherChange = ({ target: { value } }) => {
        dispatch(fetchAllQuestions({ ...filterObject, teacher: value }));
    };

    const handleSubjectChange = ({ target: { value } }) => {
        dispatch(fetchAllQuestions({ ...filterObject, subject: value }));
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
            <div className='mr-2 w-full flex items-center'>
                <Select
                    label='người soạn'
                    name='teacherFilter'
                    register={register}
                    options={users.map(user => ({ title: user.fullName, value: user.id }))}
                    onChangeHandler={handleTeacherChange}
                    hiddenOption
                    width={"w-48"}
                />
            </div>
            <div className='mr-2 w-full flex items-center justify-start'>
                <Select
                    label='môn học'
                    name='subjectFilter'
                    register={register}
                    options={subjects.map(subject => ({
                        title: subject.name,
                        value: subject.id,
                    }))}
                    onChangeHandler={handleSubjectChange}
                    hiddenOption
                    width={"w-48"}
                />
            </div>
            <div>
                <button
                    type='button'
                    className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-40'
                    onClick={() => {
                        dispatch(
                            fetchAllQuestions({
                                page: 1,
                                query: "",
                                sortField: "id",
                                sortDir: "desc",
                                level: "",
                                subject: "",
                                numberOfQuestions: 0,
                            })
                        );
                        dispatch(setResetFilter(true));
                    }}
                >
                    Xóa bộ lọc
                </button>
            </div>
        </form>
    );
}

export default QuestionsFilter;
