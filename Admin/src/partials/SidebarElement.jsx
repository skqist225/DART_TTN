import React from "react";
import { NavLink } from "react-router-dom";

//rfce
function SidebarElement({ pathname, name, title, icon }) {
    return (
        <li
            className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                pathname.includes(name) && "bg-slate-900"
            }`}
        >
            <NavLink
                end
                to='/subjects'
                className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                    pathname.includes(name) && "hover:text-slate-200"
                }`}
            >
                <div className='flex items-center'>
                    <svg className='shrink-0 h-6 w-6' viewBox='0 0 24 24'>
                        <path
                            className={`fill-current text-slate-600 ${
                                pathname.includes(name) && "text-indigo-500"
                            }`}
                            d='M8 1v2H3v19h18V3h-5V1h7v23H1V1z'
                        />
                        <path
                            className={`fill-current text-slate-600 ${
                                pathname.includes(name) && "text-indigo-500"
                            }`}
                            d='M1 1h22v23H1z'
                        />
                        <path
                            className={`fill-current text-slate-400 ${
                                pathname.includes(name) && "text-indigo-300"
                            }`}
                            d='M15 10.586L16.414 12 11 17.414 7.586 14 9 12.586l2 2zM5 0h14v4H5z'
                        />
                    </svg>
                    <span className='text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                        {title}
                    </span>
                </div>
            </NavLink>
        </li>
    );
}

export default SidebarElement;
