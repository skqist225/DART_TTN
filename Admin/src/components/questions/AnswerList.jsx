import React from "react";
import { tailwindCss } from "../../tailwind";

function AnswerList({ answers }) {
    return (
        <>
            {answers.map(answer => (
                <div className='flex items-start mb-4'>
                    <label
                        className={`${tailwindCss.radioButtonLabel} ${
                            answer.answer && "text-green-600"
                        }`}
                    >
                        {answer.order}. {answer.content}
                    </label>
                </div>
            ))}
        </>
    );
}

export default AnswerList;
