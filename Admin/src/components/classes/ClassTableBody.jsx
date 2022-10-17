import React from "react";
import { tailwindCss } from "../../tailwind";
import MyButton from "../common/MyButton";
import $ from "jquery";
import { deleteClass, setEditedClass } from "../../features/classSlice";

function ClassTableBody({ rows, setIsEdit, dispatch, modalId }) {
    return (
        <tbody>
            {rows.map(row => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className='p-4 w-4'>
                        <div className='flex items-center'>
                            <input
                                id='checkbox-table-search-1'
                                type='checkbox'
                                className={tailwindCss.checkbox}
                            />
                            <label for='checkbox-table-search-1' className='sr-only'>
                                checkbox
                            </label>
                        </div>
                    </td>
                    <td className='py-4 px-6  whitespace-nowrap dark:text-white'>{row.id}</td>
                    <td className='py-4 px-6'>{row.name}</td>
                    <td class='py-4 px-6 flex items-center'>
                        <MyButton
                            type='edit'
                            onClick={() => {
                                $(`#${modalId}`).css("display", "flex");
                                setIsEdit(true);
                                dispatch(setEditedClass(row));
                            }}
                        />
                        <div className='mx-3'>
                            <MyButton
                                type='delete'
                                onClick={() => {
                                    dispatch(deleteClass(row.id));
                                }}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default ClassTableBody;
