import React from "react";
import { EmailIcon } from "../../../images";
import { tailwindCss } from "../../../tailwind";
import ErrorMessage from "../errors/ErrorMessage";

function Input({
    label,
    error,
    register,
    name: propName,
    type = "text",
    placeholder = "",
    required = false,
    onKeyDown,
    readOnly,
    onChangeHandler,
}) {
    const { onChange, onBlur, name, ref } = register(propName);

    return (
        <>
            <label
                htmlFor={propName}
                className={`${tailwindCss.label} ${error && "text-red-700 dark:text-red-500"} ${
                    readOnly && "text-slate-400	"
                }`}
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
                    id={propName}
                    className={`${type === "email" ? tailwindCss.inputEmail : tailwindCss.input} ${
                        error && "bg-red-50 border border-red-500"
                    } ${readOnly && "disabled:opacity-75"}`}
                    placeholder={placeholder}
                    required={required}
                    name={name}
                    onChange={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        onChange(e);
                        if (onChangeHandler) {
                            onChangeHandler(e);
                        }
                    }}
                    onBlur={onBlur}
                    ref={ref}
                    onKeyDown={onKeyDown}
                    readOnly={readOnly}
                    autoComplete={type === "password" ? "new-password" : "off"}
                    disabled={readOnly}
                />
            </div>
            {error && <ErrorMessage message={error} />}
        </>
    );
}

export default Input;
