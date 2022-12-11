import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Frame } from "../../components";
import SimpleStatNumber from "../../components/utils/SimpleStatNumber";
import { authState } from "../../features/authSlice";
import {
    countTestsBySubjectAndStatus,
    countTotalRecords,
    doughnut,
    statisticState,
} from "../../features/statisticSlice";
import { userState } from "../../features/userSlice";
import Datepicker from "../../partials/actions/Datepicker";
import PieChart from "../../partials/dashboard/PieChart";
import StackedBarChart from "../../partials/dashboard/StackedBarChart";
import WelcomeBanner from "../../partials/dashboard/WelcomeBanner";

function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { pathname } = useLocation();
    const { user } = useSelector(userState);
    const {
        countTotal,
        doughnut: { countQuestionsBySubject, countExamsByCreditClass },
        countTestsBySubjectAndStatuses,
    } = useSelector(statisticState);
    const {
        loginAction: { loading },
    } = useSelector(authState);

    useEffect(() => {
        dispatch(countTotalRecords());
        dispatch(doughnut());
        dispatch(countTestsBySubjectAndStatus());
    }, []);

    const countQuestionsBySubjectLabel = [];
    const countQuestionsBySubjectData = [];
    const countExamsByCreditClassLabel = [];
    const countExamsByCreditClassData = [];

    countQuestionsBySubject.forEach(({ numberOfQuestions, subjectName }) => {
        countQuestionsBySubjectLabel.push(subjectName);
        countQuestionsBySubjectData.push(numberOfQuestions);
    });
    countExamsByCreditClass.forEach(({ schoolYear, semester, grp, subjectName, numberOfExams }) => {
        countExamsByCreditClassLabel.push(`${schoolYear}-${semester}-${grp}-${subjectName}`);
        countExamsByCreditClassData.push(numberOfExams);
    });

    const countQuestionsBySubjectChart = {
        labels: countQuestionsBySubjectLabel,
        datasets: [
            {
                label: "# of Votes",
                data: countQuestionsBySubjectData,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const countExamsByCreditClassChart = {
        labels: countExamsByCreditClassLabel,
        datasets: [
            {
                label: "# of Votes",
                data: countExamsByCreditClassData,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const usedTests = [],
        notUsedTests = [];
    const countTestsBySubjectAndStatusesLabel = [];
    countTestsBySubjectAndStatuses.forEach(({ subjectName, used, notUsed }) => {
        countTestsBySubjectAndStatusesLabel.push(subjectName);
        usedTests.push(used);
        notUsedTests.push(notUsed);
    });

    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"THỐNG KÊ"}
            children={
                <>
                    <WelcomeBanner />
                    <div>
                        <div>
                            {" "}
                            <div className='flex items-center justify-between w-full'>
                                <SimpleStatNumber
                                    label='Tổng số  ca thi'
                                    type='All'
                                    backgroundColor={`bg-violet-500`}
                                    number={countTotal.totalExams}
                                    additionalData={[
                                        ["Đã thi", countTotal.totalExamsUsed],
                                        ["Chưa thi", countTotal.totalExamsNotUsed],
                                        ["Đã hủy", countTotal.totalExamsCancelled],
                                    ]}
                                />
                                <SimpleStatNumber
                                    label='Tổng số lớp tín chỉ '
                                    type='Approved'
                                    backgroundColor={`bg-rose-500`}
                                    number={countTotal.totalCreditClasses}
                                    additionalData={[
                                        ["Đang mở", countTotal.totalCreditClassesOpened],
                                        ["Đã hủy", countTotal.totalCreditClassesClosed],
                                        ["", 0],
                                        ,
                                    ]}
                                />
                                <SimpleStatNumber
                                    label='Tổng số môn học'
                                    type='Pending'
                                    backgroundColor={`bg-amber-500`}
                                    number={countTotal.totalSubjects}
                                />
                                <SimpleStatNumber
                                    label='Tổng số đề thi'
                                    type='Cancelled'
                                    backgroundColor={`bg-green-500`}
                                    number={countTotal.totalTests}
                                />
                                <SimpleStatNumber
                                    label='Tổng số câu hỏi'
                                    type='Cancelled'
                                    backgroundColor={`bg-green-500`}
                                    number={countTotal.totalQuestions}
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                Niên khóa: <Datepicker />
                            </div>
                            <div className='flex items-center justify-between w-full'>
                                <SimpleStatNumber
                                    label='Tổng số  ca thi'
                                    type='All'
                                    backgroundColor={`bg-violet-500`}
                                    number={countTotal.totalExams}
                                    additionalData={[
                                        ["Đã thi", countTotal.totalExamsUsed],
                                        ["Chưa thi", countTotal.totalExamsNotUsed],
                                        ["Đã hủy", countTotal.totalExamsCancelled],
                                    ]}
                                />
                                <SimpleStatNumber
                                    label='Tổng số lớp tín chỉ '
                                    type='Approved'
                                    backgroundColor={`bg-rose-500`}
                                    number={countTotal.totalCreditClasses}
                                />
                                <SimpleStatNumber
                                    label='Tổng số môn học'
                                    type='Pending'
                                    backgroundColor={`bg-amber-500`}
                                    number={countTotal.totalSubjects}
                                />
                                <SimpleStatNumber
                                    label='Tổng số đề thi'
                                    type='Cancelled'
                                    backgroundColor={`bg-green-500`}
                                    number={countTotal.totalTests}
                                />
                                <SimpleStatNumber
                                    label='Tổng số câu hỏi'
                                    type='Cancelled'
                                    backgroundColor={`bg-green-500`}
                                    number={countTotal.totalQuestions}
                                />
                            </div>
                        </div>

                        <div>
                            <div>Thống kê câu hỏi</div>
                            <div>
                                <div>Số câu hỏi theo môn học</div>
                                <div>
                                    <Doughnut
                                        data={countQuestionsBySubjectChart}
                                        height='400px'
                                        width='200px'
                                        options={{ maintainAspectRatio: false }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div>Thống kê đề thi</div>
                            <div>
                                <div>Số ca thi theo lớp tín chỉ</div>
                                <div>
                                    <div
                                        className='flex items-center'
                                        style={{ maxWidth: "1000px", position: "relative" }}
                                    >
                                        <PieChart
                                            data={countExamsByCreditClassData}
                                            labels={countExamsByCreditClassLabel}
                                            height='400px'
                                            width='200px'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='my-10'>
                            {countTestsBySubjectAndStatuses.length && (
                                <StackedBarChart
                                    data={[notUsedTests, usedTests]}
                                    labels={countTestsBySubjectAndStatusesLabel}
                                />
                            )}
                        </div>
                        <div className='my-10'>
                            {/* <LineChart
                                data={[lcdataSet11, lcdataSet22]}
                                label='Sales Over Time (all bookings)'
                            /> */}
                        </div>
                    </div>
                </>
            }
        />
    );
}

export default Dashboard;
