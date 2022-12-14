export const questionColumns = [
    {
        name: "Mã câu hỏi",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Nội dung",
        sortField: "content",
        sortable: true,
    },
    {
        name: "Đáp án",
    },
    {
        name: "Loại",
        sortField: "type",
        sortable: true,
    },
    {
        name: "Độ khó",
        sortField: "level",
        sortable: true,
    },
    {
        name: "Chương",
        sortField: "chapter",
        sortable: true,
    },
    {
        name: "Môn học",
    },
    {
        name: "Người tạo",
    },
    {
        name: "Thao tác",
    },
];

export const questionExcelColumns = [
    {
        name: "STT",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Nội dung",
        sortField: "content",
        sortable: true,
    },
    {
        name: "Loại câu hỏi",
        sortField: "type",
        sortable: true,
    },
    {
        name: "Độ khó",
        sortField: "level",
        sortable: true,
    },
    {
        name: "Chương",
        sortField: "chapterName",
        sortable: true,
    },
    {
        name: "Môn học",
        sortField: "subjectName",
        sortable: true,
    },
];

export const testColumns = [
    {
        name: "Mã đề thi",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Tên đề thi",
        sortField: "name",
        sortable: true,
    },
    {
        name: "Trạng thái",
        sortField: "status",
        sortable: true,
    },
    {
        name: "Tổng số câu hỏi",
        sortField: "numberOfQuestions",
    },
    {
        name: "Môn học",
    },
    {
        name: "Người tạo",
    },
    {
        name: "Thao tác",
    },
];

export const questionColumnsTestPage = [
    {
        name: "Mã câu hỏi",
    },
    {
        name: "Nội dung",
    },
    {
        name: "Đáp án",
    },
    {
        name: "Loại câu hỏi",
    },
    {
        name: "Chương",
    },
    {
        name: "Độ khó",
    },
    {
        name: "Người tạo",
    },
];

export const subjectColumns = [
    {
        name: "Mã môn học",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Tên môn học",
        sortField: "name",
        sortable: true,
    },
    {
        name: "Số tiết lý thuyết",
        sortField: "numberOfTheoreticalPeriods",
        sortable: true,
    },
    {
        name: "Số tiết thực hành",
        sortField: "numberOfPracticePeriods",
        sortable: true,
    },
    {
        name: "Số chương",
    },
    {
        name: "Số đề thi",
    },
    {
        name: "Số câu hỏi",
    },
];

export const userColumns = [
    {
        name: "Mã người dùng",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Họ tên",
        sortField: "fullName",
        sortable: true,
    },
    {
        name: "Ngày sinh",
        sortField: "birthday",
        sortable: true,
    },
    {
        name: "Email",
        sortField: "email",
        sortable: true,
    },
    {
        name: "Giới tính",
    },
    {
        name: "Địa chỉ",
        sortField: "address",
        sortable: true,
    },
    {
        name: "Vai trò",
    },
    {
        name: "Thao tác",
    },
];

export const examColumns = [
    {
        name: "Mã ca thi",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Tên ca thi",
        sortField: "name",
        sortable: true,
    },
    {
        name: "Mã môn học",
        sortField: "subjectId",
        // sortable: true,
    },
    {
        name: "Tên môn học",
        sortField: "subjectName",
        // sortable: true,
    },
    {
        name: "Trạng thái",
        sortField: "taken",
        // sortable: true,
    },
    {
        name: "Số lượng",
        sortField: "numberOfStudents",
        // sortable: true,
    },
    {
        name: "Ngày thi",
        sortField: "examDate",
        sortable: true,
    },
    {
        name: "Tiết báo danh",
        sortField: "noticePeriod",
        sortable: true,
    },
    {
        name: "Thời gian thi",
        sortField: "time",
        sortable: true,
    },
    // {
    //     name: "Loại thi",
    //     sortField: "type",
    //     sortable: true,
    // },
    {
        name: "Giảng viên",
        sortField: "time",
        // sortable: true,
    },
    // {
    //     name: "Người tạo",
    //     sortField: "name",
    //     sortable: true,
    // },
    {
        name: "Thao tác",
        sortField: "name",
    },
];

