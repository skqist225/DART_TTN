import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Divider } from "@material-ui/core";
import Countdown from "react-countdown";
import { handIn, testState } from "../../features/testSlice";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import $ from "jquery";
import "./css/taketest.css";
import { examState, fetchAllExams } from "../../features/examSlice";
import { persistUserState } from "../../features/persistUserSlice";
import { Answer, Input, Select } from "../../components";
import { useForm } from "react-hook-form";
import { Button } from "flowbite-react";
import { getQuestions, questionState, setTestedQuestions } from "../../features/questionSlice";
import { lookupIndex } from "../../components/questions/QuestionModalBody";
import { tailwindCss } from "../../tailwind";

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
    const [doTest, setDoTest] = useState(false);
    const [time, setTime] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(1);
    const [tempQstId, setTempQstId] = useState(0);
    const [finalAnswer, setFinalAnswer] = useState(new Map());
    const [resultMode, setResultMode] = useState(false);
    const [examId, setExamId] = useState(0);
    const [qsts, setQsts] = useState([]);
    const { user } = useSelector(persistUserState);
    const { exams } = useSelector(examState);
    const { test } = useSelector(testState);
    const { testedQuestions } = useSelector(questionState);

    const dispatch = useDispatch();
    const questionPerPage = 4;

    const { register } = useForm({});

    useEffect(() => {
        dispatch(fetchAllExams({ page: 0, student: user.id, taken: "get" }));
    }, []);

    useEffect(() => {
        if (testedQuestions && testedQuestions.length) {
            setQuestions(testedQuestions.slice(0, questionPerPage));
            setQsts(testedQuestions);
        }
    }, [testedQuestions]);

    useEffect(() => {
        if (questions && questions.length) {
            questions.forEach(question => {
                if (finalAnswer.has(question.id)) {
                    $(`#question-${question.id}-answer${finalAnswer.get(question.id)}`).prop(
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
                data: [test.numberOfQuestions - test.numberOfRightAnswer, test.numberOfRightAnswer],
                backgroundColor: ["rgb(255, 114, 114)", "rgb(0, 196, 140)"],
                borderWidth: 1,
            },
        ],
    };

    useEffect(() => {
        if (resultMode && test && test.questions) {
            setQsts(test.questions);
        }
    }, [resultMode, test]);

    function handleChangeQuestionPage(index, questionId) {
        if (resultMode) {
            return;
        }

        let divResult = 0;
        let actIndex = 0;
        // base 1
        let baseIndex = index + 1;

        if (baseIndex % questionPerPage === 1) {
            divResult = Math.round(baseIndex / questionPerPage);
            actIndex = baseIndex;
        } else if (baseIndex % questionPerPage === 2) {
            divResult = Math.round((baseIndex - 1) / questionPerPage);
            actIndex = baseIndex - 1;
        } else if (baseIndex % questionPerPage === 3) {
            divResult = Math.round((baseIndex - 2) / questionPerPage);
            actIndex = baseIndex - 2;
        } else if (baseIndex % questionPerPage === 0) {
            divResult = Math.round((baseIndex - 3) / questionPerPage);
            actIndex = baseIndex - 3;
        }

        const qsts = testedQuestions.slice(
            divResult * questionPerPage,
            divResult * questionPerPage + questionPerPage
        );

        setQuestions(qsts);
        setActiveIndex(actIndex);

        $(".question-answer").each(function () {
            $(this).removeClass("border up");
        });
        if (questionId) {
            $(`#question-${questionId}-answer`).addClass("border up");
        }
    }

    return (
        <div>
            <div className='max-w-6xl m-auto'>
                {doTest ? (
                    testedQuestions.length && (
                        <div className='flex items-start'>
                            <div className='flex-1 w-40 max-w-xs bg-white box-sh p-4 mr-5'>
                                <div className='pb-4'>
                                    <div className='flex items-center justify-between'>
                                        <div className='text-xl font-bold text-slate-800'>
                                            {!resultMode ? "Danh sách câu hỏi" : "Kết quả bài thi"}
                                        </div>
                                        {!resultMode ? (
                                            <Countdown
                                                date={now + time * 60 * 1000}
                                                className='text-xl'
                                                renderer={renderer}
                                            />
                                        ) : (
                                            <>
                                                <span style={{ color: "#00C48C" }}>
                                                    {test.numberOfRightAnswer}
                                                </span>
                                                /{test.numberOfQuestions} đáp án đúng
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
                                <div className={`grid grid-cols-${questionPerPage} gap-2`}>
                                    {qsts.map((question, index) => {
                                        let additionalClass = "";
                                        if (resultMode) {
                                            if (!question.selectedAnswer) {
                                                additionalClass = "wrong wrong2";
                                            } else {
                                                if (question.type === "Nhiều đáp án") {
                                                    if (
                                                        question.selectedAnswer
                                                            .replace(/,/g, "")
                                                            .toString() ===
                                                        question.finalAnswer.toString()
                                                    ) {
                                                        additionalClass = "right right2";
                                                    } else {
                                                        additionalClass = "wrong wrong2";
                                                    }
                                                } else {
                                                    if (
                                                        question.selectedAnswer.toString() ===
                                                        question.finalAnswer.toString()
                                                    ) {
                                                        additionalClass = "right right2";
                                                    } else {
                                                        additionalClass = "wrong wrong2";
                                                    }
                                                }
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
                                                key={question.id + 1}
                                                onClick={() => {
                                                    handleChangeQuestionPage(question.id, index);
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
                                            <p className='text-base pb-4 font-bold'>
                                                <span>Câu {activeIndex + index}: </span>
                                                {question.content}
                                            </p>
                                            {question.type === "Đáp án điền" ? (
                                                <>
                                                    <Input
                                                        id={`question-${question.id}-answer`}
                                                        register={register}
                                                        name={`question-${question.id}-answer`}
                                                    />
                                                </>
                                            ) : (
                                                question.answers.map((answer, index) => {
                                                    return (
                                                        <Answer
                                                            answer={answer}
                                                            question={question}
                                                            register={register}
                                                            finalAnswer={finalAnswer}
                                                            setFinalAnswer={setFinalAnswer}
                                                            index={index}
                                                            type={question.type}
                                                        />
                                                    );
                                                })
                                            )}
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
                                        className={tailwindCss.radiantButton}
                                        onClick={() => {
                                            if (!resultMode) {
                                                dispatch(
                                                    handIn({
                                                        exam: examId,
                                                        answers: finalAnswer,
                                                    })
                                                );
                                                setResultMode(true);
                                            } else {
                                                window.location.href = `/takeTest`;
                                            }
                                        }}
                                    >
                                        {!resultMode ? "Nộp bài" : "Làm bài thi khác"}
                                    </button>
                                    {resultMode ? (
                                        <button
                                            type='button'
                                            className={tailwindCss.radiantButton}
                                            onClick={() => {}}
                                        >
                                            Xem chi tiết bài thi
                                        </button>
                                    ) : (
                                        testedQuestions.length !== activeIndex && (
                                            <button
                                                type='button'
                                                className={tailwindCss.radiantButton}
                                                onClick={() => {
                                                    handleChangeQuestionPage(activeIndex + 4);
                                                }}
                                            >
                                                "Trang kế
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    <div
                        style={{ width: "100vw", height: "100vh", margin: "auto", maxWidth: "80%" }}
                        className='col-flex items-center justify-center'
                    >
                        <div className='mb-5 w-full'>
                            <Select
                                label={"Chọn ca thi"}
                                name='examSelected'
                                register={register}
                                options={exams.map(({ id, name }) => ({
                                    title: name,
                                    value: id,
                                }))}
                                // onChangeHandler={handleCreditClassChange}
                            />
                        </div>
                        <Button
                            onClick={() => {
                                const examId = $("#examSelected").val();
                                dispatch(getQuestions({ exam: examId }));
                                setDoTest(true);
                                setExamId(parseInt(examId));
                                const exam = exams.find(
                                    ({ id }) => id.toString() === examId.toString()
                                );
                                setTime(exam.time);
                            }}
                        >
                            Làm bài
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TakeTestPage;
