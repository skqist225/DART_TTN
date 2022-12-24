import $ from "jquery";
import React from "react";
import { Answer, Input } from "../../components";

function Question({ question, finalAnswer, setFinalAnswer, register, activeIndex, index }) {
    return (
        <div key={question.id}>
            <p className='text-base pb-4 font-bold'>
                <span>Câu {activeIndex + index}: </span>
                {question.content}{" "}
                {question.type === "Nhiều đáp án" && "(Có thể lựa chọn nhiều đáp án)"}
            </p>
            {question.type === "Đáp án điền" ? (
                <Input
                    register={register}
                    name={`question-${question.id}-answer`}
                    onChangeHandler={e => {
                        finalAnswer.set(question.id, e.target.value);
                        setFinalAnswer(finalAnswer);
                        if (e.target.value) {
                            $(`#question-${question.id}-answer`).addClass("chosen active");
                        } else {
                            $(`#question-${question.id}-answer`).removeClass("chosen active");
                        }
                    }}
                />
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
}

export default Question;