export const studentColumns = [
    {
        name: "Tên ca thi",
        sortField: "name",
        sortable: true,
    },
    {
        name: "Mã môn học",
        sortField: "subjectId",
        // sortable: true,
    },
    {
        name: "Tên môn học",
        sortField: "subjectName",
        // sortable: true,
    },
    {
        name: "Số lượng",
        sortField: "numberOfStudents",
        // sortable: true,
    },
    {
        name: "Ngày thi",
        sortField: "examDate",
        sortable: true,
    },
    {
        name: "Tiết báo danh",
        sortField: "noticePeriod",
        sortable: true,
    },
    {
        name: "Thời gian thi",
        sortField: "time",
        sortable: true,
    },
    {
        name: "Loại thi",
        sortField: "type",
        sortable: true,
    },
    {
        name: "Giảng viên",
        sortField: "time",
        // sortable: true,
    },
    {
        name: "Thao tác",
        sortField: "name",
    },
];

export const studentExamColumns = [
    {
        name: "Tên ca thi",
        sortField: "name",
        sortable: true,
    },
    {
        name: "Mã môn học",
        sortField: "subjectId",
    },
    {
        name: "Tên môn học",
        sortField: "subjectName",
    },
    {
        name: "Thông tin ca thi",
        sortField: "numberOfStudents",
    },
    {
        name: "Điểm số",
    },
    {
        name: "Thao tác",
        sortField: "name",
    },
];

export const creditClassColumns = [
    {
        name: "Mã LTC",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Năm học",
        sortField: "content",
        sortable: true,
    },
    {
        name: "Học kỳ",
        sortField: "type",
        sortable: true,
    },
    {
        name: "Môn học",
        sortField: "answerC",
    },
    {
        name: "Nhóm",
        sortField: "level",
        sortable: true,
    },
    {
        name: "Tình trạng",
        sortField: "chapter",
        sortable: true,
    },
    {
        name: "Giảng viên",
        sortField: "subject",
        sortable: true,
    },
    {
        name: "Thao tác",
        sortable: false,
    },
];

export const registerColumns = [
    {
        name: "Mã SV",
        sortField: "fullName",
        sortable: true,
    },
    {
        name: "Họ tên",
        sortField: "creditClass",
        sortable: true,
    },
    {
        name: "Mã LTC",
        sortField: "creditClass",
        sortable: true,
    },
    {
        name: "Niên khóa",
        sortField: "creditClass",
        sortable: true,
    },
    {
        name: "Học kỳ",
        sortField: "creditClass",
        sortable: true,
    },
    {
        name: "Môn học",
        sortField: "status",
        sortable: true,
    },
    {
        name: "Giảng viên",
        sortField: "status",
        sortable: true,
    },
];

export const roleColumns = [
    {
        name: "Mã vai trò",
        sortField: "id",
        sortable: true,
    },
    {
        name: "Tên vai trò",
        sortField: "name",
        sortable: true,
    },
];

export const rankColumns = [
    {
        name: "STT",
        sortField: "index",
        sortable: true,
    },
    {
        name: "MSSV",
        sortField: "studentId",
        sortable: true,
    },
    {
        name: "Họ và tên",
        sortField: "studentName",
        sortable: true,
    },
    {
        name: "Điểm",
        sortField: "score",
        sortable: true,
    },
];

export const studentRankColumns = [
    {
        name: "STT",
        sortField: "index",
        sortable: true,
    },
    {
        name: "MSSV",
        sortField: "studentId",
        sortable: true,
    },
    {
        name: "Họ và tên",
        sortField: "studentName",
        sortable: true,
    },
];

export const viewCreditClassExamColumns = [
    {
        name: "STT",
        sortField: "studentName",
        sortable: true,
    },
    {
        name: "Ca thi",
        sortField: "studentName",
        sortable: true,
    },
    {
        name: "Trạng thái",
        sortField: "studentName",
        sortable: true,
    },
    {
        name: "Số SV thi",
        sortField: "studentName",
        sortable: true,
    },
    {
        name: "Ngày thi",
        sortField: "studentName",
        sortable: true,
    },
    {
        name: "Tiết báo danh",
        sortField: "studentName",
        sortable: true,
    },
];
