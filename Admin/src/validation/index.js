import * as yup from "yup";

export const subjectSchema = yup
    .object({
        id: yup.string().required("Vui lòng điền mã môn học"),
        name: yup.string().required("Vui lòng điền tên môn học"),
    })
    .required();

export const questionSchema = yup
    .object({
        content: yup.string().required("Nội dung câu hỏi không được để  trống"),
        answerA: yup.string().required("Đáp án A không được để  trống"),
        answerB: yup.string().required("Đáp án B không được để  trống"),
        answerC: yup.string().required("Đáp án C không được để  trống"),
        answerD: yup.string().required("Đáp án D không được để  trống"),
        finalAnswer: yup.string().required("Đáp án không được để  trống"),
        level: yup.string().required("Mức độ không được để  trống"),
        subjectId: yup.string().required("Môn học không được để  trống"),
    })
    .required();
