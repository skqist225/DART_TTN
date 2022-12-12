import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import { Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Frame, Select } from "../../components";
import SimpleStatNumber from "../../components/utils/SimpleStatNumber";
import { authState } from "../../features/authSlice";
import {
    countQuestionsByChapter,
    countTestsBySubjectAndStatus,
    countTotalRecords,
    doughnut,
    statisticState,
} from "../../features/statisticSlice";
import { fetchAllSubjects } from "../../features/subjectSlice";
import { userState } from "../../features/userSlice";
import Datepicker from "../../partials/actions/Datepicker";
import PieChart from "../../partials/dashboard/PieChart";
import StackedBarChart from "../../partials/dashboard/StackedBarChart";
import WelcomeBanner from "../../partials/dashboard/WelcomeBanner";
import { subjectState } from "../../features/subjectSlice";
import { useForm } from "react-hook-form";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
    responsive: true,
    plugins: {
        // legend: {
        //     position: "top",
        // },
        title: {
            display: true,
            text: "Thống kê số câu hỏi theo môn học",
        },
    },
};

function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useSelector(userState);
    const {
        register,
        setValue,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({});

    const {
        countTotal,
        doughnut: { countQuestionsBySubject, countExamsByCreditClass },
        countTestsBySubjectAndStatuses,
    } = useSelector(statisticState);
    const {
        loginAction: { loading },
    } = useSelector(authState);
    const { subjects } = useSelector(subjectState);

    useEffect(() => {
        dispatch(countTotalRecords());
        dispatch(doughnut());
        dispatch(countTestsBySubjectAndStatus());
        dispatch(fetchAllSubjects({ page: 0, haveChapter: true, haveQuestion: true }));
    }, []);

    const bgs = ["rgb(255, 99, 132)", "rgb(75, 192, 192)", "rgb(53, 162, 235)"];

    const questionBySubjectBarChartData = {
        labels: countQuestionsBySubject.map(({ subjectName }) => subjectName),
        datasets: [
            {
                label: "Số câu hỏi",
                data: countQuestionsBySubject.map(({ numberOfQuestions }) => numberOfQuestions),
                backgroundColor: bgs[2],
            },
        ],
    };

    const usedTests = [],
        notUsedTests = [],
        cancelleds = [];
    const countTestsBySubjectAndStatusesLabel = [];
    countTestsBySubjectAndStatuses.forEach(({ subjectName, used, notUsed, cancelled }) => {
        countTestsBySubjectAndStatusesLabel.push(subjectName);
        usedTests.push(used);
        notUsedTests.push(notUsed);
        cancelleds.push(cancelled);
    });

    useEffect(() => {
        if (subjects && subjects.length) {
            handleSubjectChange({ target: { value: subjects[0].id } });
        }
    }, [subjects]);

    const handleSubjectChange = ({ target: { value } }) => {
        dispatch(countQuestionsByChapter({ subject: value }));
    };

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
                            <div>
                                Niên khóa: <Datepicker />
                            </div>
                            <div className='flex items-center justify-between w-full'>
                                <SimpleStatNumber
                                    label='Tổng số  ca thi'
                                    backgroundColor={`bg-violet-500`}
                                    number={countTotal.totalExams}
                                    additionalData={[
                                        ["Đã thi", countTotal.totalExamsUsed],
                                        ["Chưa thi", countTotal.totalExamsNotUsed],
                                        ["Đã hủy", countTotal.totalExamsCancelled],
                                        ["", 0],
                                    ]}
                                />
                                <SimpleStatNumber
                                    label='Tổng số lớp tín chỉ '
                                    backgroundColor={`bg-rose-500`}
                                    number={countTotal.totalCreditClasses}
                                    additionalData={[
                                        ["Đang mở", countTotal.totalCreditClassesOpened],
                                        ["Đã hủy", countTotal.totalCreditClassesClosed],
                                        ["", 0],
                                        ["", 0],
                                    ]}
                                />
                                <SimpleStatNumber
                                    label='Tổng số môn học'
                                    backgroundColor={`bg-amber-500`}
                                    number={countTotal.totalSubjects}
                                    additionalData={[
                                        ["Đang mở", countTotal.totalCreditClassesOpened],
                                        ["Đã hủy", countTotal.totalCreditClassesClosed],
                                        ["", 0],
                                        ["", 0],
                                    ]}
                                />
                                <a href='#testStat'>
                                    <SimpleStatNumber
                                        label='Tổng số đề thi'
                                        backgroundColor={`bg-green-500`}
                                        number={countTotal.totalTests}
                                        additionalData={[
                                            ["Đã SD", countTotal.totalTestsUsed],
                                            ["Chưa SD", countTotal.totalTestsNotUsed],
                                            ["Đã hủy", countTotal.totalTestsCancelled],
                                            ["", 0],
                                        ]}
                                    />
                                </a>
                                <a href='#questionStat'>
                                    <SimpleStatNumber
                                        label='Tổng số câu hỏi'
                                        backgroundColor={`bg-blue-500`}
                                        number={countTotal.totalQuestions}
                                        additionalData={[
                                            ["Đang sử dụng", countTotal.totalQuestionsActive],
                                            ["Đã hủy", countTotal.totalQuestionsDisabled],
                                            ["", 0],
                                            ["", 0],
                                        ]}
                                    />
                                </a>
                                <SimpleStatNumber
                                    label='Tổng số người dùng'
                                    backgroundColor={`bg-fuchsia-800`}
                                    number={countTotal.totalUsers}
                                    additionalData={[
                                        ["QTV", countTotal.totalUsersAdmin],
                                        ["GV", countTotal.totalUsersTeacher],
                                        ["QTV+GV", countTotal.totalUsersTeacherAndAdmin],
                                        ["SV", countTotal.totalUsersStudent],
                                    ]}
                                />
                            </div>
                        </div>
                        <div></div>

                        <div className='w-full' id='questionStat'>
                            <Card>
                                <div className='uppercase flex items-center justify-center w-full font-semibold text-blue-500'>
                                    Thống kê câu hỏi
                                </div>
                            </Card>
                            <div className='w-3/6'>
                                <div className='max-w-6xl'>
                                    <Bar data={questionBySubjectBarChartData} options={options} />
                                </div>
                            </div>
                            <div className='w-3/6'>
                                <div className='mr-5 w-full'>
                                    <Select
                                        label='Môn học'
                                        register={register}
                                        name='subject'
                                        options={subjects.map(subject => ({
                                            title: subject.id.includes("CLC")
                                                ? `${subject.name} CLC`
                                                : `${subject.name}`,
                                            value: subject.id,
                                        }))}
                                        setValue={setValue}
                                        onChangeHandler={handleSubjectChange}
                                        defaultValue={subjects && subjects.length && subjects[0].id}
                                    />
                                </div>
                                <div className='max-w-6xl'>
                                    <Bar data={questionBySubjectBarChartData} options={options} />
                                </div>
                            </div>
                        </div>

                        <div className='w-full' id='testStat'>
                            <Card>
                                <div className='uppercase flex items-center justify-center w-full font-semibold text-green-500 '>
                                    Thống kê đề thi
                                </div>
                            </Card>
                            <div className='flex items-center'>
                                <div className='w-3/6'>
                                    <div className='max-w-6xl'>
                                        <div className='flex items-center max-w-xl'>
                                            <PieChart
                                                data={countExamsByCreditClass.map(
                                                    ({ numberOfExams }) => numberOfExams
                                                )}
                                                labels={countExamsByCreditClass.map(
                                                    ({ schoolYear, semester, grp, subjectName }) =>
                                                        `${schoolYear}-${semester}-${grp}-${subjectName}`
                                                )}
                                                height='400px'
                                                width='200px'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>{" "}
                            <div>
                                <div className='my-10'>
                                    {countTestsBySubjectAndStatuses.length && (
                                        <StackedBarChart
                                            data={[notUsedTests, usedTests, cancelleds]}
                                            labels={countTestsBySubjectAndStatusesLabel}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* <div className='my-10'>
                            <LineChart
                                data={[lcdataSet11, lcdataSet22]}
                                label='Sales Over Time (all bookings)'
                            />
                        </div> */}
                    </div>
                </>
            }
        />
    );
}

export default Dashboard;
