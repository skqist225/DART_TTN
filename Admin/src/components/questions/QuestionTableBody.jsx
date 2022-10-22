import React from "react";
import { deleteQuestion, setEditedQuestion } from "../../features/questionSlice";
import { tailwindCss } from "../../tailwind";
import { MyButton } from "../common";
import $ from "jquery";

function QuestionTableBody({ rows, setIsEdit, dispatch, page = null }) {
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

    if (page !== null) {
        rows = rows.slice(page * 10, (page + 1) * 10);
    }

    const cellCss = "py-2 px-3 text-black";

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
                    <td className='py-2 px-3 whitespace-nowrap dark:text-white'>{row.id}</td>
                    <td className={cellCss}>{row.content}</td>
                    <td
                        className={`${cellCss} ${
                            row.finalAnswer === "A" && "text-green-600 font-semibold"
                        }`}
                    >
                        {row.answerA}
                    </td>
                    <td
                        className={`${cellCss} ${
                            row.finalAnswer === "B" && "text-green-600 font-semibold"
                        }`}
                    >
                        {row.answerB}
                    </td>
                    <td
                        className={`${cellCss} ${
                            row.finalAnswer === "C" && "text-green-600 font-semibold"
                        }`}
                    >
                        {row.answerC}
                    </td>
                    <td
                        className={`${cellCss} ${
                            row.finalAnswer === "D" && "text-green-600 font-semibold"
                        }`}
                    >
                        {row.answerD}
                    </td>
                    <td className={cellCss}>{lookupQuestionLevel(row.level)}</td>
                    <td className={cellCss}>
                        {row.teacher.firstName} {row.teacher.lastName}
                    </td>
                    <td className={cellCss}>{row.subject.name}</td>
                    <td class='py-2 px-3 flex items-center'>
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
