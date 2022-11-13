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
import { useDispatch } from "react-redux";
import LevelBadge from "../utils/commons/LevelBadge";

export const cellCss = "py-2 px-3 text-black";

function QuestionTableBody({ rows, setIsEdit, addTest = false, page = null }) {
    const dispatch = useDispatch();
    if (page !== null) {
        rows = rows.slice((page - 1) * 10, page * 10);
    }

    const { excelAdd } = useSelector(questionState);

    return (
        <tbody>
            {rows.map(row => {
                let answer = null;
                if (row.type === "Đáp án điền") {
                    answer = row.finalAnswer;
                } else if (row.type === "Một đáp án") {
                }

                return (
                    <tr
                        className={`${tailwindCss.tr} ${
                            !row.status && "bg-gray-200 hover:bg-gray-200"
                        }`}
                        key={row.id}
                    >
                        <td className={cellCss}>{row.id}</td>
                        <td className={cellCss} style={{ maxWidth: "250px" }}>
                            {row.content}
                        </td>
                        {!addTest ? (
                            <>
                                <td className={cellCss}>{row.type}</td>
                                <td className={cellCss}>{row.answers && row.answers.length}</td>
                                <td className={cellCss}>
                                    <LevelBadge level={row.level} />
                                </td>
                                <td className={cellCss}>
                                    {!excelAdd ? row.chapter.name : row.chapterName}
                                </td>
                                <td className={cellCss}>
                                    {!excelAdd ? row.chapter.subject.name : row.subjectName}
                                </td>
                            </>
                        ) : (
                            <>
                                <td className={cellCss}>{row.type}</td>
                                <td className={cellCss}>{row.chapter.name}</td>
                                <td>
                                    <LevelBadge level={row.level} />
                                </td>
                            </>
                        )}
                        {!excelAdd && (
                            <td className={cellCss}>
                                {row.teacher.firstName} {row.teacher.lastName}
                            </td>
                        )}
                        <td className='py-2 px-3 flex items-center justify-center'>
                            {!addTest ? (
                                <>
                                    <MyButton
                                        type='edit'
                                        onClick={() => {
                                            $("#questionModal").css("display", "flex");
                                            setIsEdit(true);
                                            dispatch(setEditedQuestion(row));
                                        }}
                                    />
                                    {!excelAdd && (
                                        <div className='mx-1'>
                                            <MyButton
                                                type='delete'
                                                onClick={() => {
                                                    dispatch(deleteQuestion(row.id));
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div>
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
                );
            })}
        </tbody>
    );
}

export default QuestionTableBody;
