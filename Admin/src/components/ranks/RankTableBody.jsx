import React from "react";
import { tailwindCss } from "../../tailwind";

function RankTableBody({ rows }) {
    return (
        <tbody>
            {rows.map((row, index) => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className={tailwindCss.tableCell}>{index + 1}</td>
                    <td className={tailwindCss.tableCell}>{row.studentId}</td>
                    <td className={tailwindCss.tableCell}>{row.studentName}</td>
                    <td className={tailwindCss.tableCell}>{row.score}</td>
                    <td className={tailwindCss.tableCell}>{row.examName}</td>
                </tr>
            ))}
        </tbody>
    );
}

export default RankTableBody;
