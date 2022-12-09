import React from "react";
import { useSelector } from "react-redux";
import { tailwindCss } from "../../tailwind";
import { persistUserState } from "../../features/persistUserSlice";
import EnableOrDisable from "../common/EnableOrDisable";
import { enableOrDisableRegister } from "../../features/registerSlice";

function RegisterTableBody({ rows, setIsEdit, type = "", addExam = false }) {
    const { user } = useSelector(persistUserState);

    return (
        <tbody>
            {rows.map(row => {
                let disableClassName = "";
                if (type === "Giữa kỳ") {
                    if (row.belongToMidTerm) {
                        disableClassName = "bg-gray-200 hover:bg-gray-200";
                    }
                } else if (type === "Cuối kỳ") {
                    if (row.belongToEndOfTerm) {
                        disableClassName = "bg-gray-200 hover:bg-gray-200";
                    }
                }
                return (
                    <tr
                        className={`${tailwindCss.tr} ${disableClassName} ${
                            row.status && "bg-gray-200 hover:bg-gray-200"
                        }`}
                        key={row.id}
                    >
                        {addExam && (
                            <></>
                            // <td className='p-4'>
                            //     <div className='flex items-center'>
                            //         <input
                            //             type='checkbox'
                            //             className='w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 tests-checkbox'
                            //             data-id={row.id}
                            //             disabled={disableClassName}
                            //         />
                            //         <label htmlFor='checkbox-all' className='sr-only'>
                            //             checkbox
                            //         </label>
                            //     </div>
                            // </td>
                        )}
                        <td className={tailwindCss.tableCell}>{row.student.id}</td>
                        <td className={tailwindCss.tableCell}>{row.student.fullName}</td>
                        {!addExam && (
                            <>
                                <td className={tailwindCss.tableCell}>{row.creditClass.id}</td>
                                <td className={tailwindCss.tableCell}>
                                    {row.creditClass.schoolYear}
                                </td>
                                <td className={tailwindCss.tableCell}>
                                    {row.creditClass.semester}
                                </td>
                                <td className={tailwindCss.tableCell}>
                                    {row.creditClass.subjectName}
                                </td>
                                <td className={tailwindCss.tableCell}>
                                    {row.creditClass.teacherName}
                                </td>
                            </>
                        )}
                        {!addExam &&
                            user.roles.map(({ name }) => name).includes("Quản trị viên") && (
                                <EnableOrDisable
                                    id={{
                                        creditClassId: row.creditClass.id,
                                        studentId: row.student.id,
                                    }}
                                    status={row.status}
                                    enableOrDisable={enableOrDisableRegister}
                                    creditClassPage
                                />
                            )}
                    </tr>
                );
            })}
        </tbody>
    );
}

export default RegisterTableBody;
