import React from "react";
import { tailwindCss } from "../../tailwind";
import MyButton from "../common/MyButton";
import $ from "jquery";
import {
    deleteCreditClass,
    enableOrDisableCreditClass,
    setEditedCreditClass,
} from "../../features/creditClassSlice";
import { cellCss } from "../questions/QuestionTableBody";
import EnableOrDisable from "../common/EnableOrDisable";

function CreditClassTableBody({ rows, setIsEdit, dispatch, modalId }) {
    return (
        <tbody>
            {rows.map(row => (
                <tr
                    className={`${tailwindCss.tr} ${row.status && "bg-gray-200 hover:bg-gray-200"}`}
                    key={row.id}
                >
                    <td className={cellCss}>{row.id}</td>
                    <td className={cellCss}>{row.schoolYear}</td>
                    <td className={cellCss}>{row.semester}</td>
                    <td className={cellCss}>{row.subjectName}</td>
                    <td className={cellCss}>{row.group}</td>
                    <td className={cellCss}>{row.status}</td>
                    <td className={cellCss}>{row.teacherName}</td>
                    <td className={cellCss + " flex items-center"}>
                        <div className='mr-2'>
                            <MyButton
                                type='edit'
                                onClick={() => {
                                    $(`#${modalId}`).css("display", "flex");
                                    setIsEdit(true);
                                    dispatch(setEditedCreditClass(row));
                                }}
                            />
                        </div>
                        <EnableOrDisable
                            status={row.status}
                            enableOrDisable={enableOrDisableCreditClass}
                            id={row.id}
                            creditClassPage
                        />
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default CreditClassTableBody;
