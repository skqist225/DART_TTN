import React from "react";
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
            <input
                type={type}
                id={name}
                className={`${tailwindCss.input} ${error && "bg-red-50 border border-red-500"} ${
                    readOnly && "disabled:opacity-75"
                }`}
                placeholder={placeholder}
                required={required}
                {...register(name)}
                onKeyDown={onKeyDown}
                readOnly={readOnly}
            />
            {error && <ErrorMessage message={error} />}
        </>
    );
}

export default Input;
