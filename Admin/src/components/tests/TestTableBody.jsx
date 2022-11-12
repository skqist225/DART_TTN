import React from "react";
import { deleteTest, setEditedTest } from "../../features/testSlice";
import { tailwindCss } from "../../tailwind";
import MyButton from "../common/MyButton";
import { useDispatch } from "react-redux";
import $ from "jquery";

function TestTableBody({ rows, setIsEdit }) {
    const dispatch = useDispatch();

    return (
        <tbody>
            {rows.map(row => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className='py-4 px-6  whitespace-nowrap dark:text-white'>{row.id}</td>
                    <td className='py-4 px-6'>{row.name}</td>
                    <td className='py-4 px-6 flex items-center'>
                        <MyButton
                            type='edit'
                            onClick={() => {
                                $("#subjectModal").css("display", "flex");
                                setIsEdit(true);
                                dispatch(setEditedTest(row));
                            }}
                        />
                        <div className='mx-3'>
                            <MyButton
                                type='delete'
                                onClick={() => {
                                    dispatch(deleteTest(row.id));
                                }}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default TestTableBody;
