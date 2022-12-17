import React, { useEffect, useRef, useState } from "react";
import { tailwindCss } from "../../tailwind";
import Transition from "../../utils/Transition";

function Help({ helperText = "", children }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const trigger = useRef(null);
    const dropdown = useRef(null);

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (
                !dropdownOpen ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setDropdownOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    return (
        <div className='relative inline-flex'>
            <button
                ref={trigger}
                className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition duration-150 rounded-full ${
                    dropdownOpen && "bg-slate-200"
                }`}
                aria-haspopup='true'
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                type='button'
            >
                <span className='sr-only'>Need help?</span>
                <svg className='w-4 h-4' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'>
                    <path
                        className='fill-current text-slate-500'
                        d='M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z'
                    />
                </svg>
                <Transition
                    className='origin-top-right z-10 absolute top-full right-0 min-w-44 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1'
                    show={dropdownOpen}
                    enter='transition ease-out duration-200 transform'
                    enterStart='opacity-0 -translate-y-2'
                    enterEnd='opacity-100 translate-y-0'
                    leave='transition ease-out duration-200'
                    leaveStart='opacity-100'
                    leaveEnd='opacity-0'
                >
                    <div
                        ref={dropdown}
                        onFocus={() => setDropdownOpen(true)}
                        onBlur={() => setDropdownOpen(false)}
                        className='w-80'
                    >
                        {helperText && (
                            <>
                                {" "}
                                <div className='text-xs font-semibold text-slate-400 uppercase pt-1.5 pb-2 px-4'>
                                    {helperText.split("::")[0]}
                                </div>
                                <ul>
                                    {helperText
                                        .split("::")[1]
                                        .split(",")
                                        .map(text => (
                                            <li
                                                key={text}
                                                className={tailwindCss.tableCell + " uppercase"}
                                            >
                                                {text.charAt(0).toUpperCase() + text.slice(1)}
                                            </li>
                                        ))}
                                </ul>
                            </>
                        )}
                        {children && children}
                    </div>
                </Transition>
            </button>
        </div>
    );
}

export default Help;
