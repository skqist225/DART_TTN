import React from "react";
import { useSelector } from "react-redux";
import { persistUserState } from "../../features/persistUserSlice";
import { tailwindCss } from "../../tailwind";

function RankTableBody({ rows }) {
    const { userRoles } = useSelector(persistUserState);

    return (
        <tbody>
            {rows.map((row, index) => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className={tailwindCss.tableCell}>{index + 1}</td>
                    <td className={tailwindCss.tableCell}>{row.studentId}</td>
                    <td className={tailwindCss.tableCell}>{row.studentName}</td>
                    {!userRoles.includes("Sinh viên") && (
                        <>
                            <td className={tailwindCss.tableCell}>{row.score}</td>
                            <td className={tailwindCss.tableCell}>{row.examName}</td>
                        </>
                    )}
                </tr>
            ))}
        </tbody>
    );
}

export default RankTableBody;
