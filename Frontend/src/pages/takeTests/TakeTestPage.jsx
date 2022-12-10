import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { Button, Card } from "flowbite-react";
import { getQuestions, questionState } from "../../features/questionSlice";
import { lookupIndex } from "../../components/questions/QuestionModalBody";
import { tailwindCss } from "../../tailwind";
import MyDrawer from "../../components/takeTests/MyDrawer";
import { Box, Divider } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { callToast } from "../../helpers";
import Toast from "../../components/notify/Toast";

const noticePeriodMappings = {
    1: "7:00-9:00",
    3: "9:00-11:00",
    5: "13:00-15:00",
    7: "15:00-17:00",
};

const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
        return null;
    } else {
        return (
            <span>
                {hours}:{minutes}:{seconds}
            </span>
        );
    }
};

ChartJS.register(ArcElement, Tooltip, Legend);

export function isAnswerRight(selectedAnswer, finalAnswer, type) {
    if (!selectedAnswer) {
        return false;
    } else {
        if (selectedAnswer.toString().toLowerCase() === finalAnswer.toString().toLowerCase()) {
            return true;
        } else {
            return false;
        }
    }
}

const now = Date.now();
function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant='determinate' {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant='body2' color='text.secondary'>{`${Math.round(
                    props.value
                )}%`}</Typography>
            </Box>
        </Box>
    );
}
function TakeTestPage() {
    const [progress, setProgress] = useState(0);
    const [doTest, setDoTest] = useState(false);
    const [time, setTime] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(1);
    const [finalAnswer, setFinalAnswer] = useState(new Map());
    const [resultMode, setResultMode] = useState(false);
    const [viewExamDetails, setViewExamDetails] = useState(false);
    const [examId, setExamId] = useState(0);
    const [qsts, setQsts] = useState([]);
    const { user } = useSelector(persistUserState);
    const { exams } = useSelector(examState);
    const { test } = useSelector(testState);
    const { testedQuestions } = useSelector(questionState);
    const [selectedExam, setSelectedExam] = useState(null);

    const dispatch = useDispatch();
    const questionPerPage = 4;

    const { register, setValue } = useForm({});
    const exam = exams.find(({ id }) => id.toString() === examId.toString());

    useEffect(() => {
        if (exam) {
            const timer = setInterval(() => {
                setProgress(prevProgress =>
                    prevProgress >= 100 ? 0 : prevProgress + (5 / exam.time) * 100
                );
            }, 60000 * 5);
            return () => {
                clearInterval(timer);
            };
        }
    }, [exam]);

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
                    if (question.type === "Đáp án điền") {
                        setValue(`question-${question.id}-answer`, finalAnswer.get(question.id));
                    } else {
                        $(`#question-${question.id}-answer${finalAnswer.get(question.id)}`).prop(
                            "checked",
                            "true"
                        );
                    }
                }
            });
        }
    }, [questions]);

    const data = {
        labels: ["Sai", "Đúng"],
        datasets: [
            {
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

    useEffect(() => {
        if (viewExamDetails) {
            setQuestions(qsts.slice(0, questionPerPage));
        }
    }, [viewExamDetails]);

    function handleChangeQuestionPage(index, questionId) {
        if (resultMode && !viewExamDetails) {
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
        let qstss = [];
        if (viewExamDetails) {
            qstss = qsts.slice(
                divResult * questionPerPage,
                divResult * questionPerPage + questionPerPage
            );
        } else {
            qstss = testedQuestions.slice(
                divResult * questionPerPage,
                divResult * questionPerPage + questionPerPage
            );
        }

        setQuestions(qstss);
        setActiveIndex(actIndex);

        $(".question-answer").each(function () {
            $(this).removeClass("border up");
        });
        if (questionId) {
            $(`#question-${questionId}-answer`).addClass("border up");
        }
    }

    useEffect(() => {
        if (exams && exams.length) {
            handleExamChange({
                target: { value: exams[0].id },
            });
        }
    }, [exams]);

    const handleExamChange = ({ target: { value } }) => {
        setSelectedExam(exams.find(({ id }) => id.toString() === value.toString()));
    };

    return (
        <div className='max-w-6xl m-auto'>
            <div>
                {doTest ? (
                    testedQuestions.length && (
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
                                                    <div>Môn học: {exam.subjectName}</div>
                                                    <div>Loại thi: {exam.type}</div>
                                                </div>
                                                <div>
                                                    <div>Ngày thi: {exam.examDate}</div>
                                                    <div>Tiết báo danh: {exam.noticePeriod}</div>
                                                    <div>Thời gian làm bài: {exam.time} phút</div>
                                                </div>
                                            </div>
                                        </Card>
                                    }
                                />
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
                                                onComplete={() => {
                                                    dispatch(
                                                        handIn({
                                                            exam: examId,
                                                            answers: finalAnswer,
                                                        })
                                                    );
                                                    setResultMode(true);
                                                    setFinalAnswer(new Map());
                                                }}
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
                                className={`flex-1 w-60 bg-white rounded-md p-4 ${
                                    resultMode && "col-flex items-center justify-center"
                                }`}
                            >
                                <LinearProgressWithLabel value={progress} />

                                {!resultMode && !viewExamDetails
                                    ? questions.length &&
                                      questions.map((question, index) => {
                                          return (
                                              <div key={question.id}>
                                                  <p className='text-base pb-4 font-bold'>
                                                      <span>Câu {activeIndex + index}: </span>
                                                      {question.content}
                                                  </p>
                                                  {question.type === "Đáp án điền" ? (
                                                      <>
                                                          <input
                                                              className={tailwindCss.input}
                                                              id={`question-${question.id}-answer`}
                                                              register={register}
                                                              name={`question-${question.id}-answer`}
                                                              onChange={e => {
                                                                  finalAnswer.set(
                                                                      question.id,
                                                                      e.target.value
                                                                  );
                                                                  setFinalAnswer(finalAnswer);
                                                              }}
                                                          />
                                                      </>
                                                  ) : (
                                                      question.answers.map((answer, index) => {
                                                          return (
                                                              <Answer
                                                                  answer={answer}
                                                                  question={question}
                                                                  finalAnswer={finalAnswer}
                                                                  setFinalAnswer={setFinalAnswer}
                                                                  index={index}
                                                                  type={question.type}
                                                              />
                                                          );
                                                      })
                                                  )}
                                              </div>
                                          );
                                      })
                                    : !viewExamDetails && (
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
                                {viewExamDetails &&
                                    questions.length &&
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
                                                        additionalClass +
                                                        " text-base pb-4 font-bold"
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
                                                                            lookupIndex(index) ===
                                                                            ans
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
                                                                finalAnswer={finalAnswer}
                                                                setFinalAnswer={setFinalAnswer}
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
                                                setFinalAnswer(new Map());
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
                                            onClick={() => {
                                                if (!viewExamDetails) {
                                                    setViewExamDetails(true);
                                                } else {
                                                    setViewExamDetails(false);
                                                    setDoTest(true);
                                                }
                                            }}
                                        >
                                            {!viewExamDetails
                                                ? "Xem chi tiết bài thi"
                                                : "Xem thống kê kết quả"}
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
                                                Trang kế
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    <>
                        <div
                            style={{
                                width: "100vw",
                                height: "100vh",
                                margin: "auto",
                                maxWidth: "80%",
                            }}
                            className='col-flex items-center justify-center'
                        >
                            <div className='w-full mb-5'>
                                <Card>
                                    <div className='flex items-center justify-center w-2/4 m-auto'>
                                        <div>
                                            <div className='font-semibold'>
                                                Họ và tên: {user.fullName}
                                            </div>
                                            <div className='font-semibold'>MSSV: {user.id}</div>
                                        </div>
                                    </div>
                                </Card>
                                {selectedExam && (
                                    <Card>
                                        <div className='flex items-center justify-center w-2/4 m-auto'>
                                            <div>
                                                <div>Môn học: {selectedExam.subjectName}</div>
                                                <div>Loại thi: {selectedExam.type}</div>
                                                <div>Ngày thi: {selectedExam.examDate}</div>
                                                <div>
                                                    Tiết báo danh: {selectedExam.noticePeriod} (
                                                    {
                                                        noticePeriodMappings[
                                                            selectedExam.noticePeriod
                                                        ].split("-")[0]
                                                    }
                                                    )
                                                </div>
                                                <div>
                                                    Thời gian làm bài: {selectedExam.time} phút
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </div>

                            {exams.length === 0 ? (
                                <div>{`Chưa có ca thi`}</div>
                            ) : (
                                <div className='mb-5 w-full'>
                                    <Select
                                        label={"Chọn ca thi"}
                                        name='examSelected'
                                        register={register}
                                        options={exams.map(({ id, name }) => ({
                                            title: name,
                                            value: id,
                                        }))}
                                        onChangeHandler={handleExamChange}
                                    />
                                </div>
                            )}

                            <div className='flex items-center w-full mt-5'>
                                <div className='mr-5 w-full'>
                                    <Button
                                        onClick={() => {
                                            window.location.href = "/";
                                        }}
                                    >
                                        Trở về trang chủ
                                    </Button>
                                </div>

                                {exams.length > 0 && (
                                    <div className='w-full'>
                                        <Button
                                            onClick={() => {
                                                const examId = $("#examSelected").val();
                                                const { examDate, noticePeriod, time } = exams.find(
                                                    ({ id }) => id.toString() === examId.toString()
                                                );

                                                const todayTime = new Date().getTime();
                                                const startTime = new Date(
                                                    examDate +
                                                        " " +
                                                        noticePeriodMappings[noticePeriod].split(
                                                            "-"
                                                        )[0]
                                                );
                                                const endTime = new Date(
                                                    examDate +
                                                        " " +
                                                        noticePeriodMappings[noticePeriod].split(
                                                            "-"
                                                        )[1]
                                                );
                                                const check = false;
                                                if (check) {
                                                    if (
                                                        todayTime >= startTime &&
                                                        todayTime <= endTime
                                                    ) {
                                                        dispatch(getQuestions({ exam: examId }));
                                                        setDoTest(true);
                                                        setExamId(parseInt(examId));

                                                        setTime(time);
                                                    } else {
                                                        callToast(
                                                            "warning",
                                                            "Ngoài thời gian làm bài thi"
                                                        );
                                                        return;
                                                    }
                                                } else {
                                                    dispatch(getQuestions({ exam: examId }));
                                                    setDoTest(true);
                                                    setExamId(parseInt(examId));

                                                    setTime(time);
                                                }
                                            }}
                                        >
                                            Làm bài
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Toast />
        </div>
    );
}

export default TakeTestPage;
