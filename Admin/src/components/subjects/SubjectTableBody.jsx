import React from "react";
import { deleteSubject, setEditedSubject } from "../../features/subjectSlice";
import { tailwindCss } from "../../tailwind";
import MyButton from "../../components/common/MyButton";
import $ from "jquery";

function SubjectTableBody({ rows, setIsEdit, dispatch }) {
    return (
        <tbody>
            {rows.map(row => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className='py-4 px-6  whitespace-nowrap dark:text-white'>{row.id}</td>
                    <td className='py-4 px-6'>{row.name}</td>
                    <td className='py-4 px-6'>{row.numberOfTheoreticalPeriods}</td>
                    <td className='py-4 px-6'>{row.numberOfPracticePeriods}</td>
                    <td class='py-4 px-6 flex items-center'>
                        <MyButton
                            type='edit'
                            onClick={() => {
                                $("#subjectModal").css("display", "flex");
                                setIsEdit(true);
                                dispatch(setEditedSubject(row));
                            }}
                        />
                        <div className='mx-3'>
                            <MyButton
                                type='delete'
                                onClick={() => {
                                    dispatch(deleteSubject(row.id));
                                }}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default SubjectTableBody;
