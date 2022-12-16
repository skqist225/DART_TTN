import React from "react";
import { tailwindCss } from "../../tailwind";

function AnswerList({ answers, quesitonContent }) {
    return (
        <div className='w-full p-4 rounded-lg border-gray-400 border-2'>
            <div>{quesitonContent}</div>
            {answers.map(answer => (
                <div className='flex items-start my-2' key={answer.id}>
                    <label
                        className={`${tailwindCss.radioButtonLabel} ${
                            answer.answer && "text-green-600"
                        }`}
                    >
                        {answer.order}. {answer.content}
                    </label>
                </div>
            ))}
        </div>
    );
}

export default AnswerList;
