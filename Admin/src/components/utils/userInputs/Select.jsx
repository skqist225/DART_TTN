import React from "react";
import { useDispatch } from "react-redux";
import { fetchAllQuestions } from "../../../features/questionSlice";
import ErrorMessage from "../errors/ErrorMessage";

function Select({
    label,
    labelClassName,
    selectClassName,
    error,
    register,
    name: propName,
    options,
    defaultValue,
    setValue,
}) {
    if (setValue) {
        if (defaultValue) {
            setValue(propName, defaultValue);
        } else {
            if (options[0] && options[0].value) {
                setValue(propName, options[0].value);
            }
        }
    }

    const { onChange, onBlur, name, ref } = register(propName);
    const dispatch = useDispatch();

    return (
        <>
            <label
                htmlFor={propName}
                className={`${labelClassName} ${error && "text-red-700 dark:text-red-500"}`}
            >
                {label}
            </label>
            <select
                id={propName}
                className={`${selectClassName} ${error && "bg-red-50 border border-red-500"}`}
                name={name}
                onChange={e => {
                    onChange(e);
                }}
                onBlur={onBlur}
                ref={ref}
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
            {error && <ErrorMessage message={error} />}
        </>
    );
}

export default Select;
