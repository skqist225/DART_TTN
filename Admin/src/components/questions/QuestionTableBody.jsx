import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteQuestion,
    enableOrDisableQuestion,
    questionState,
    setEditedQuestion,
} from "../../features/questionSlice";
import { tailwindCss } from "../../tailwind";
import { MyButton, LevelBadge } from "..";
import EnableOrDisable from "../common/EnableOrDisable";
import $ from "jquery";
import { persistUserState } from "../../features/persistUserSlice";
import { Tooltip } from "flowbite-react";
import { ButtonType } from "../common/MyButton";
import { AnswerList } from "../";

function QuestionTableBody({ rows, setIsEdit, addTest = false, page = null }) {
    const dispatch = useDispatch();
    if (page !== null) {
        rows = rows.slice((page - 1) * 10, page * 10);
    }
    const { userRoles } = useSelector(persistUserState);
    const { excelAdd } = useSelector(questionState);

    return (
        <tbody>
            {rows.map(row => {
                return (
                    <tr
                        className={`${tailwindCss.tr} ${
                            !row.status && "bg-gray-200 hover:bg-gray-200"
                        }`}
                        key={row.id}
                    >
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
                        </td>{" "}
                        <td className={tailwindCss.tableCell} style={{ zIndex: "9999" }}>
                            <Tooltip
                                content={<AnswerList answers={row.answers} />}
                                placement='bottom'
                                animation='duration-300'
                                style='light'
                            >
                                <MyButton type={ButtonType.view} />
                            </Tooltip>
                        </td>
                        {!addTest ? (
                            <>
                                <td className={tailwindCss.tableCell}>{row.type}</td>
                                <td className={tailwindCss.tableCell}>
                                    <LevelBadge level={row.level} />
                                </td>
                                <td className={tailwindCss.tableCell}>
                                    {!excelAdd ? row.chapter.name : row.chapterName}
                                </td>
                                <td className={tailwindCss.tableCell}>
                                    {!excelAdd ? row.chapter.subjectName : row.subjectName}
                                </td>
                            </>
                        ) : (
                            <>
                                <td className={tailwindCss.tableCell}>{row.type}</td>
                                <td className={tailwindCss.tableCell}>{row.chapter.name}</td>
                                <td>
                                    <LevelBadge level={row.level} />
                                </td>
                            </>
                        )}
                        {!excelAdd && userRoles.includes("Quản trị viên") && (
                            <td className={tailwindCss.tableCell}>
                                {row.teacher.firstName} {row.teacher.lastName}
                            </td>
                        )}{" "}
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
                                    <EnableOrDisable
                                        status={row.status}
                                        enableOrDisable={enableOrDisableQuestion}
                                        id={row.id}
                                    />
                                </>
                            ) : (
                                <></>
                                // <div className='mx-3'>
                                //     {row.status ? (
                                //         <MyButton
                                //             type='delete'
                                //             onClick={() => {
                                //                 dispatch(disableOrEnableLoadedQuestions(row.id));
                                //             }}
                                //         />
                                //     ) : (
                                //         <MyButton
                                //             type='enable'
                                //             onClick={() => {
                                //                 dispatch(disableOrEnableLoadedQuestions(row.id));
                                //             }}
                                //         />
                                //     )}
                                // </div>
                            )}
                        </td>
                    </tr>
                );
            })}
        </tbody>
    );
}

export default QuestionTableBody;
