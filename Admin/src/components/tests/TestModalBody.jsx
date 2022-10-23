import React, { useState } from "react";
import { useSelector } from "react-redux";
import { questionState } from "../../features/questionSlice";
import { clearErrorField, setEditedsubject, subjectState } from "../../features/subjectSlice";
import { tailwindCss } from "../../tailwind";
import QuestionTableBody from "../questions/QuestionTableBody";
import TableHeader from "../utils/tables/TableHeader";
import TablePagination from "../utils/tables/TablePagination";
import Input from "../utils/userInputs/Input";
import Select from "../utils/userInputs/Select";

const columns = [
    {
        name: "STT",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Nội dung",
        sortField: "content",
        sortable: true,
    },
    {
        name: "Đáp án",
        sortField: "finalAnswer",
        sortable: true,
    },
    {
        name: "Chương",
        sortField: "chapter",
        sortable: true,
    },
    {
        name: "Mức độ",
        sortField: "level",
        sortable: true,
    },
    {
        name: "Giảng viên",
        sortField: "teacher",
        sortable: true,
    },
];

function TestModalBody({ errors, register, dispatch, setValue }) {
    const [page, setPage] = useState(1);
    const { editedTest, errorObject } = useSelector(subjectState);
    const { subjects } = useSelector(subjectState);
    const { questions, totalElements, totalPages } = useSelector(questionState);

    const onKeyDown = ({ target: { name } }) => {
        if (errorObject) {
            dispatch(clearErrorField(name));
        }
        if (editedTest) {
            dispatch(setEditedsubject(null));
        }
    };

    if (editedTest) {
        setValue("id", editedTest.id);
        setValue("name", editedTest.name);
    }

    return (
        <div className='mt-5'>
            <div className='col-flex items-center justify-center w-full'>
                <div className='w-full my-5'>
                    <Input
                        label='Tên bộ đề *'
                        error={
                            (errors.name && errors.name.message) ||
                            (errorObject && errorObject.name)
                        }
                        register={register}
                        name='name'
                        onKeyDown={onKeyDown}
                    />
                </div>
                <div className='my-3 w-full'>
                    <Select
                        label='Môn học *'
                        labelClassName={tailwindCss.label}
                        selectClassName={tailwindCss.select}
                        error={errors.testSubjectId && errors.testSubjectId.message}
                        register={register}
                        name='testSubjectId'
                        options={subjects.map(s => ({ title: s.name, value: s.id }))}
                    />
                </div>
                <div>
                    <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                        <TableHeader columns={columns} />
                        <QuestionTableBody rows={questions} page={page} addTest />
                    </table>
                    <TablePagination
                        totalElements={totalElements}
                        totalPages={totalPages}
                        setPage={setPage}
                    />
                </div>
            </div>
        </div>
    );
}

export default TestModalBody;
