import React from "react";
import ErrorMessage from "./ErrorMessage";

function Select({ label, labelClassName, selectClassName, error, register, name, options }) {
    return (
        <>
            <label
                htmlFor={name}
                className={`${labelClassName} ${error && "text-red-700 dark:text-red-500"}`}
            >
                {label}
            </label>
            <select
                id={name}
                className={`${selectClassName} ${error && "bg-red-50 border border-red-500"}`}
                {...register(name)}
                defaultValue=''
            >
                {options.map(({ value, title }) => (
                    <option value={value} key={value}>
                        {title}
                    </option>
                ))}
            </select>
            {error && <ErrorMessage message={error.message} />}
        </>
    );
}

export default Select;
