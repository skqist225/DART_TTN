import React from "react";
import { useSelector } from "react-redux";
import { Tooltip } from "flowbite-react";
import { tailwindCss } from "../../tailwind";
import MyButton, { ButtonType } from "../common/MyButton";
import { persistUserState } from "../../features/persistUserSlice";

function ViewOldExamTableBody({ rows }) {
    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name) || [];
    return (
        <tbody>
            {rows.map((row, index) => {
                return (
                    <tr
                        className={`${tailwindCss.tr} ${
                            row.status && "bg-gray-200 hover:bg-gray-200"
                        }`}
                        key={row.id}
                    >
                        <td className={tailwindCss.tableCell} style={{ maxWidth: "200px" }}>
                            {row.name}
                        </td>
                        <td className={tailwindCss.tableCell}>{row.subjectId}</td>
                        <td className={tailwindCss.tableCell}>{row.subjectName}</td>
                        <td className={tailwindCss.tableCell} style={{ zIndex: "9999" }}>
                            <Tooltip
                                content={
                                    <ul>
                                        <li className={tailwindCss.tableCell}>
                                            Số sinh viên thi: {row.numberOfRegisters}
                                        </li>
                                        <li className={tailwindCss.tableCell}>
                                            Ngày thi: {row.examDate}
                                        </li>
                                        <li className={tailwindCss.tableCell}>
                                            Tiết báo danh: {row.noticePeriod}
                                        </li>
                                        <li className={tailwindCss.tableCell}>
                                            Thời gian thi: {row.time} phút
                                        </li>
                                        <li className={tailwindCss.tableCell}>
                                            Loại kỳ thi: {row.type}
                                        </li>
                                    </ul>
                                }
                                placement='bottom'
                                animation='duration-300'
                                style='light'
                            >
                                <MyButton type={ButtonType.view} />
                            </Tooltip>
                        </td>
                        <td className={tailwindCss.tableCell}>{row.studentScore}</td>
                        <td className={`${tailwindCss.tableCell} flex items-center`}>
                            {userRoles.includes("Sinh viên") && (
                                <div className='mr-2'>
                                    <Tooltip content='Xem bài thi' placement='top'>
                                        <MyButton
                                            type='view'
                                            onClick={e => {
                                                window.location.href = `/viewExamsDetail/${row.id}`;
                                            }}
                                        />
                                    </Tooltip>
                                </div>
                            )}
                        </td>
                    </tr>
                );
            })}
        </tbody>
    );
}

export default ViewOldExamTableBody;
