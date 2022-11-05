import React from "react";
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
    onChangeHandler,
    hiddenOption = false,
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

    return (
        <>
            <label
                htmlFor={propName}
                className={`${labelClassName} ${error && "text-red-700 dark:text-red-500"}`}
            >
                {!hiddenOption && label}
            </label>
            <select
                id={propName}
                className={`${selectClassName} ${error && "bg-red-50 border border-red-500"}`}
                name={name}
                onChange={e => {
                    onChange(e);
                    if (onChangeHandler) {
                        onChangeHandler(e);
                    }
                }}
                onBlur={onBlur}
                ref={ref}
            >
                {hiddenOption && (
                    <option value='' disabled selected style={{ display: "none" }}>
                        Chọn {label}
                    </option>
                )}

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
