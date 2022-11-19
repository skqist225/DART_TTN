import React, { useEffect } from "react";
import { tailwindCss } from "../../../tailwind";
import ErrorMessage from "../errors/ErrorMessage";

function Select({
    label,
    error,
    register,
    name: propName,
    options,
    defaultValue,
    setValue,
    onChangeHandler,
    width,
    hiddenOption = false,
    multiple = false,
    readOnly = false,
}) {
    useEffect(() => {
        if (setValue && defaultValue) {
            setValue(propName, defaultValue);
        }
    }, [defaultValue]);

    const { onChange, onBlur, name, ref } = register(propName);

    return (
        <>
            <label
                htmlFor={propName}
                className={`${tailwindCss.label} ${error && "text-red-700 dark:text-red-500"}`}
            >
                {!hiddenOption && label}
            </label>
            <select
                id={propName}
                className={`${tailwindCss.select} ${width} ${
                    error && "bg-red-50 border border-red-500"
                }`}
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
                multiple={multiple}
                disabled={readOnly}
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
                        selected={
                            multiple && defaultValue
                                ? defaultValue.includes(parseInt(value))
                                : defaultValue
                                ? value === defaultValue
                                : null
                        }
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
