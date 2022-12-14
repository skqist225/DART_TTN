import { yupResolver } from "@hookform/resolvers/yup";
import { Badge, Button, Card, Tooltip } from "flowbite-react";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
    addExamCreditClassPage,
    creditClassState,
    deleteCreditClass,
    enableOrDisableCreditClass,
    setEditedCreditClass,
} from "../../features/creditClassSlice";
import { examState } from "../../features/examSlice";
import { persistUserState } from "../../features/persistUserSlice";
import { callToast } from "../../helpers";
import ExamIcon from "../../images/exam.png";
import { tailwindCss } from "../../tailwind";
import { examSchema } from "../../validation";
import EnableOrDisable from "../common/EnableOrDisable";
import MyButton, { ButtonType } from "../common/MyButton";
import ViewDetails from "../common/ViewDetails";
import ExamModalBody from "../exams/ExamModalBody";
import TableModal from "../utils/tables/TableModal";
import TableModalViewer from "../utils/tables/TableModalViewer";
import ExamList from "./ExamList";
import RegisterList from "./RegisterList";

function CreditClassTableBody({ rows, setIsEdit }) {
    const modalId = "examModal";
    const formId = "examForm";
    const modalLabel = "ca thi";
    const [isExamEdit, setIsExamEdit] = useState(false);
    const [creditClassId, setCreditClassId] = useState(0);

    const dispatch = useDispatch();

    const { creditClassedFixedBug: creditClasses } = useSelector(creditClassState);
    const { user } = useSelector(persistUserState);
    const userRoles = user.roles.map(({ name }) => name);

    const {
        filterObject,
        addExam: { addExamsuccessMessage },
    } = useSelector(examState);

    function cleanForm(successMessage, type = "add") {
        callToast("success", successMessage);
        dispatch(fetchAllExams(filterObject));

        $(`#testModal`).css("display", "none");
        if (type === "add") {
            $(`#testModal`)[0].reset();
        }
    }

    useEffect(() => {
        if (addExamsuccessMessage) {
            cleanForm(addExamsuccessMessage, "add");
        }
    }, [addExamsuccessMessage]);

    const {
        register,
        setValue,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(examSchema),
    });
    console.log(errors);
    const onSubmit = data => {
        let haveError = false;
        if (!data.time) {
            setError("time", {
                type: "custom",
                message: "Th???i gian l??m b??i kh??ng ???????c ????? tr???ng",
            });
            haveError = true;
        }

        if (!data.numberOfStudents) {
            setError("numberOfStudents", {
                type: "custom",
                message: "S???  SV thi kh??ng ???????c ????? tr???ng",
            });
            haveError = true;
        }

        let tests = [];
        $(".tests-checkbox").each(function () {
            if ($(this).prop("checked")) {
                tests.push($(this).data("id"));
            }
        });
        if (tests.length === 0) {
            setError("tests", {
                type: "custom",
                message: "Ch???n ????? thi cho ca thi",
            });
            haveError = true;
        }

        if (haveError) {
            return;
        }

        if (parseInt(data.numberOfStudents) > parseInt($("#numberOfActiveStudents").val())) {
            setError("numberOfStudents", {
                type: "custom",
                message: "S??? sinh vi??n thi ph???i ??t h??n sinh vi??n ??ang theo h???c",
            });
            haveError = true;
        }
        if (data.time > 120) {
            setError("time", {
                type: "custom",
                message: "Th???i gian l??m b??i ph???i ??t h??n ho???c b???ng 120 ph??t",
            });
            haveError = true;
        }

        let { examDate } = data;
        const examDt = new Date(
            `${examDate.split("/")[1]}/${examDate.split("/")[0]}/${examDate.split("/")[2]} 00:00:00`
        );

        if (examDt.getTime() <= new Date().getTime()) {
            setError("examDate", {
                type: "custom",
                message: "Ng??y thi ph???i l???n h??n ng??y hi???n t???i",
            });
            haveError = true;
        }

        if (data.examType === "Gi???a k???") {
            if (parseInt($("#numberOfNoneCreatedMidtermExamStudents").val()) === 0) {
                setError("examType", {
                    type: "custom",
                    message: `K??? thi Gi???a k??? c???a l???p t??n ch??? n??y ???? ???????c t???o cho t???t c??? sinh vi??n. Vui l??ng ch???n lo???i k??? thi kh??c`,
                });
                haveError = true;
            }
        } else if (data.examType === "Cu???i k???") {
            if (parseInt($("#numberOfNoneCreatedFinalTermExamStudents").val()) === 0) {
                setError("examType", {
                    type: "custom",
                    message: `K??? thi Cu???i k??? c???a l???p t??n ch??? n??y ???? ???????c t???o cho t???t c??? sinh vi??n. Vui l??ng ch???n lo???i k??? thi kh??c`,
                });
                haveError = true;
            }
        }

        if (haveError) {
            return;
        }

        data["tests"] = tests;

        examDate = examDate.split("/");
        examDate = examDate[2] + "-" + examDate[1] + "-" + examDate[0];
        data["examDate"] = examDate;

        const { schoolYear, semester, subjectName, group, exams } = creditClasses.find(
            ({ id }) => id.toString() === data.creditClassId.toString()
        );
        let index = 1;
        if (exams && exams.length) {
            exams.forEach(exam => {
                if (exam.type === data.examType) {
                    index += 1;
                }
            });
        }

        data[
            "name"
        ] = `${schoolYear}-${semester}-${subjectName}-${group}-${data.examType}-${index}`;

        dispatch(addExamCreditClassPage(data));
    };

    return (
        <tbody>
            <TableModal
                modalId={modalId}
                formId={formId}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                modalLabel={isExamEdit ? `Ch???nh s???a ${modalLabel}` : `Th??m ${modalLabel}`}
                ModalBody={
                    <ExamModalBody
                        errors={errors}
                        register={register}
                        dispatch={dispatch}
                        setValue={setValue}
                        creditClassPage={true}
                        creditClassId={creditClassId}
                    />
                }
                buttonLabel={isExamEdit ? `Ch???nh s???a` : `Th??m`}
                setIsEdit={setIsExamEdit}
                onCloseForm={() => {}}
            />
            {rows &&
                rows.length &&
                rows.map((row, index) => {
                    let couldNotCreateExamMessage = "Th??m ca thi";

                    let shouldCreateExam = true;

                    if (row.numberOfActiveStudents === 0) {
                        couldNotCreateExamMessage = "Kh??ng c?? danh s??ch ????ng k??";
                        shouldCreateExam = false;
                    } else if (!row.shouldCreateExam) {
                        couldNotCreateExamMessage = "M??n h???c c???a l???p t??n ch??? kh??ng c?? ????? thi";
                        shouldCreateExam = false;
                    } else if (
                        row.numberOfActiveStudents - row.numberOfMidTermExamCreated === 0 &&
                        row.numberOfActiveStudents - row.numberOfFinalTermExamCreated === 0
                    ) {
                        couldNotCreateExamMessage = "???? t???o ca thi cho t???t c??? sinh vi??n";
                        shouldCreateExam = false;
                    } else if (row.status) {
                        couldNotCreateExamMessage = "Kh??ng th??? t???o ca thi cho l???p t??n ch??? ???? h???y";
                        shouldCreateExam = false;
                    }

                    let couldNotCancelMessage = "",
                        couldNotDeleteMessage = "";
                    let shouldCancel = true,
                        shouldDelete = true;
                    if (row.exams.length > 0) {
                        // C?? ca thi m?? ph???i l?? ca thi ch??a h???y
                        // Ch??? c???n c?? 1 ca thi c??n ??ang thi th?? kh??ng th??? h???y l???p.
                        let shouldRealCancel = true;
                        row.exams.forEach(exam => {
                            console.log(exam.status);
                            if (!exam.status) {
                                // console.log(exam);
                                shouldRealCancel = false;
                                // break;
                            }
                        });

                        if (shouldRealCancel) {
                            shouldCancel = false;
                            couldNotCancelMessage = "C?? ca thi, kh??ng th??? h???y";
                            couldNotDeleteMessage = "C?? ca thi, kh??ng th??? x??a";
                        }
                    }

                    if (row.tempRegisters.length > 0) {
                        shouldDelete = false;
                        couldNotDeleteMessage = "C?? danh s??ch ????ng k??, kh??ng th??? x??a";
                    }

                    let shouldShowInfoMessage = "Xem th??ng tin l???p t??n ch???";
                    let shouldShowInfo = true;

                    if (row.tempRegisters.length === 0 && row.exams.length === 0) {
                        shouldShowInfoMessage = "Kh??ng c?? danh s??ch ????ng k?? l???n danh s??ch ca thi";
                        shouldShowInfo = false;
                    }

                    return (
                        <tr
                            className={`${tailwindCss.tr} ${
                                row.status && "bg-gray-200 hover:bg-gray-200"
                            }`}
                            key={row.id}
                        >
                            <td className={tailwindCss.tableCell}>
                                <Tooltip content={shouldShowInfoMessage}>
                                    <Button
                                        style={{ backgroundColor: "none" }}
                                        onClick={() => {
                                            $(`#viewCreditClassDetail${row.id}`).css(
                                                "display",
                                                "flex"
                                            );
                                        }}
                                        disabled={!shouldShowInfo}
                                    >
                                        {row.id}
                                    </Button>
                                    <TableModalViewer
                                        modalId={`viewCreditClassDetail${row.id}`}
                                        modalLabel='Th??ng tin l???p t??n ch???'
                                        ModalBody={
                                            <ViewDetails
                                                Header={
                                                    <Card>
                                                        <div
                                                            className='flex items-center justify-between w-3/6 m-auto
                                                        
                                                    '
                                                        >
                                                            <div>
                                                                <div>
                                                                    M??n h???c: {row.subjectName}
                                                                </div>
                                                                <div>Nh??m: {row.group}</div>
                                                                <div>
                                                                    T???ng ????ng k??:{" "}
                                                                    {row.tempRegisters.length}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div>
                                                                    Ni??n kh??a : {row.schoolYear}
                                                                </div>
                                                                <div>H???c k???: {row.semester}</div>{" "}
                                                                <div>
                                                                    T???ng ca thi: {row.exams.length}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                }
                                                labels={[
                                                    `Danh s??ch ????ng k?? (${row.tempRegisters.length})`,
                                                    `Danh s??ch ca thi (${row.exams.length})`,
                                                ]}
                                                data={[
                                                    <RegisterList registers={row.tempRegisters} />,
                                                    <ExamList
                                                        exams={row.exams}
                                                        numberOfActiveStudents={
                                                            row.numberOfActiveStudents
                                                        }
                                                        numberOfMidTermExam={
                                                            row.numberOfMidTermExam
                                                        }
                                                        numberOfMidTermExamCreated={
                                                            row.numberOfMidTermExamCreated
                                                        }
                                                        numberOfFinalTermExam={
                                                            row.numberOfFinalTermExam
                                                        }
                                                        numberOfFinalTermExamCreated={
                                                            row.numberOfFinalTermExamCreated
                                                        }
                                                    />,
                                                ]}
                                            />
                                        }
                                    />
                                </Tooltip>
                            </td>
                            <td className={tailwindCss.tableCell}>{row.schoolYear}</td>
                            <td className={tailwindCss.tableCell}>{row.semester}</td>
                            <td className={tailwindCss.tableCell}>{row.subjectName}</td>
                            <td className={tailwindCss.tableCell}>{row.group}</td>
                            <td className={tailwindCss.tableCell}>
                                {row.status ? (
                                    <Badge color='failure'>???? h???y</Badge>
                                ) : (
                                    <Badge color='success'>??ang m???</Badge>
                                )}
                            </td>
                            <td className={tailwindCss.tableCell}>{row.teacherName}</td>
                            <td className={`${tailwindCss.tableCell} flex items-center`}>
                                {userRoles.includes("Qu???n tr??? vi??n") && (
                                    <>
                                        <div className='mr-2'>
                                            <MyButton
                                                type={ButtonType.edit}
                                                onClick={() => {
                                                    $(`#creditClassModal`).css("display", "flex");
                                                    setIsEdit(true);
                                                    dispatch(setEditedCreditClass(row));
                                                }}
                                            />
                                        </div>
                                        <div className='mr-2'>
                                            <MyButton
                                                type={ButtonType.delete}
                                                onClick={() => {
                                                    dispatch(deleteCreditClass(row.id));
                                                }}
                                                disabled={!shouldDelete || !shouldCancel}
                                                customTooltipMessage={couldNotDeleteMessage}
                                            />
                                        </div>
                                        {/* <EnableOrDisable
                                            status={row.status}
                                            enableOrDisable={enableOrDisableCreditClass}
                                            id={row.id}
                                            creditClassPage={true}
                                            disabled={!shouldCancel}
                                            customTooltipMessage={couldNotCancelMessage}
                                        /> */}
                                    </>
                                )}
                                <div className='mx-2'>
                                    <Tooltip content={couldNotCreateExamMessage} placement='top'>
                                        <Button
                                            onClick={() => {
                                                $(`#examModal`).css("display", "flex");
                                                setCreditClassId(row.id);
                                                setValue("creditClassId", row.id);
                                            }}
                                            disabled={!shouldCreateExam}
                                        >
                                            <img src={ExamIcon} width='28px' height='28px' />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </td>
                        </tr>
                    );
                })}
        </tbody>
    );
}

export default CreditClassTableBody;
