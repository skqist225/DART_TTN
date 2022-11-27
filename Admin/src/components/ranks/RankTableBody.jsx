import React from "react";
import { tailwindCss } from "../../tailwind";
import { cellCss } from "../questions/QuestionTableBody";

function RankTableBody({ rows }) {
    return (
        <tbody>
            {rows.map((row, index) => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className={cellCss}>{index + 1}</td>
                    <td className={cellCss}>{row.studentId}</td>
                    <td className={cellCss}>{row.studentName}</td>
                    <td className={cellCss}>{row.score}</td>
                    <td className={cellCss}>{row.examName}</td>
                </tr>
            ))}
        </tbody>
    );
}

export default RankTableBody;
