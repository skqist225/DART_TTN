import React, { useEffect, useState } from "react";
import { EmailIcon } from "../../../images";
import { tailwindCss } from "../../../tailwind";
import ErrorMessage from "../errors/ErrorMessage";
import $ from "jquery";

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

    useEffect(() => {
        if (type === "password") {
            const passwordToggle = $(".js-password-toggle");

            passwordToggle.on("change", function (e) {
                e.preventDefault();
                const password = $("#" + propName);
                const passwordLabel = $(".js-password-label");

                console.log(password.prop("type"));
                if (password.prop("type") === "password") {
                    password.prop("type", "text");
                    passwordLabel.text("hide");
                } else {
                    password.prop("type", "password");
                    passwordLabel.text("show");
                }

                password.focus();
            });
        }
    }, []);

    return (
        <>
            <label
                htmlFor={propName}
                className={`${tailwindCss.label} ${error && "text-red-700 dark:text-red-500"} ${
                    readOnly && "text-slate-400	cursor-not-allowed"
                }`}
            >
                {label}
            </label>

            <div className='relative'>
                {type === "email" && (
                    <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                        <EmailIcon />
                    </div>
                )}
                {type === "password" && (
                    <div className='absolute inset-y-0 right-0 flex items-center px-2'>
                        <input className='hidden js-password-toggle' id='toggle' type='checkbox' />
                        <label
                            className='bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer js-password-label'
                            htmlFor='toggle'
                        >
                            show
                        </label>
                    </div>
                )}
                <input
                    type={type}
                    id={propName}
                    className={`${type === "email" ? tailwindCss.inputEmail : tailwindCss.input} ${
                        error && "bg-red-50 border border-red-500"
                    } ${readOnly && "disabled:opacity-75 cursor-not-allowed"}`}
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
                    min={0}
                />
            </div>
            {error && <ErrorMessage message={error} />}
        </>
    );
}

export default Input;
