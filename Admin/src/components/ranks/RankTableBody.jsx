import React from "react";
import { useSelector } from "react-redux";
import { persistUserState } from "../../features/persistUserSlice";
import { takeExamState } from "../../features/takeExamSlice";
import { tailwindCss } from "../../tailwind";

function RankTableBody({ rows }) {
    const { user } = useSelector(persistUserState);

    const {
        filterObject: { page },
    } = useSelector(takeExamState);

    return (
        <tbody>
            {rows.map((row, index) => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className={tailwindCss.tableCell}>{row.rankOrder + (page - 1) * 15}</td>
                    <td className={tailwindCss.tableCell}>{row.studentId}</td>
                    <td className={tailwindCss.tableCell}>{row.studentName}</td>
                    {!user.roles.map(({ name }) => name).includes("Sinh viên") && (
                        <td className={tailwindCss.tableCell}>{row.score}</td>
                    )}
                </tr>
            ))}
        </tbody>
    );
}

export default RankTableBody;
