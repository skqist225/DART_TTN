import * as yup from "yup";

export const subjectSchema = yup
    .object({
        id: yup.string().required("Vui lòng điền mã môn học"),
        name: yup.string().required("Vui lòng điền tên môn học"),
    })
    .required();

export const questionSchema = yup
    .object({
        content: yup.string().required("Vui lòng điền nội dung câu hỏi"),
        answerA: yup.string().required("Vui lòng điền đáp án A"),
        answerB: yup.string().required("Vui lòng điền đáp án B"),
        answerC: yup.string().required("Vui lòng điền đáp án C"),
        answerD: yup.string().required("Vui lòng điền đáp án D"),
        finalAnswer: yup.string().required("Vui lòng chọn đáp án"),
        level: yup.string().required("Vui lòng chọn mức độ câu hỏi"),
    })
    .required();
