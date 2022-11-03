import React from "react";
import { deleteChapter, setEditedChapter } from "../../features/chapterSlice";
import { tailwindCss } from "../../tailwind";
import MyButton from "../common/MyButton";
import $ from "jquery";

function ChapterTableBody({ rows, setIsEdit, dispatch }) {
    return (
        <tbody>
            {rows.map(row => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className='py-4 px-6  whitespace-nowrap dark:text-white'>{row.id}</td>
                    <td className='py-4 px-6'>{row.name}</td>
                    <td className='py-4 px-6'>{row.subject.name}</td>
                    <td class='py-4 px-6 flex items-center'>
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
