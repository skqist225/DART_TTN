import React from "react";
import { SortableIcon } from "../../../images";
import { tailwindCss } from "../../../tailwind";

function TableHeader({ columns }) {
    return (
        <thead className={tailwindCss.thead}>
            <tr>
                <th scope='col' className='p-4'>
                    <div className='flex items-center'>
                        <input
                            id='checkbox-all-search'
                            type='checkbox'
                            className={tailwindCss.checkbox}
                        />
                        <label for='checkbox-all-search' className='sr-only'>
                            checkbox
                        </label>
                    </div>
                </th>
                {columns.map(({ name, sortable }) => (
                    <th scope='col' className='py-3 px-6'>
                        {!sortable ? (
                            name
                        ) : (
                            <div className='flex items-center'>
                                {name}
                                <a href='#'>
                                    <SortableIcon />
                                </a>
                            </div>
                        )}
                    </th>
                ))}
            </tr>
        </thead>
    );
}

export default TableHeader;
