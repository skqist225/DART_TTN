import React from "react";
import { deleteChapter, setEditedChapter } from "../../features/chapterSlice";
import { tailwindCss } from "../../tailwind";
import MyButton from "../common/MyButton";
import $ from "jquery";
import { useDispatch } from "react-redux";
import { cellCss } from "../questions/QuestionTableBody";

function ChapterTableBody({ rows, setIsEdit }) {
    const dispatch = useDispatch();

    return (
        <tbody>
            {rows.map(row => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className={cellCss}>{row.id}</td>
                    <td className={cellCss}>{row.name}</td>
                    <td className={cellCss}>{row.subject.name}</td>
                    <td className={`${cellCss} flex items-center`}>
                        <MyButton
                            type='edit'
                            onClick={() => {
                                $("#chapterModal").css("display", "flex");
                                setIsEdit(true);
                                dispatch(setEditedChapter(row));
                            }}
                        />
                        <div className='mx-3'>
                            <MyButton
                                type='delete'
                                onClick={() => {
                                    dispatch(deleteChapter(row.id));
                                }}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default ChapterTableBody;
