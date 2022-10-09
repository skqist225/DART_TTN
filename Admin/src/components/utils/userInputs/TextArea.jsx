import React from "react";
import ErrorMessage from "../errors/ErrorMessage";

function TextArea({ label, labelClassName, textAreaClassName, error, register, name, rows = "2" }) {
    return (
        <>
            <label
                htmlFor={name}
                className={`${labelClassName} ${error && "text-red-700 dark:text-red-500"}`}
            >
                {label}
            </label>
            <textarea
                id={name}
                rows={rows}
                className={`${textAreaClassName} ${error && "bg-red-50 border border-red-500"}`}
                {...register(name)}
            ></textarea>
            {error && <ErrorMessage message={error.message} />}
        </>
    );
}

export default TextArea;
