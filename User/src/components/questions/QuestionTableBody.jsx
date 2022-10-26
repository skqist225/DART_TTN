import React from "react";
import {
    deleteQuestion,
    disableOrEnableLoadedQuestions,
    enableOrDisableQuestion,
    questionState,
    setEditedQuestion,
} from "../../features/questionSlice";
import { tailwindCss } from "../../tailwind";
import { MyButton } from "../common";
import $ from "jquery";
import { useSelector } from "react-redux";

function QuestionTableBody({ rows, setIsEdit, dispatch, addTest = false, page = null }) {
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
        rows = rows.slice((page - 1) * 10, page * 10);
    }

    const cellCss = "py-2 px-3 text-black";

    const { excelAdd } = useSelector(questionState);

    return (
        <tbody>
            {rows.map(row => (
                <tr
                    className={`${tailwindCss.tr} ${
                        !row.status && "bg-gray-200 hover:bg-gray-200"
                    }`}
                    key={row.id}
                >
                    <td className='p-4 w-4'>
                        <div className='flex items-center'>
                            <input
                                id='checkbox-table-search-1'
                                type='checkbox'
                                className={`${tailwindCss.checkbox} checkbox-table-search-1`}
                            />
                            <label for='checkbox-table-search-1' className='sr-only'>
                                checkbox
                            </label>
                        </div>
                    </td>
                    <td className='py-2 px-3 whitespace-nowrap dark:text-white'>{row.id}</td>
                    <td className={cellCss}>{row.content}</td>
                    {!addTest ? (
                        <>
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
                        </>
                    ) : (
                        <td className={`${cellCss}`}>
                            {row.finalAnswer === "A"
                                ? row.answerA
                                : row.finalAnswer === "B"
                                ? row.answerB
                                : row.finalAnswer === "C"
                                ? row.answerC
                                : row.answerD}
                        </td>
                    )}
                    {addTest && <td className={cellCss}>{row.chapter}</td>}
                    <td className={cellCss}>
                        {!excelAdd ? lookupQuestionLevel(row.level) : row.level}
                    </td>
                    {!addTest && (
                        <td className={cellCss}>
                            {!excelAdd ? row.subject.name : row.subjectName}
                        </td>
                    )}
                    {!excelAdd && (
                        <td className={cellCss}>
                            {row.teacher.firstName} {row.teacher.lastName}
                        </td>
                    )}
                    <td class='py-2 px-3 flex items-center'>
                        {!addTest ? (
                            <>
                                {" "}
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
                                        type='delete'
                                        onClick={() => {
                                            dispatch(deleteQuestion(row.id));
                                        }}
                                    />
                                </div>
                                <div className='mx-3'>
                                    {row.status ? (
                                        <MyButton
                                            type='disable'
                                            onClick={() => {
                                                dispatch(
                                                    enableOrDisableQuestion({
                                                        id: row.id,
                                                        action: "disable",
                                                    })
                                                );
                                            }}
                                        />
                                    ) : (
                                        <MyButton
                                            type='enable'
                                            onClick={() => {
                                                dispatch(
                                                    enableOrDisableQuestion({
                                                        id: row.id,
                                                        action: "enable",
                                                    })
                                                );
                                            }}
                                        />
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className='mx-3'>
                                {row.status ? (
                                    <MyButton
                                        type='delete'
                                        onClick={() => {
                                            dispatch(disableOrEnableLoadedQuestions(row.id));
                                        }}
                                    />
                                ) : (
                                    <MyButton
                                        type='enable'
                                        onClick={() => {
                                            dispatch(disableOrEnableLoadedQuestions(row.id));
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default QuestionTableBody;
