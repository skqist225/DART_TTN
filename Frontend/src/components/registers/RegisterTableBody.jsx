import React from "react";
import { useSelector } from "react-redux";
import { tailwindCss } from "../../tailwind";
import { persistUserState } from "../../features/persistUserSlice";
import EnableOrDisable from "../common/EnableOrDisable";
import { enableOrDisableRegister } from "../../features/registerSlice";

function RegisterTableBody({ rows, type = "", addExam = false, page }) {
    const { user } = useSelector(persistUserState);

    return (
        <tbody>
            {rows.map((row, index) => {
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
                            <td className={tailwindCss.tableCell}>{index + 1 + (page - 1) * 12}</td>
                        )}
                        <td className={tailwindCss.tableCell}>{row.student.id}</td>
                        <td className={tailwindCss.tableCell}>{row.student.fullName}</td>
                        {!addExam && (
                            <>
                                <td className={tailwindCss.tableCell}>{row.tempCreditClass.id}</td>
                                <td className={tailwindCss.tableCell}>
                                    {row.tempCreditClass.schoolYear}
                                </td>
                                <td className={tailwindCss.tableCell}>
                                    {row.tempCreditClass.semester}
                                </td>
                                <td className={tailwindCss.tableCell}>
                                    {row.tempCreditClass.subjectName}
                                </td>
                                <td className={tailwindCss.tableCell}>
                                    {row.tempCreditClass.teacherName}
                                </td>
                            </>
                        )}
                        {!addExam &&
                            user.roles.map(({ name }) => name).includes("Quản trị viên") && (
                                <EnableOrDisable
                                    id={{
                                        creditClassId: row.tempCreditClass.id,
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
