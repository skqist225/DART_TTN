import React, { useEffect } from "react";
import { useState } from "react";
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { findTest, testState } from "../features/testSlice";

function TakeTestPage() {
    const [questions, setQuestions] = useState([]);
    const { testId } = useParams();

    const dispatch = useDispatch();
    const { test } = useSelector(testState);

    useEffect(() => {
        dispatch(findTest({ testId }));
    }, []);

    useEffect(() => {
        if (test.questions && test.questions.length) {
            setQuestions(test.questions.slice(0, 3));
        }
    }, [test.questions]);

    return (
        <div>
            <div>
                <div></div>
                {test.questions && test.questions.length && (
                    <div className='flex items-start'>
                        <div className='flex-1 w-40'>
                            <div className='flex items-center justify-between'>
                                <div>Danh sách câu hỏi</div>
                                <Countdown date={Date.now() + 10000} />
                            </div>
                            <div></div>
                            <div className='grid grid-cols-4 gap-2'>
                                {Array.from({ length: test.questions.length }).map(
                                    (value, index) => (
                                        <div
                                            className='w-10 h-10 text-center rounded-sm cursor-pointer text-base font-semibold flex items-center justify-center'
                                            style={{ color: "#67758D", backgroundColor: "#F6F9FC" }}
                                            key={index + 1}
                                            onClick={() => {
                                                const divResult = (index + 1) / 3;
                                                if (
                                                    (index + 1) % 3 === 1 &&
                                                    index + 1 !== test.questions.length
                                                ) {
                                                    setQuestions(
                                                        test.questions.slice(
                                                            divResult * 3,
                                                            divResult * 3 + 3
                                                        )
                                                    );
                                                }
                                            }}
                                        >
                                            {index + 1}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className='flex-1 w-60'>
                            {questions.length &&
                                questions.map((question, index) => (
                                    <div>
                                        <span id='question_number'></span>
                                        <p>{question.content}</p>
                                        <div class='flex items-center mb-4'>
                                            <input
                                                id='default-radio-1'
                                                type='radio'
                                                value=''
                                                name='default-radio'
                                                class='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                            />
                                            <label
                                                for='default-radio-1'
                                                class='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                                            >
                                                {question.answerA}
                                            </label>
                                        </div>
                                        <div class='flex items-center mb-4'>
                                            <input
                                                id='default-radio-1'
                                                type='radio'
                                                value=''
                                                name='default-radio'
                                                class='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                            />
                                            <label
                                                for='default-radio-1'
                                                class='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                                            >
                                                {question.answerB}
                                            </label>
                                        </div>
                                        <div class='flex items-center mb-4'>
                                            <input
                                                id='default-radio-1'
                                                type='radio'
                                                value=''
                                                name='default-radio'
                                                class='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                            />
                                            <label
                                                for='default-radio-1'
                                                class='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                                            >
                                                {question.answerC}
                                            </label>
                                        </div>
                                        <div class='flex items-center mb-4'>
                                            <input
                                                id='default-radio-1'
                                                type='radio'
                                                value=''
                                                name='default-radio'
                                                class='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                            />
                                            <label
                                                for='default-radio-1'
                                                class='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                                            >
                                                {question.answerD}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TakeTestPage;
