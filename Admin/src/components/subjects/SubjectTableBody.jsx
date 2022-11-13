import React from "react";
import { deleteSubject, setEditedSubject } from "../../features/subjectSlice";
import { tailwindCss } from "../../tailwind";
import MyButton from "../../components/common/MyButton";
import $ from "jquery";
import { useDispatch } from "react-redux";
import { cellCss } from "../questions/QuestionTableBody";

function SubjectTableBody({ rows, setIsEdit }) {
    const dispatch = useDispatch();
    return (
        <tbody>
            {rows.map(row => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className={cellCss}>{row.id}</td>
                    <td className={cellCss}>{row.name}</td>
                    <td className={cellCss}>{row.numberOfTheoreticalPeriods}</td>
                    <td className={cellCss}>{row.numberOfPracticePeriods}</td>
                    <td className={cellCss}>{row.chapters.length}</td>
                    <td className={cellCss}>{row.numberOfTests}</td>
                    <td className={cellCss}>{row.numberOfQuestions}</td>
                    <td class={`${cellCss} flex items-center`}>
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
