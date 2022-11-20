import React from "react";
import { NavLink } from "react-router-dom";

//rfce
function SidebarElement({ pathname, name, title, Icon }) {
    return (
        <li
            className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                pathname.includes(name) && "bg-white"
            }`}
        >
            <NavLink
                end
                to={`/${name}`}
                className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                    pathname.includes(name) && "text-black hover:text-black"
                }`}
            >
                <div className='flex items-center'>
                    <img src={Icon} width='30px' height='30px' />
                    <span className='text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200'>
                        {title}
                    </span>
                </div>
            </NavLink>
        </li>
    );
}

export default SidebarElement;
