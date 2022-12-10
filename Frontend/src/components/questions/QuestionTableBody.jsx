import React from "react";
import { useDispatch } from "react-redux";
import {
    deleteQuestion,
    enableOrDisableQuestion,
    setEditedQuestion,
} from "../../features/questionSlice";
import { tailwindCss } from "../../tailwind";
import { MyButton, LevelBadge } from "..";
import EnableOrDisable from "../common/EnableOrDisable";
import { Tooltip } from "flowbite-react";
import { ButtonType } from "../common/MyButton";
import { AnswerList } from "../";
import $ from "jquery";

function QuestionTableBody({
    rows,
    setIsEdit,
    addTest = false,
    page = null,
    chapterListPage = false,
    addCheckbox = false,
    check = false,
    register,
}) {
    const dispatch = useDispatch();
    if (page !== null) {
        rows = rows.slice((page - 1) * 10, page * 10);
    }

    return (
        <tbody>
            {rows.map((row, index) => {
                return (
                    <tr
                        className={`${tailwindCss.tr} ${
                            !row.status && "bg-gray-200 hover:bg-gray-200"
                        }`}
                        key={row.id}
                    >
                        {addCheckbox && (
                            <th scope='col' className='p-4'>
                                <div className='flex items-center'>
                                    <input
                                        type='hidden'
                                        {...register(
                                            check
                                                ? `editedQuestions.${index}.questionId`
                                                : `etdQsts.${index}.questionId`
                                        )}
                                        value={row.id}
                                    />
                                    <input
                                        type='checkbox'
                                        className={tailwindCss.checkbox}
                                        data-id={row.id}
                                        defaultChecked={check}
                                        {...register(
                                            check
                                                ? `editedQuestions.${index}.selected`
                                                : `etdQsts.${index}.selected`
                                        )}
                                    />
                                    <label htmlFor='checkbox-all' className='sr-only'>
                                        checkbox
                                    </label>
                                </div>
                            </th>
                        )}

                        <td className={tailwindCss.tableCell}>{row.id}</td>
                        <td
                            className={tailwindCss.tableCell}
                            style={{
                                maxWidth: "250px",
                                display: "-webkit-box",
                                "-webkit-line-clamp": 2,
                                "-webkit-box-orient": "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                lineHeight: 1.625,
                                height: "full-content",
                            }}
                        >
                            {row.content}
                        </td>
                        <td className={tailwindCss.tableCell} style={{ zIndex: "9999" }}>
                            <Tooltip
                                content={<AnswerList answers={row.answers} />}
                                placement='bottom'
                                animation='duration-300'
                                style='light'
                            >
                                <MyButton type={ButtonType.view} noTooltip />
                            </Tooltip>
                        </td>
                        {!addTest ? (
                            <>
                                <td className={tailwindCss.tableCell}>{row.type}</td>
                                <td className={tailwindCss.tableCell}>
                                    <LevelBadge level={row.level} label={row.level} />
                                </td>
                                <td className={tailwindCss.tableCell}>{row.chapterName}</td>
                                <td className={tailwindCss.tableCell}>{row.subjectName}</td>
                            </>
                        ) : (
                            <>
                                <td className={tailwindCss.tableCell}>{row.type}</td>
                                {!chapterListPage && (
                                    <td className={tailwindCss.tableCell}>{row.chapterName}</td>
                                )}{" "}
                                <td>
                                    <LevelBadge level={row.level} label={row.level} />
                                </td>
                            </>
                        )}
                        <td className={tailwindCss.tableCell}>{row.teacherName}</td>
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
                                    <div className='mx-1'>
                                        <MyButton
                                            type='delete'
                                            onClick={() => {
                                                dispatch(deleteQuestion(row.id));
                                            }}
                                        />
                                    </div>
                                    <EnableOrDisable
                                        status={row.status}
                                        enableOrDisable={enableOrDisableQuestion}
                                        id={row.id}
                                    />
                                </>
                            ) : (
                                <></>
                            )}
                        </td>
                    </tr>
                );
            })}
        </tbody>
    );
}

export default QuestionTableBody;
