import React from "react";
import { deleteQuestion, setEditedQuestion } from "../../features/questionSlice";
import { tailwindCss } from "../../tailwind";
import { MyButton } from "../common";
import $ from "jquery";

function QuestionTableBody({ rows, setIsEdit, dispatch }) {
    function lookupQuestionLevel(level) {
        switch (level) {
            case "HARD":
                return "Khó";
            case "MEDIUM":
                return "Trung bình";
            case "EASY":
                return "Dễ";
        }
    }

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
                    <td className='py-4 px-6'>{row.content}</td>
                    <td className='py-4 px-6'>{row.answerA}</td>
                    <td className='py-4 px-6'>{row.answerB}</td>
                    <td className='py-4 px-6'>{row.answerC}</td>
                    <td className='py-4 px-6'>{row.answerD}</td>
                    <td className='py-4 px-6'>{row.finalAnswer}</td>
                    <td className='py-4 px-6'>{lookupQuestionLevel(row.level)}</td>
                    <td className='py-4 px-6'>Nguyễn Văn Tới</td>
                    <td class='py-4 px-6 flex items-center'>
                        <MyButton
                            type='edit'
                            onClick={() => {
                                $("#questionModal").css("display", "flex");
                                setIsEdit(true);
                                dispatch(setEditedQuestion(row));
                            }}
                        />
                        <div className='mx-3'>
                            <MyButton
                                type='disable'
                                onClick={() => {
                                    dispatch(deleteQuestion(row.id));
                                }}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default QuestionTableBody;
