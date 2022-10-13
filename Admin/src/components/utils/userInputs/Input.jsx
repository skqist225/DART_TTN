import React from "react";
import { EmailIcon } from "../../../images";
import { tailwindCss } from "../../../tailwind";
import ErrorMessage from "../errors/ErrorMessage";

function Input({
    label,
    error,
    register,
    name,
    type = "text",
    placeholder = "",
    required = true,
    onKeyDown,
    readOnly,
}) {
    return (
        <>
            <label
                htmlFor={name}
                className={`${tailwindCss.label} ${error && "text-red-700 dark:text-red-500"}`}
            >
                {label}
            </label>
            {type === "email" ? (
                <div className='relative'>
                    <div class='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                        <EmailIcon />
                    </div>
                    <input
                        type='text'
                        id='input-group-1'
                        class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        placeholder='name@flowbite.com'
                    />
                </div>
            ) : (
                <input
                    type={type}
                    id={name}
                    className={`${tailwindCss.input} ${
                        error && "bg-red-50 border border-red-500"
                    } ${readOnly && "disabled:opacity-75"}`}
                    placeholder={placeholder}
                    required={required}
                    {...register(name)}
                    onKeyDown={onKeyDown}
                    readOnly={readOnly}
                />
            )}
            {error && <ErrorMessage message={error} />}
        </>
    );
}

export default Input;
