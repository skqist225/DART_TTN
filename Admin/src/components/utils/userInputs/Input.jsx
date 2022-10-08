import React from "react";
import ErrorMessage from "../errors/ErrorMessage";

function Input({
    label,
    labelClassName,
    inputClassname,
    error,
    register,
    name,
    type = "text",
    placeholder = "",
    required = true,
    onKeyDown,
}) {
    return (
        <>
            <label
                htmlFor={name}
                className={`${labelClassName} ${error && "text-red-700 dark:text-red-500"}`}
            >
                {label}
            </label>
            <input
                type={type}
                id={name}
                className={`${inputClassname} ${error && "bg-red-50 border border-red-500"}`}
                placeholder={placeholder}
                required={required}
                {...register(name)}
                onKeyDown={onKeyDown}
            />
            {error && <ErrorMessage message={error} />}
        </>
    );
}

export default Input;
