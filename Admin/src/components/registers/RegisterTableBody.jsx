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
                    <td className={cellCss}>{row.id}</td>
                    <td className={cellCss}>{row.schoolYear}</td>
                    <td className={cellCss}>{row.semester}</td>
                    <td className={cellCss}>{row.subject.name}</td>
                    <td className={cellCss}>{row.group}</td>
                    <td className={cellCss}>{row.isCancelled}</td>
                    <td className={cellCss}>{row.teacher.fullName}</td>
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
