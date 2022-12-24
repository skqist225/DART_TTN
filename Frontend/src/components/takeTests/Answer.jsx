import $ from "jquery";
import React from "react";
import { tailwindCss } from "../../tailwind";
import { lookupIndex } from "../questions/QuestionModalBody";

function Answer({
    answer,
    question,
    index,
    setFinalAnswer,
    finalAnswer,
    additionalClass,
    readOnly = false,
}) {
    const checkBoxId = `question-${question.id}-answer${lookupIndex(index)}`;
    const questionId = question.id;
    const answerLabel = lookupIndex(index);

    const { type } = question;

    function addOrRemoveCheckMultipleChoice(element, checked, updateCheckedState = true) {
        if (checked) {
            let shouldRemoveCheck = true;
            $(`.question-${questionId}-answer-cls`).each(function () {
                if ($(this).prop("checked")) {
                    if (!$(this).is(element)) {
                        shouldRemoveCheck = false;
                    }
                }
            });
            if (updateCheckedState) {
                element.prop("checked", false);
            }

            if (shouldRemoveCheck) {
                $(`#question-${questionId}-answer`).removeClass("chosen active");
            }

            if (finalAnswer.has(questionId)) {
                const currentAnswer = finalAnswer.get(questionId).split(",");
                if (currentAnswer.length > 1) {
                    finalAnswer.set(
                        questionId,
                        currentAnswer.filter(answer => answer !== answerLabel).join(",")
                    );
                } else {
                    finalAnswer.delete(questionId);
                }
                console.log(finalAnswer);
                setFinalAnswer(new Map([...finalAnswer]));
            }
        } else {
            if (updateCheckedState) {
                element.prop("checked", "true");
            }

            $(`#question-${questionId}-answer`).addClass("chosen active");

            if (finalAnswer.has(questionId)) {
                finalAnswer.set(questionId, `${finalAnswer.get(questionId)},${answerLabel}`);
            } else {
                finalAnswer.set(questionId, answerLabel);
            }
            console.log(finalAnswer);
            setFinalAnswer(new Map([...finalAnswer]));
        }
    }

    function addOrRemoveOneChoice(element, checked, updateCheckedState = true) {
        if (checked) {
            if (updateCheckedState) {
                element.prop("checked", false);
            }

            $(`#question-${questionId}-answer`).removeClass("chosen active");

            if (finalAnswer.has(questionId)) {
                finalAnswer.delete(questionId);
                console.log(finalAnswer);
                setFinalAnswer(new Map([...finalAnswer]));
            }
        } else {
            if (updateCheckedState) {
                element.prop("checked", "true");
            }

            $(`#question-${questionId}-answer`).addClass("chosen active");

            finalAnswer.set(questionId, answerLabel);
            console.log(finalAnswer);
            setFinalAnswer(new Map([...finalAnswer]));
        }
    }

    function addOrRemove() {
        if (readOnly) {
            return;
        }

        const element = $(`#question-${questionId}-answer${answerLabel}`);
        const checked = element.prop("checked");

        if (type === "Một đáp án") {
            addOrRemoveOneChoice(element, checked);
        } else {
            addOrRemoveCheckMultipleChoice(element, checked);
        }
    }

    return (
        <div className='flex items-start mb-4' key={answer.id + index}>
            {!readOnly && (
                <input
                    id={checkBoxId}
                    type={type === "Một đáp án" ? "radio" : "checkbox"}
                    value={lookupIndex(index)}
                    className={`${tailwindCss.checkbox} question-${questionId}-answer-cls`}
                    name={`question-${questionId}-answer`}
                    onChange={e => {
                        const self = $(e.target);

                        if (type === "Một đáp án") {
                            addOrRemoveOneChoice(self, !self.prop("checked"), false);
                        } else if (type === "Nhiều đáp án") {
                            addOrRemoveCheckMultipleChoice(self, !self.prop("checked"), false);
                        }
                    }}
                />
            )}

            <label
                id={`${checkBoxId}-label`}
                className={`${tailwindCss.radioButtonLabel} ${additionalClass} ${
                    !readOnly && "hover:font-medium hover:text-sky-600 cursor-pointer"
                }`}
                onClick={addOrRemove}
            >
                {answer.order}. {answer.content}
            </label>
        </div>
    );
}

export default Answer;
