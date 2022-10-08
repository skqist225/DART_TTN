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
                class={`${inputClassname} ${error && "bg-red-50 border border-red-500"}`}
                placeholder={placeholder}
                required={required}
                {...register(name)}
            />
            {error && <ErrorMessage message={error.message} />}
        </>
    );
}

export default Input;
