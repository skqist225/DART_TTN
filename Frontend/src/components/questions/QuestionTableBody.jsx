import { Tooltip } from "flowbite-react";
import $ from "jquery";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { EnableOrDisable, LevelBadge, MyButton } from "..";
import { AnswerList } from "../";
import { persistUserState } from "../../features/persistUserSlice";
import {
    deleteQuestion,
    enableOrDisableQuestion,
    setEditedQuestion,
} from "../../features/questionSlice";
import { tailwindCss } from "../../tailwind";
import { ButtonType } from "../common/MyButton";

function QuestionTableBody({
    rows,
    setIsEdit,
    addTest = false,
    page = null,
    pageNumber = null,
    chapterListPage = false,
    addCheckbox = false,
    check = false,
    register,
}) {
    const dispatch = useDispatch();
    if (page !== null) {
        rows = rows.slice((page - 1) * 10, page * 10);
    }

    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);

    return (
        <tbody>
            {rows.map((row, index) => {
                let shouldNotEditMessage = "",
                    shouldNotDeleteMessage;
                if (!row.shouldEdit) {
                    shouldNotEditMessage = "Câu hỏi đã thuộc đề thi được sử dụng không thể sửa";
                    shouldNotDeleteMessage = "Câu hỏi đã thuộc đề thi được sử dụng không thể xóa";
                }

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
                                </div>
                            </th>
                        )}
                        {addTest && (
                            <td className={tailwindCss.tableCell}>
                                {index + 1 + (pageNumber - 1) * 10}
                            </td>
                        )}
                        <td className={tailwindCss.tableCell}>{row.id}</td>
                        <td
                            className={"py-2 text-black text-sm"}
                            style={{
                                maxWidth: "300px",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                lineHeight: 1.6,
                                height: "50px",
                            }}
                        >
                            {row.content}
                        </td>
                        <td className={tailwindCss.tableCell} style={{ zIndex: "9999" }}>
                            <Tooltip
                                content={
                                    <AnswerList
                                        answers={row.answers}
                                        quesitonContent={row.content}
                                    />
                                }
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
                                )}
                                <td>
                                    <LevelBadge level={row.level} label={row.level} />
                                </td>
                            </>
                        )}
                        {userRoles.includes("Quản trị viên") && (
                            <td className={tailwindCss.tableCell}>{row.teacherName}</td>
                        )}
                        <td className='py-2 px-3 flex items-center justify-center'>
                            {!addTest &&
                            (userRoles.includes("Quản trị viên") || row.teacherId === user.id) ? (
                                <>
                                    <MyButton
                                        type='edit'
                                        onClick={() => {
                                            $("#questionModal").css("display", "flex");
                                            setIsEdit(true);
                                            dispatch(setEditedQuestion(row));
                                        }}
                                        customTooltipMessage={shouldNotEditMessage}
                                        disabled={!row.shouldEdit}
                                    />
                                    <div className='mx-1'>
                                        <MyButton
                                            type='delete'
                                            onClick={() => {
                                                dispatch(deleteQuestion(row.id));
                                            }}
                                            customTooltipMessage={shouldNotDeleteMessage}
                                            disabled={!row.shouldEdit}
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
