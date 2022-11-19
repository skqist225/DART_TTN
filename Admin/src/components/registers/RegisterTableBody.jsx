import React from "react";
import { tailwindCss } from "../../tailwind";
import MyButton from "../common/MyButton";
import { deleteCreditClass, setEditedCreditClass } from "../../features/creditClassSlice";
import { cellCss } from "../questions/QuestionTableBody";
import $ from "jquery";

function RegisterTableBody({ rows, setIsEdit, dispatch, modalId }) {
    return (
        <tbody>
            {rows.map(row => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className={cellCss}>{row.student.id}</td>
                    <td className={cellCss}>{row.student.fullName}</td>
                    <td className={cellCss}>{row.creditClass.id}</td>
                    <td className={cellCss}>{row.creditClass.schoolYear}</td>
                    <td className={cellCss}>{row.creditClass.semester}</td>
                    <td className={cellCss}>{row.creditClass.subjectName}</td>
                    <td className={cellCss}>{row.creditClass.teacherName}</td>
                    <td className={cellCss + " flex items-center"}>
                        <MyButton
                            type='edit'
                            onClick={() => {
                                $(`#${modalId}`).css("display", "flex");
                                setIsEdit(true);
                                dispatch(setEditedCreditClass(row));
                            }}
                        />
                        <div className='mx-3'>
                            <MyButton
                                type='delete'
                                onClick={() => {
                                    dispatch(deleteCreditClass(row.id));
                                }}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default RegisterTableBody;
