import { Badge } from "flowbite-react";
import React from "react";

function LevelBadge({ level, numberOfQuestions }) {
    return level === "Dễ" ? (
        <Badge color='success'>
            <div className='flex items-center justify-between w-full'>
                <div>{level} </div>
                {numberOfQuestions && <div>{numberOfQuestions}</div>}
            </div>
        </Badge>
    ) : level === "Trung bình" ? (
        <Badge color='warning'>
            <div className='flex items-center justify-between'>
                <div>{level} </div>
                {numberOfQuestions && <div>{numberOfQuestions}</div>}
            </div>
        </Badge>
    ) : (
        <Badge color='failure'>
            <div className='flex items-center justify-between'>
                <div>{level} </div>
                <div
                    className='flex-1 w-full
                '
                ></div>
                {numberOfQuestions && <div>{numberOfQuestions}</div>}
            </div>
        </Badge>
    );
}

export default LevelBadge;
