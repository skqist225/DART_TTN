import React, { useEffect, useState } from "react";
import { Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Answer, Input } from "../../components";
import { lookupIndex } from "../../components/questions/QuestionModalBody";
import MyDrawer from "../../components/takeTests/MyDrawer";
import { persistUserState } from "../../features/persistUserSlice";
import { findByStudentAndExam, takeExamState } from "../../features/takeExamSlice";
import { tailwindCss } from "../../tailwind";
import { isAnswerRight } from "./TakeTestPage";
import "./css/taketest.css";

function ViewExamDetailPage() {
    const dispatch = useDispatch();
    const { examId } = useParams();

    const [questions, setQuestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(1);
    const [qsts, setQsts] = useState([]);
    const { user } = useSelector(persistUserState);

    const { fakeHandInDTO } = useSelector(takeExamState);
    const questionPerPage = 4;
    const { register, setValue } = useForm({});
    useEffect(() => {
        dispatch(findByStudentAndExam({ studentId: user.id, examId }));
    }, []);

    useEffect(() => {
        if (fakeHandInDTO && fakeHandInDTO.questions) {
            setQuestions(fakeHandInDTO.questions.slice(0, questionPerPage));
            setQsts(fakeHandInDTO.questions);
        }
    }, [fakeHandInDTO]);

    function handleChangeQuestionPage(index, questionId) {
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
        let qstss = [];
        qstss = qsts.slice(
            divResult * questionPerPage,
            divResult * questionPerPage + questionPerPage
        );

        setQuestions(qstss);
        setActiveIndex(actIndex);

        $(".question-answer").each(function () {
            $(this).removeClass("border up");
        });
        if (questionId) {
            $(`#question-${questionId}-answer`).addClass("border up");
        }
    }

    return (
        <div style={{ width: "1280px", margin: "auto", maxWidth: "90%" }}>
            {fakeHandInDTO && fakeHandInDTO.questions && (
                <div>
                    <div className='flex items-start'>
                        <div className='flex-1 w-40 max-w-xs bg-white box-sh p-4 mr-5'>
                            <MyDrawer
                                label='Xem thông tin thi'
                                Children={
                                    <Card>
                                        <div className='flex items-start justify-between w-2/4 m-auto'>
                                            <div>
                                                <div>Họ và tên: {user.fullName}</div>
                                                <div>MSSV: {user.id}</div>
                                                <div>Môn học: {fakeHandInDTO.subjectName}</div>
                                                <div>Loại thi: {fakeHandInDTO.examType}</div>
                                            </div>
                                            <div>
                                                <div>Ngày thi: {fakeHandInDTO.examDate}</div>
                                                <div>
                                                    Tiết báo danh: {fakeHandInDTO.noticePeriod}
                                                </div>
                                                <div>
                                                    Thời gian làm bài: {fakeHandInDTO.examTime} phút
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                }
                            />
                            <div className='pb-4'>
                                <div>
                                    <div className='flex items-center justify-between text-sm py-5'>
                                        <div className='flex items-center'>
                                            <div
                                                className='w-4 h-4 rounded-full mr-1'
                                                style={{
                                                    backgroundColor: "#00C48C",
                                                }}
                                            ></div>
                                            <span className='answered'>Trả lời đúng</span>
                                        </div>
                                        <div className='flex items-center'>
                                            <div
                                                className='w-4 h-4 rounded-full mr-1'
                                                style={{
                                                    backgroundColor: "#ff7272",
                                                }}
                                            ></div>
                                            <span className='notanswer'>Trả lời sai</span>
                                        </div>
                                    </div>
                                    <div className='text-xs'>bấm vào ô để xem câu hỏi</div>
                                </div>
                                <Divider />
                            </div>
                            <div className={`grid grid-cols-${questionPerPage} gap-2`}>
                                {qsts.map((question, index) => {
                                    let additionalClass = "";

                                    if (
                                        isAnswerRight(
                                            question.selectedAnswer,
                                            question.finalAnswer,
                                            question.type
                                        )
                                    ) {
                                        additionalClass = "right right2";
                                    } else {
                                        additionalClass = "wrong wrong2";
                                    }

                                    return (
                                        <div
                                            id={`question-${question.id}-answer`}
                                            className={`w-10 h-10 text-center rounded-sm cursor-pointer text-base font-semibold flex items-center justify-center question-answer ${additionalClass}`}
                                            style={{
                                                color: "#67758D",
                                                backgroundColor: "rgb(222, 229, 239)",
                                            }}
                                            key={question.id}
                                            onClick={() => {
                                                handleChangeQuestionPage(index, question.id);
                                            }}
                                        >
                                            {index + 1}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div
                            className={`flex-1 w-60 bg-white rounded-md p-4 col-flex items-center justify-center`}
                        >
                            {questions.length &&
                                questions.map((question, index) => {
                                    let additionalClass = "";
                                    let isRight = false;
                                    if (
                                        isAnswerRight(
                                            question.selectedAnswer,
                                            question.finalAnswer,
                                            question.type
                                        )
                                    ) {
                                        additionalClass = "text-emerald-600";
                                        isRight = true;
                                    } else {
                                        additionalClass = "text-rose-600";
                                        isRight = false;
                                    }

                                    if (question.type === "Đáp án điền") {
                                        setValue(
                                            `question-${question.id}-answer`,
                                            question.finalAnswer
                                        );
                                    }
                                    return (
                                        <div key={question.id} className='w-full'>
                                            <p
                                                className={
                                                    additionalClass + " text-base pb-4 font-bold"
                                                }
                                            >
                                                <span>Câu {activeIndex + index}: </span>
                                                {question.content}{" "}
                                                {question.type === "Đáp án điền" &&
                                                    !isRight &&
                                                    question.selectedAnswer &&
                                                    `Câu trả lời của SV: ${question.selectedAnswer}`}
                                            </p>
                                            {question.type === "Đáp án điền" ? (
                                                <>
                                                    <Input
                                                        id={`question-${question.id}-answer`}
                                                        register={register}
                                                        name={`question-${question.id}-answer`}
                                                        readOnly
                                                    />
                                                </>
                                            ) : (
                                                question.answers.map((answer, index) => {
                                                    let additionalClass = "";
                                                    if (question.type === "Một đáp án") {
                                                        if (
                                                            lookupIndex(index) ===
                                                            question.finalAnswer
                                                        ) {
                                                            additionalClass =
                                                                "text-emerald-600 font-bold";
                                                        }
                                                        if (!isRight) {
                                                            if (
                                                                question.selectedAnswer &&
                                                                lookupIndex(index) ===
                                                                    question.selectedAnswer
                                                            ) {
                                                                additionalClass =
                                                                    "text-rose-600 font-bold";
                                                            }
                                                        }
                                                    } else {
                                                        if (question.finalAnswer)
                                                            question.finalAnswer
                                                                .split(",")
                                                                .forEach(ans => {
                                                                    if (
                                                                        lookupIndex(index) === ans
                                                                    ) {
                                                                        additionalClass =
                                                                            "text-emerald-600 font-bold";
                                                                    }
                                                                });
                                                        if (!isRight) {
                                                            if (question.selectedAnswer) {
                                                                if (
                                                                    question.selectedAnswer.includes(
                                                                        ","
                                                                    )
                                                                ) {
                                                                    question.selectedAnswer
                                                                        .split(",")
                                                                        .forEach(ans => {
                                                                            if (
                                                                                lookupIndex(
                                                                                    index
                                                                                ) === ans
                                                                            ) {
                                                                                additionalClass =
                                                                                    "text-rose-600 font-bold";
                                                                            }
                                                                        });
                                                                } else {
                                                                    if (
                                                                        lookupIndex(index) ===
                                                                        question.selectedAnswer
                                                                    ) {
                                                                        additionalClass =
                                                                            "text-rose-600 font-bold";
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }

                                                    return (
                                                        <Answer
                                                            answer={answer}
                                                            question={question}
                                                            index={index}
                                                            additionalClass={additionalClass}
                                                            readOnly
                                                        />
                                                    );
                                                })
                                            )}
                                        </div>
                                    );
                                })}
                            <div className='mt-5'>
                                <Divider />
                            </div>
                            <div className='flex items-center w-full'>
                                <div className='mt-3'>
                                    <button
                                        type='button'
                                        className={tailwindCss.radiantButton}
                                        onClick={() => {
                                            window.location.href = "/viewOldExams";
                                        }}
                                    >
                                        Trở về
                                    </button>
                                </div>
                                <div className='mt-3'>
                                    {fakeHandInDTO.questions.length !== activeIndex && (
                                        <button
                                            type='button'
                                            className={tailwindCss.radiantButton}
                                            onClick={() => {
                                                handleChangeQuestionPage(activeIndex + 4);
                                            }}
                                        >
                                            Trang kế
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewExamDetailPage;
