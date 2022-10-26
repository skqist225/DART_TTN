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
    required = false,
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

            <div className='relative'>
                {type === "email" && (
                    <div class='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                        <EmailIcon />
                    </div>
                )}
                <input
                    type={type}
                    id={name}
                    className={`${type === "email" ? tailwindCss.inputEmail : tailwindCss.input} ${
                        error && "bg-red-50 border border-red-500"
                    } ${readOnly && "disabled:opacity-75"}`}
                    placeholder={placeholder}
                    required={required}
                    {...register(name)}
                    onKeyDown={onKeyDown}
                    readOnly={readOnly}
                    autocomplete={type === "password" ? "new-password" : "off"}
                />
            </div>
            {error && <ErrorMessage message={error} />}
        </>
    );
}

export default Input;
