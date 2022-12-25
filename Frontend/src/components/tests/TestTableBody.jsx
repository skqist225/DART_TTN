import { Badge, Button, Tooltip } from "flowbite-react";
import $ from "jquery";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { persistUserState } from "../../features/persistUserSlice";
import { deleteTest, enableOrDisableTest, setEditedTest } from "../../features/testSlice";
import { tailwindCss } from "../../tailwind";
import EnableOrDisable from "../common/EnableOrDisable";
import MyButton, { ButtonType } from "../common/MyButton";
import ViewDetails from "../common/ViewDetails";
import TableModalViewer from "../utils/tables/TableModalViewer";
import CriteriaList from "./CriteriaList";
import QuestionList from "./QuestionList";

function TestTableBody({ rows, examPage = false, setIsEdit }) {
    const dispatch = useDispatch();

    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);

    return (
        <tbody>
            {rows.map((row, index) => {
                let shouldCancel = true;
                let shouldCancelMessage = "",
                    shouldDeleteMessage = "",
                    shouldEditMessage = "";

                if (row.used) {
                    shouldCancel = false;
                    shouldCancelMessage = "Không thể hủy/kích hoạt đề thi đã sử dụng";
                    shouldDeleteMessage = "Không thể xóa đề thi đã sử dụng";
                    shouldEditMessage = "Không thể sửa đề thi đã sử dụng";
                } else if (!userRoles.includes("Quản trị viên") && row.status) {
                    shouldCancel = false;
                    shouldEditMessage = "Không thể sửa đề thi đã được duyệt";
                    shouldDeleteMessage = "Không thể xóa đề thi đã được duyệt";
                }

                return (
                    <tr
                        className={`${tailwindCss.tr} ${
                            !row.status && "bg-gray-200 hover:bg-gray-200"
                        }`}
                        key={row.id}
                    >
                        {examPage && (
                            <th scope='col' className='p-4'>
                                <div className='flex items-center'>
                                    <input
                                        type='checkbox'
                                        className='w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 tests-checkbox'
                                        data-id={row.id}
                                    />
                                </div>
                            </th>
                        )}
                        <td className={tailwindCss.tableCell}>
                            <Tooltip content={"Xem chi tiết đề thi"}>
                                <Button
                                    style={{ backgroundColor: "none" }}
                                    onClick={() => {
                                        $(`#viewTestDetail${row.id}`).css("display", "flex");
                                    }}
                                >
                                    {row.id}
                                </Button>
                                <TableModalViewer
                                    modalId={`viewTestDetail${row.id}`}
                                    modalLabel='Thông tin đề thi'
                                    ModalBody={
                                        <ViewDetails
                                            labels={[
                                                `Danh sách tiêu chí (${row.criteria.length})`,
                                                `Danh sách câu hỏi (${row.questions.length})`,
                                            ]}
                                            data={[
                                                <CriteriaList criteria={row.criteria} />,
                                                <QuestionList questions={row.questions} />,
                                            ]}
                                        />
                                    }
                                />
                            </Tooltip>
                        </td>
                        <td
                            className={`${tailwindCss.tableCell} text-sm`}
                            style={{ maxWidth: `${examPage && "150px"}` }}
                        >
                            {row.name}
                        </td>
                        <td className={tailwindCss.tableCell}>
                            <Badge color={!row.used ? "indigo" : "success"} size='sm'>
                                {!row.used ? "Chưa sử dụng" : "Đã sử dụng"}
                            </Badge>
                        </td>
                        <td className={tailwindCss.tableCell + " flex justify-center"}>
                            {row.numberOfQuestions}
                        </td>
                        <td className={tailwindCss.tableCell}>{row.subjectName}</td>
                        {userRoles.includes("Quản trị viên") && (
                            <td className={tailwindCss.tableCell}>{row.teacherName}</td>
                        )}

                        {!examPage && (
                            <td className={`${tailwindCss.tableCell} flex items-center`}>
                                {(userRoles.includes("Quản trị viên") ||
                                    row.teacherId === user.id) && (
                                    <>
                                        <div className='mr-2'>
                                            <MyButton
                                                type={ButtonType.edit}
                                                onClick={() => {
                                                    $("#testModal").css("display", "flex");
                                                    setIsEdit(true);
                                                    dispatch(setEditedTest(row));
                                                }}
                                                disabled={!shouldCancel}
                                                customTooltipMessage={shouldEditMessage}
                                            />
                                        </div>
                                        <div className='mr-2'>
                                            <MyButton
                                                type={ButtonType.delete}
                                                onClick={() => {
                                                    dispatch(deleteTest(row.id));
                                                }}
                                                disabled={!shouldCancel}
                                                customTooltipMessage={shouldDeleteMessage}
                                            />
                                        </div>
                                        {userRoles.includes("Quản trị viên") && (
                                            <EnableOrDisable
                                                status={row.status}
                                                enableOrDisable={enableOrDisableTest}
                                                id={row.id}
                                                disabled={!shouldCancel}
                                                customTooltipMessage={shouldCancelMessage}
                                            />
                                        )}
                                    </>
                                )}
                            </td>
                        )}
                    </tr>
                );
            })}
        </tbody>
    );
}

export default TestTableBody;
