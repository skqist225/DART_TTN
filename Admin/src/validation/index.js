import * as yup from "yup";

export const subjectSchema = yup
    .object({
        id: yup.string().required("Mã môn học không được để trống"),
        name: yup.string().required("Tên môn học không được để trống"),
    })
    .required();

export const testSchema = yup
    .object({
        // name: yup.string().required("Tên bộ đề không được để trống"),
        testSubjectId: yup.string().required("Môn học không được để trống"),
    })
    .required();

export const questionSchema = yup
    .object({
        content: yup.string().required("Nội dung câu hỏi không được để  trống"),
        answerA: yup.string().required("Đáp án A không được để  trống"),
        answerB: yup.string().required("Đáp án B không được để  trống"),
        answerC: yup.string().required("Đáp án C không được để  trống"),
        answerD: yup.string().required("Đáp án D không được để  trống"),
    })
    .required();

export const userSchema = yup
    .object({
        id: yup.string().required("Mã người dùng"),
        firstName: yup.string().required("Họ không được để trống"),
        lastName: yup.string().required("Tên không được để  trống"),
        sex: yup.string().required("Giới tính không được để  trống"),
        birthday: yup.string().required("Ngày sinh không được để  trống"),
        address: yup.string().required("Địa chỉ không được để  trống"),
        email: yup
            .string()
            .required("Địa chỉ email không được để  trống")
            .email("Địa chỉ email không đúng định dạng"),
        password: yup.string().min(8, "Mật khẩu ít nhất tám ký tự"),
        roleId: yup.string().required("Vai trò không được để  trống"),
        classId: yup.string().required("Lớp không được để  trống"),
    })
    .required();

export const userRegisterSchema = yup
    .object({
        id: yup.string().required("Mã người dùng"),
        firstName: yup.string().required("Họ không được để trống"),
        lastName: yup.string().required("Tên không được để  trống"),
        sex: yup.string().required("Giới tính không được để  trống"),
        birthday: yup.string().required("Ngày sinh không được để  trống"),
        address: yup.string().required("Địa chỉ không được để  trống"),
        email: yup
            .string()
            .required("Địa chỉ email không được để  trống")
            .email("Địa chỉ email không đúng định dạng"),
        roleId: yup.string().required("Vai trò không được để  trống"),
        classId: yup.string().required("Lớp không được để  trống"),
    })
    .required();

export const classSchema = yup
    .object({
        id: yup.string().required("Mã lớp không được để trống"),
        name: yup.string().required("Tên lớp không được để trống"),
    })
    .required();

export const chapterSchema = yup
    .object({
        name: yup.string().required("Tên chương không được để trống"),
        subjectId: yup.string().required("Môn học không được để  trống"),
    })
    .required();

export const roleSchema = yup
    .object({
        name: yup.string().required("Tên vai trò được để trống"),
    })
    .required();
