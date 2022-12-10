import React, { useEffect } from "react";
import { lookupIndex } from "../questions/QuestionModalBody";
import $ from "jquery";
import { tailwindCss } from "../../tailwind";

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

    function addOrRemoveCheckMultipleChoice() {
        const ans = $(`#question-${questionId}-answer${answerLabel}`);
        if (ans.prop("checked")) {
            let shouldRemoveCheck = true;
            $(`.question-${questionId}-answer-cls`).each(function () {
                if ($(this).prop("checked")) {
                    if (!$(this).is(ans)) {
                        shouldRemoveCheck = false;
                    }
                }
            });
            ans.prop("checked", false);

            if (shouldRemoveCheck) {
                $(`#question-${questionId}-answer`).removeClass("chosen active");
            }

            if (finalAnswer.has(questionId)) {
                const currentAnswer = finalAnswer.get(questionId).split(",");
                if (currentAnswer.length > 1) {
                    finalAnswer.set(questionId, currentAnswer.push(answer).join(","));
                } else {
                    finalAnswer.delete(questionId);
                }

                setFinalAnswer(new Map([...finalAnswer]));
            }
        } else {
            ans.prop("checked", "true");
            $(`#question-${questionId}-answer`).addClass("chosen active");

            if (finalAnswer.has(questionId)) {
                finalAnswer.set(questionId, `${finalAnswer.get(questionId)},${answerLabel}`);
            } else {
                finalAnswer.set(questionId, answerLabel);
            }

            setFinalAnswer(new Map([...finalAnswer]));
        }
    }

    function addOrRemoveOneChoice() {
        const ans = $(`#question-${questionId}-answer${answerLabel}`);
        if (ans.prop("checked")) {
            ans.prop("checked", false);

            $(`#question-${questionId}-answer`).removeClass("chosen active");

            if (finalAnswer.has(questionId)) {
                finalAnswer.delete(questionId);
                setFinalAnswer(new Map([...finalAnswer]));
            }
        } else {
            // Add check for checkbox
            ans.prop("checked", "true");
            // Add selected for answer
            $(`#question-${questionId}-answer`).addClass("chosen active");
            // Add to final answer
            finalAnswer.set(questionId, answerLabel);
            setFinalAnswer(new Map([...finalAnswer]));
        }
    }

    function addOrRemove() {
        if (readOnly) {
            return;
        }

        if (type === "Một đáp án") {
            addOrRemoveOneChoice();
        } else {
            addOrRemoveCheckMultipleChoice();
        }
    }

    useEffect(() => {
        if (readOnly) {
            $(`#${checkBoxId}`).prop("checked", false);
        }
    }, []);

    return (
        <div className='flex items-start mb-4' key={answer.id}>
            <input
                id={checkBoxId}
                type={type === "Một đáp án" ? "radio" : "checkbox"}
                value={lookupIndex(index)}
                className={`${tailwindCss.checkbox} question-${questionId}-answer-cls`}
                name={`question-${questionId}-answer`}
                onClick={e => {
                    if (readOnly) {
                        return;
                    }
                    if (type === "Một đáp án") {
                        // Add selected for answer
                        $(`#question-${questionId}-answer`).addClass("chosen active");
                        // Add to final answer
                        finalAnswer.set(questionId, answerLabel);
                        setFinalAnswer(new Map([...finalAnswer]));
                    } else {
                        $(`#question-${questionId}-answer`).addClass("chosen active");
                        if (finalAnswer.has(questionId)) {
                            finalAnswer.set(
                                questionId,
                                `${finalAnswer.get(questionId)},${answerLabel}`
                            );
                        } else {
                            finalAnswer.set(questionId, answerLabel);
                        }

                        setFinalAnswer(new Map([...finalAnswer]));
                    }
                }}
                readOnly={readOnly}
                disabled={readOnly}
            />
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
