import React from "react";

function ErrorMessage({ message }) {
    console.log(message);

    return (
        <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
            <span className='font-medium'>{message}</span>
        </p>
    );
}

export default ErrorMessage;
