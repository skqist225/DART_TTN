import React from "react";

function ErrorMessage({ message }) {
    return (
        <p class='mt-2 text-sm text-red-600 dark:text-red-500'>
            <span class='font-medium'>{message}</span>
        </p>
    );
}

export default ErrorMessage;
