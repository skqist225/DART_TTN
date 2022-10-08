import React from "react";
import { tailwindCss } from "../../../tailwind";
import { MyButton } from "../../common";

function TableBody({ rows }) {
    return (
        <tbody>
            {rows.map(row => (
                <tr className={tailwindCss.tr}>
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
                    <th
                        scope='row'
                        className='flex items-center py-4 px-6 text-gray-900 whitespace-nowrap dark:text-white'
                    >
                        {row.id}
                    </th>
                    <td className='py-4 px-6'>{row.name}</td>
                    <td class='py-4 px-6'>
                        <MyButton type='edit' />
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default TableBody;
