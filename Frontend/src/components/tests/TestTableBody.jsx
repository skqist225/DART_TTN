import { Badge, Button, Card, Tooltip } from "flowbite-react";
import $ from "jquery";
import React from "react";
import { useDispatch } from "react-redux";
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
    return (
        <tbody>
            {rows.map((row, index) => {
                let shouldCancel = true;
                let shouldCancelMessage = "",
                    shouldDeleteMessage,
                    shouldEditMessage;

                if (row.used) {
                    shouldCancel = false;
                    shouldCancelMessage = "Đề thi đã sử dụng, không kích hoạt/hủy";
                    shouldDeleteMessage = "Đề thi đã sử dụng, không xóa";
                    shouldEditMessage = "Đề thi đã sử dụng, không sửa";
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
                                    <label htmlFor='checkbox-all' className='sr-only'>
                                        checkbox
                                    </label>
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
                                            Header={
                                                <Card>
                                                    <div
                                                        className=' justify-between w-4/6 m-auto
                                                    '
                                                    >
                                                        <div>Mã đề thi: {row.id}</div>
                                                        <div>Tên đề thi: {row.name}</div>
                                                        <div>
                                                            Số lượng câu hỏi: {row.questions.length}
                                                        </div>
                                                    </div>
                                                </Card>
                                            }
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
                        <td className={tailwindCss.tableCell}>{row.teacherName}</td>
                        {!examPage && (
                            <td className={`${tailwindCss.tableCell} flex items-center`}>
                                {/* <div className='mr-2'>
                                    <MyButton
                                        type={ButtonType.edit}
                                        onClick={() => {
                                            console.log(row);
                                            $("#testModal").css("display", "flex");
                                            setIsEdit(true);
                                            dispatch(setEditedTest(row));
                                        }}
                                        disabled={!shouldCancel}
                                        customTooltipMessage={shouldEditMessage}
                                    />
                                </div> */}
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
                                <EnableOrDisable
                                    status={row.status}
                                    enableOrDisable={enableOrDisableTest}
                                    id={row.id}
                                    disabled={!shouldCancel}
                                    customTooltipMessage={shouldCancelMessage}
                                />
                            </td>
                        )}
                    </tr>
                );
            })}
        </tbody>
    );
}

export default TestTableBody;
