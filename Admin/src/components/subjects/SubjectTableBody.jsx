import React from "react";
import { deleteSubject, setEditedSubject } from "../../features/subjectSlice";
import { tailwindCss } from "../../tailwind";
import MyButton from "../../components/common/MyButton";
import $ from "jquery";
import { useDispatch } from "react-redux";

function SubjectTableBody({ rows, setIsEdit }) {
    const dispatch = useDispatch();
    return (
        <tbody>
            {rows.map(row => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className='py-4 px-6  whitespace-nowrap dark:text-white'>{row.id}</td>
                    <td className='py-4 px-6'>{row.name}</td>
                    <td className='py-4 px-6'>{row.numberOfTheoreticalPeriods}</td>
                    <td className='py-4 px-6'>{row.numberOfPracticePeriods}</td>
                    <td className='py-4 px-6'>{row.chapters.length}</td>
                    <td className='py-4 px-6'>{row.numberOfTests}</td>
                    <td className='py-4 px-6'>{row.numberOfQuestions}</td>
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
