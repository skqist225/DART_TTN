import { Button } from "flowbite-react";
import $ from "jquery";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { persistUserState } from "../../features/persistUserSlice";
import { subjectState } from "../../features/subjectSlice";
import { fetchAllTests, testState } from "../../features/testSlice";
import Select from "../utils/userInputs/Select";

function TestFilter() {
    const dispatch = useDispatch();
    const { filterObject } = useSelector(testState);
    const { user } = useSelector(persistUserState);
    const { subjectsHaveQuestion: subjects } = useSelector(subjectState);
    const { register, handleSubmit } = useForm();

    const handleSubjectChange = event => {
        dispatch(fetchAllTests({ ...filterObject, subject: event.target.value }));
    };

    useEffect(() => {
        $("#subjectFilter").val("");
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
            <div className='mr-2 w-full flex items-center justify-start'>
                <div className='mr-2 w-full flex items-center'>
                    <Button
                        type='button'
                        onClick={e => {
                            dispatch(fetchAllTests({ ...filterObject, teacher: user.id }));
                        }}
                    >
                        Giảng viên soạn
                    </Button>
                </div>
            </div>
            <div>
                <button
                    type='button'
                    className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-40'
                    onClick={() => {
                        dispatch(
                            fetchAllTests({
                                page: 1,
                                query: "",
                                sortField: "id",
                                sortDir: "desc",
                                subject: "",
                            })
                        );
                        $("#subjectFilter").val("");
                    }}
                >
                    Xóa bộ lọc
                </button>
            </div>
        </form>
    );
}

export default TestFilter;
