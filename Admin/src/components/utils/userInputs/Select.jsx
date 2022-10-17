import React from "react";
import ErrorMessage from "../errors/ErrorMessage";

function Select({
    label,
    labelClassName,
    selectClassName,
    error,
    register,
    name,
    options,
    defaultValue,
    setValue,
}) {
    if (setValue) {
        if (defaultValue) {
            setValue(name, defaultValue);
        } else {
            if (options[0] && options[0].value) {
                setValue(name, options[0].value);
            }
        }
    }

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
            >
                {options.map(({ value, title }) => (
                    <option
                        value={value}
                        key={value}
                        selected={defaultValue ? value === defaultValue : null}
                    >
                        {title}
                    </option>
                ))}
            </select>
            {error && <ErrorMessage message={error.message} />}
        </>
    );
}

export default Select;
