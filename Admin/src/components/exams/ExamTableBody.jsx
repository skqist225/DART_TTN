import React from "react";
import { tailwindCss } from "../../tailwind";
import MyButton from "../common/MyButton";
import $ from "jquery";
import { deleteCreditClass, setEditedCreditClass } from "../../features/creditClassSlice";
import { useDispatch } from "react-redux";

function ExamTableBody({ rows, setIsEdit }) {
    const dispatch = useDispatch();
    return (
        <tbody>
            {rows.map(row => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className='py-4 px-6  whitespace-nowrap dark:text-white'>{row.id}</td>
                    <td className='py-4 px-6'>{row.name}</td>
                    <td class='py-4 px-6 flex items-center'>
                        <MyButton
                            type='edit'
                            onClick={() => {
                                $(`#classModal`).css("display", "flex");
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

export default ExamTableBody;
