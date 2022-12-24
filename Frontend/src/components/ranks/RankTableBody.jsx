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
            {rows.map(row => {
                const rank = row.rankOrder + (page - 1) * 15;
                const topRankClassName =
                    rank === 1
                        ? "text-base font-semibold text-yellow-500"
                        : rank === 2
                        ? "text-base font-semibold text-red-500"
                        : rank === 3
                        ? "text-base font-semibold text-green-500"
                        : "";

                return (
                    <tr
                        className={`${tailwindCss.tr} ${
                            row.studentId === user.id && "bg-slate-200 hover:bg-slate-200"
                        }`}
                        key={row.id + row.studentId}
                    >
                        <td className={tailwindCss.tableCell}>
                            <span className={topRankClassName}>{rank}</span>
                        </td>
                        <td className={tailwindCss.tableCell + " " + topRankClassName}>
                            {row.studentId}
                        </td>
                        <td className={tailwindCss.tableCell + " " + topRankClassName}>
                            {row.studentName}
                        </td>
                        {!user.roles.map(({ name }) => name).includes("Sinh viên") && (
                            <td className={tailwindCss.tableCell}>{row.score}</td>
                        )}
                    </tr>
                );
            })}
        </tbody>
    );
}

export default RankTableBody;
