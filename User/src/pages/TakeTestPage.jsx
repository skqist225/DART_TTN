import { Divider } from "@material-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { findTest, handIn, testState } from "../features/testSlice";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import $ from "jquery";
import "./css/taketest.css";

const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
        // Render a completed state
        // return <Completionist />;
    } else {
        // Render a countdown
        return (
            <span>
                {hours}:{minutes}:{seconds}
            </span>
        );
    }
};

ChartJS.register(ArcElement, Tooltip, Legend);

const now = Date.now();

function TakeTestPage() {
    const [questions, setQuestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(1);
    const [answer, setAnswer] = useState(new Map());
    const [resultMode, setResultMode] = useState(false);

    const { testId } = useParams();

    const dispatch = useDispatch();
    const { test } = useSelector(testState);

    useEffect(() => {
        dispatch(findTest({ testId }));
    }, [testId]);

    useEffect(() => {
        if (test.questions && test.questions.length) {
            setQuestions(test.questions.slice(0, 3));
        }
    }, [test.questions]);

    useEffect(() => {
        if (questions && questions.length) {
            questions.forEach(question => {
                if (answer.has(question.id)) {
                    $(`#question-${question.id}-answer${answer.get(question.id)}`).prop(
                        "checked",
                        "true"
                    );
                }
            });
        }
    }, [questions]);

    const data = {
        labels: ["Sai", "Đúng"],
        datasets: [
            {
                label: "# of Votes",
                data: [
                    (test.questions && test.questions.length) || 0 - test.numberOfRightAnswer || 0,
                    test.numberOfRightAnswer || 0,
                ],
                backgroundColor: ["rgb(255, 114, 114)", "rgb(0, 196, 140)"],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <div className='max-w-6xl m-auto'>
                <div></div>
                {test.questions && test.questions.length && (
                    <div className='flex items-start'>
                        <div className='flex-1 w-40 max-w-xs bg-white box-sh p-4 mr-5'>
                            <div className='pb-4'>
                                <div className='flex items-center justify-between'>
                                    <div className='text-xl font-bold text-slate-800'>
                                        {!resultMode ? "Danh sách câu hỏi" : "Kết quả bài thi"}
                                    </div>
                                    {!resultMode ? (
                                        <Countdown
                                            date={now + test.time * 60 * 1000}
                                            className='text-xl'
                                            renderer={renderer}
                                        />
                                    ) : (
                                        <>
                                            <span style={{ color: "#00C48C" }}>
                                                {test.numberOfRightAnswer}
                                            </span>
                                            /14 đáp án đúng
                                        </>
                                    )}
                                </div>
                                <Divider />
                                <div>
                                    <div className='flex items-center justify-between text-sm py-5'>
                                        <div className='flex items-center'>
                                            <div
                                                className='w-4 h-4 rounded-full mr-1'
                                                style={{
                                                    backgroundColor: `${
                                                        !resultMode ? "#f9d2bb" : "#00C48C"
                                                    }`,
                                                }}
                                            ></div>
                                            <span className='answered'>
                                                {!resultMode ? "Đã trả lời" : "Trả lời đúng"}
                                            </span>
                                        </div>
                                        <div className='flex items-center'>
                                            <div
                                                className='w-4 h-4 rounded-full mr-1'
                                                style={{
                                                    backgroundColor: `${
                                                        !resultMode ? "#DEE5EF" : "#ff7272"
                                                    }`,
                                                }}
                                            ></div>
                                            <span className='notanswer'>
                                                {!resultMode ? "Chưa trả lời" : "Trả lời sai"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='text-xs'>bấm vào ô để xem câu hỏi</div>
                                </div>
                                <Divider />
                            </div>
                            <div className='grid grid-cols-3 gap-2 '>
                                {test.questions.map((question, index) => {
                                    let additionalClass = "";
                                    if (resultMode) {
                                        if (question.selectedAnswer === question.finalAnswer) {
                                            additionalClass = "right";
                                        } else {
                                            additionalClass = "wrong";
                                        }
                                    }
                                    return (
                                        <div
                                            id={`question-${question.id}-answer`}
                                            className={`w-10 h-10 text-center rounded-sm cursor-pointer text-base font-semibold flex items-center justify-center question-answer ${additionalClass}`}
                                            style={{
                                                color: "#67758D",
                                                backgroundColor: "rgb(222, 229, 239)",
                                            }}
                                            key={index + 1}
                                            onClick={() => {
                                                if (resultMode) {
                                                    return;
                                                }

                                                let divResult = 0;
                                                let actIndex = 0;

                                                if ((index + 1) % 3 === 1) {
                                                    divResult = Math.round((index + 1) / 3);
                                                    actIndex = index + 1;
                                                } else if ((index + 1) % 3 === 2) {
                                                    divResult = Math.round(index / 3);
                                                    actIndex = index;
                                                } else if ((index + 1) % 3 === 0) {
                                                    divResult = Math.round((index - 1) / 3);
                                                    actIndex = index - 1;
                                                }

                                                const qsts = test.questions.slice(
                                                    divResult * 3,
                                                    divResult * 3 + 3
                                                );

                                                setQuestions(qsts);
                                                setActiveIndex(actIndex);

                                                $(".question-answer").each(function () {
                                                    $(this).removeClass("border");
                                                });
                                                $(`#question-${question.id}-answer`).addClass(
                                                    "border"
                                                );
                                            }}
                                        >
                                            {index + 1}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div
                            className={`flex-1 w-60 bg-white rounded-md p-4 ${
                                resultMode && "col-flex items-center justify-center"
                            }`}
                        >
                            {!resultMode ? (
                                questions.length &&
                                questions.map((question, index) => (
                                    <div key={question.id}>
                                        <p className='text-base pb-4'>
                                            <span>Câu {activeIndex + index}: </span>
                                            {question.content}
                                        </p>
                                        <div className='flex items-center mb-4'>
                                            <input
                                                id={`question-${question.id}-answerA`}
                                                type='radio'
                                                value='A'
                                                name={`question-${question.id}-answer`}
                                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                            />
                                            <label
                                                htmlFor={`question-${question.id}-answer`}
                                                className='ml-2 text-sm hover:font-medium hover:text-sky-600 text-gray-900 dark:text-gray-300 cursor-pointer'
                                                onClick={() => {
                                                    const answerA = $(
                                                        `#question-${question.id}-answerA`
                                                    );

                                                    if (answerA.prop("checked")) {
                                                        answerA.prop("checked", false);

                                                        $(
                                                            `#question-${question.id}-answer`
                                                        ).removeClass("chosen");

                                                        if (answer.has(question.id)) {
                                                            answer.delete(question.id);
                                                            setAnswer(answer);
                                                        }
                                                    } else {
                                                        answerA.prop("checked", "true");

                                                        $(
                                                            `#question-${question.id}-answer`
                                                        ).addClass("chosen");

                                                        setAnswer(
                                                            prev =>
                                                                new Map([
                                                                    ...prev,
                                                                    [question.id, "A"],
                                                                ])
                                                        );
                                                    }
                                                }}
                                            >
                                                A. {question.answerA}
                                            </label>
                                        </div>
                                        <div className='flex items-center mb-4'>
                                            <input
                                                id={`question-${question.id}-answerB`}
                                                type='radio'
                                                value='B'
                                                name={`question-${question.id}-answer`}
                                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                            />
                                            <label
                                                htmlFor={`question-${question.id}-answer`}
                                                className='ml-2 text-sm hover:font-medium hover:text-sky-600 text-gray-900 dark:text-gray-300 cursor-pointer'
                                                onClick={() => {
                                                    const answerB = $(
                                                        `#question-${question.id}-answerB`
                                                    );

                                                    if (answerB.prop("checked")) {
                                                        answerB.prop("checked", false);

                                                        $(
                                                            `#question-${question.id}-answer`
                                                        ).removeClass("chosen");
                                                        if (answer.has(question.id)) {
                                                            answer.delete(question.id);
                                                            setAnswer(answer);
                                                        }
                                                    } else {
                                                        answerB.prop("checked", "true");

                                                        $(
                                                            `#question-${question.id}-answer`
                                                        ).addClass("chosen");
                                                        setAnswer(
                                                            prev =>
                                                                new Map([
                                                                    ...prev,
                                                                    [question.id, "B"],
                                                                ])
                                                        );
                                                    }
                                                }}
                                            >
                                                B. {question.answerB}
                                            </label>
                                        </div>
                                        <div className='flex items-center mb-4'>
                                            <input
                                                id={`question-${question.id}-answerC`}
                                                type='radio'
                                                value='C'
                                                name={`question-${question.id}-answer`}
                                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                            />
                                            <label
                                                htmlFor={`question-${question.id}-answer`}
                                                className='ml-2 text-sm hover:font-medium hover:text-sky-600 text-gray-900 dark:text-gray-300 cursor-pointer'
                                                onClick={() => {
                                                    const answerC = $(
                                                        `#question-${question.id}-answerC`
                                                    );

                                                    if (answerC.prop("checked")) {
                                                        answerC.prop("checked", false);

                                                        $(
                                                            `#question-${question.id}-answer`
                                                        ).removeClass("chosen");
                                                        if (answer.has(question.id)) {
                                                            answer.delete(question.id);
                                                            setAnswer(answer);
                                                        }
                                                    } else {
                                                        answerC.prop("checked", "true");

                                                        $(
                                                            `#question-${question.id}-answer`
                                                        ).addClass("chosen");
                                                        setAnswer(
                                                            prev =>
                                                                new Map([
                                                                    ...prev,
                                                                    [question.id, "C"],
                                                                ])
                                                        );
                                                    }
                                                }}
                                            >
                                                C. {question.answerC}
                                            </label>
                                        </div>
                                        <div className='flex items-center mb-4'>
                                            <input
                                                id={`question-${question.id}-answerD`}
                                                type='radio'
                                                value='D'
                                                name={`question-${question.id}-answer`}
                                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                            />
                                            <label
                                                htmlFor={`question-${question.id}-answer`}
                                                className='ml-2 text-sm hover:font-medium hover:text-sky-600 text-gray-900 dark:text-gray-300 cursor-pointer'
                                                onClick={() => {
                                                    const answerD = $(
                                                        `#question-${question.id}-answerD`
                                                    );

                                                    if (answerD.prop("checked")) {
                                                        answerD.prop("checked", false);

                                                        $(
                                                            `#question-${question.id}-answer`
                                                        ).removeClass("chosen");
                                                        if (answer.has(question.id)) {
                                                            answer.delete(question.id);
                                                            setAnswer(answer);
                                                        }
                                                    } else {
                                                        answerD.prop("checked", "true");

                                                        $(
                                                            `#question-${question.id}-answer`
                                                        ).addClass("chosen");
                                                        setAnswer(
                                                            prev =>
                                                                new Map([
                                                                    ...prev,
                                                                    [question.id, "D"],
                                                                ])
                                                        );
                                                    }
                                                }}
                                            >
                                                D. {question.answerD}
                                            </label>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div
                                    style={{
                                        maxWidth: "350px",
                                        maxHeight: "350px",
                                    }}
                                    className='mb-5 '
                                >
                                    <Doughnut data={data} />
                                </div>
                            )}
                            <Divider />
                            <div className='mt-3'>
                                <button
                                    type='button'
                                    class='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'
                                    onClick={() => {
                                        if (!resultMode) {
                                            dispatch(
                                                handIn({
                                                    testId: test.id,
                                                    answers: answer,
                                                })
                                            );
                                            setResultMode(true);
                                        } else {
                                            window.location.href = `/tests/TRR`;
                                        }
                                    }}
                                >
                                    {!resultMode ? "Nộp bài" : "Làm bài thi khác"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TakeTestPage;
