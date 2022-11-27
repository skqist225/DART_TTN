import React from "react";
import { lookupIndex } from "../questions/QuestionModalBody";
import $ from "jquery";
import { tailwindCss } from "../../tailwind";

function Answer({
    answer,
    question,
    index,
    register,
    setFinalAnswer,
    finalAnswer,
    type = "Một đáp án",
}) {
    const checkBoxId = `question-${question.id}-answer${lookupIndex(index)}`;
    const questionId = question.id;
    const answerLabel = lookupIndex(index);
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
            console.log(answerLabel);
            console.log(`${finalAnswer.get(questionId)},${answerLabel}`);
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
        if (type === "Một đáp án") {
            addOrRemoveOneChoice();
        } else {
            addOrRemoveCheckMultipleChoice();
        }
    }
    console.log(type);
    return (
        <div className='flex items-center mb-4' key={answer.id}>
            <input
                id={checkBoxId}
                type={type === "Một đáp án" ? "radio" : "checkbox"}
                value={lookupIndex(index)}
                className={`${tailwindCss.checkbox} question-${questionId}-answer-cls`}
                name={`question-${questionId}-answer`}
                onClick={e => {
                    const self = $(e.currentTarget);
                    console.log(self.prop("checked"));
                    if (self.prop("checked")) {
                        console.log($(`#question-${questionId}-answer`));
                        $(`#question-${questionId}-answer`).addClass("chosen active");
                    } else {
                        $(`#question-${questionId}-answer`).removeClass("chosen active");
                    }
                    // addOrRemove();
                }}
            />
            <label
                id={`${checkBoxId}-label`}
                className={tailwindCss.radioButtonLabel}
                onClick={addOrRemove}
            >
                {answer.order}. {answer.content}
            </label>
        </div>
    );
}

export default Answer;
