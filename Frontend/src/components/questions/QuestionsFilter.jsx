import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { fetchAllQuestions, questionState, setResetFilter } from "../../features/questionSlice";
import { subjectState } from "../../features/subjectSlice";
import Select from "../utils/userInputs/Select";
import { levelOptions } from "./QuestionModalBody";
import { userState } from "../../features/userSlice";
import $ from "jquery";
import { tailwindCss } from "../../tailwind";

function QuestionsFilter({ setValue }) {
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
                    hiddenOption={true}
                    width={"w-60"}
                />
            </div>
            <div className='mr-2 w-full flex items-center'>
                <Select
                    label='người soạn'
                    name='teacherFilter'
                    register={register}
                    options={users.map(user => ({ title: user.fullName, value: user.id }))}
                    onChangeHandler={handleTeacherChange}
                    hiddenOption={true}
                    width={"w-52"}
                />
            </div>
            <div>
                <button
                    type='button'
                    className={tailwindCss.clearFilterButton}
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

export default QuestionsFilter;
