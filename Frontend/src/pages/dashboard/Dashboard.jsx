import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { fetchAllSubjects, subjectState } from "../../features/subjectSlice";
import { userState } from "../../features/userSlice";
import BarChart from "../../partials/dashboard/BarChart";
import PieChart from "../../partials/dashboard/PieChart";
import StackedBarChart from "../../partials/dashboard/StackedBarChart";
import WelcomeBanner from "../../partials/dashboard/WelcomeBanner";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
);

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
    countQuestionsByChapters,
  } = useSelector(statisticState);
  const {
    loginAction: { loading },
  } = useSelector(authState);
  const { subjects } = useSelector(subjectState);

  useEffect(() => {
    dispatch(countTotalRecords());
    dispatch(doughnut());
    dispatch(countTestsBySubjectAndStatus());
    dispatch(
      fetchAllSubjects({ page: 0, haveChapter: true, haveQuestion: true })
    );
  }, []);

  const bgs = ["rgb(255, 99, 132)", "rgb(75, 192, 192)", "rgb(53, 162, 235)"];

  const usedTests = [],
    notUsedTests = [],
    cancelleds = [];
  const testsStackBarChartLabels = [];
  countTestsBySubjectAndStatuses.forEach(
    ({ subjectName, used, notUsed, cancelled }) => {
      testsStackBarChartLabels.push(subjectName);
      usedTests.push(used);
      notUsedTests.push(notUsed);
      cancelleds.push(cancelled);
    }
  );

  const easyQuestions = [],
    mediumQuestions = [],
    hardQuestions = [];
  let totalEasyQuestions = 0,
    totalMediumQuestions = 0,
    totalHardQuestions = 0;
  const questionsStackBarChartLabels = [];
  countQuestionsByChapters.forEach(
    ({
      chapterName,
      numberOfEasyQuestions,
      numberOfMediumQuestions,
      numberOfHardQuestions,
    }) => {
      totalEasyQuestions += numberOfEasyQuestions || 0;
      totalMediumQuestions += numberOfMediumQuestions || 0;
      totalHardQuestions += numberOfHardQuestions || 0;

      questionsStackBarChartLabels.push(chapterName);
      easyQuestions.push(numberOfEasyQuestions);
      mediumQuestions.push(numberOfMediumQuestions);
      hardQuestions.push(numberOfHardQuestions);
    }
  );

  const chartData = {
    labels: countQuestionsBySubject.map(({ subjectName }) => subjectName),
    datasets: [
      {
        label: "Số câu hỏi",
        data: countQuestionsBySubject.map(
          ({ numberOfQuestions }) => numberOfQuestions
        ),
        backgroundColor: bgs[2],
      },
    ],
  };

  useEffect(() => {
    if (subjects && subjects.length) {
      handleSubjectChange({ target: { value: subjects[0].id } });
    }
  }, [subjects]);

  const handleSubjectChange = ({ target: { value } }) => {
    dispatch(countQuestionsByChapter({ subject: value }));
  };

  const polarData = {
    labels: [
      "Quản trị viên",
      "Giảng viên",
      "Quản trị viên, Giảng viên",
      "Sinh viên",
    ],
    datasets: [
      {
        label: "# of Votes",
        data: [
          countTotal.totalUsersAdmin,
          countTotal.totalUsersTeacher,
          countTotal.totalUsersTeacherAndAdmin,
          countTotal.totalUsersStudent,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderWidth: 1,
      },
    ],
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
              <div className="flex items-center justify-between w-full max-w-screen">
                <a href="#testStat">
                  <SimpleStatNumber
                    label="Tổng số  ca thi"
                    backgroundColor={`bg-violet-500`}
                    number={countTotal.totalExams}
                    additionalData={[
                      ["Đã thi", countTotal.totalExamsUsed],
                      ["Chưa thi", countTotal.totalExamsNotUsed],
                      ["Đã hủy", countTotal.totalExamsCancelled],
                      ["", 0],
                    ]}
                  />{" "}
                </a>{" "}
                <a href="#testStat">
                  <SimpleStatNumber
                    label="Tổng số lớp tín chỉ "
                    backgroundColor={`bg-rose-500`}
                    number={countTotal.totalCreditClasses}
                    additionalData={[
                      ["Đang mở", countTotal.totalCreditClassesOpened],
                      ["Đã hủy", countTotal.totalCreditClassesClosed],
                      ["", 0],
                      ["", 0],
                    ]}
                  />
                </a>
                <a href="#testStat">
                  <SimpleStatNumber
                    label="Tổng số môn học"
                    backgroundColor={`bg-amber-500`}
                    number={countTotal.totalSubjects}
                    additionalData={[
                      ["Đang mở", countTotal.totalCreditClassesOpened],
                      ["Đã hủy", countTotal.totalCreditClassesClosed],
                      ["", 0],
                      ["", 0],
                    ]}
                  />
                </a>
                <a href="#testStat">
                  <SimpleStatNumber
                    label="Tổng số đề thi"
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
                <a href="#questionStat">
                  <SimpleStatNumber
                    label="Tổng số câu hỏi"
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
                <a href="#userStat">
                  <SimpleStatNumber
                    label="Tổng số người dùng"
                    backgroundColor={`bg-fuchsia-800`}
                    number={countTotal.totalUsers}
                    additionalData={[
                      ["QTV", countTotal.totalUsersAdmin],
                      ["GV", countTotal.totalUsersTeacher],
                      ["QTV+GV", countTotal.totalUsersTeacherAndAdmin],
                      ["SV", countTotal.totalUsersStudent],
                    ]}
                  />
                </a>
              </div>
            </div>
            <div></div>

            <div className="w-full" id="questionStat">
              <Card>
                <div className="uppercase flex items-center justify-center w-full font-semibold text-blue-500">
                  Thống kê câu hỏi
                </div>
              </Card>
              <div className="flex items-start">
                <div className="flex w-50 p-2 h-full">
                  <BarChart
                    data={chartData}
                    title={"Thống kê số câu hỏi còn sử dụng theo môn học"}
                  />
                </div>
                <div className="col-flex w-50 p-2">
                  <StackedBarChart
                    data={[easyQuestions, mediumQuestions, hardQuestions]}
                    labels={questionsStackBarChartLabels}
                    title={`Thống kê câu hỏi còn sử dụng theo chương và độ khó (${
                      totalEasyQuestions +
                      totalMediumQuestions +
                      totalHardQuestions
                    })`}
                    legends={[
                      `Dễ (${totalEasyQuestions})`,
                      `Trung bình (${totalMediumQuestions})`,
                      `Khó (${totalHardQuestions})`,
                    ]}
                    Filter={
                      <>
                        <Select
                          label="Môn học"
                          register={register}
                          name="subject"
                          options={subjects.map((subject) => ({
                            title: subject.id.includes("CLC")
                              ? `${subject.name} CLC`
                              : `${subject.name}`,
                            value: subject.id,
                          }))}
                          setValue={setValue}
                          onChangeHandler={handleSubjectChange}
                          defaultValue={
                            subjects && subjects.length && subjects[0].id
                          }
                        />
                      </>
                    }
                  />
                </div>
              </div>
            </div>

            <div className="w-full" id="testStat">
              <Card>
                <div className="uppercase flex items-center justify-center w-full font-semibold text-green-500 ">
                  Thống kê đề thi
                </div>
              </Card>
              <div className="flex items-center">
                {/* <div className='flex w-50'>
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
                                </div> */}
                <div className="flex w-50">
                  <StackedBarChart
                    data={[notUsedTests, usedTests, cancelleds]}
                    labels={testsStackBarChartLabels}
                    title="Trạng thái trạng thái đề thi theo môn học"
                    legends={["Đã sử dụng", "Chưa sử dụng", "Đã hủy"]}
                  />
                </div>
              </div>
            </div>

            <div className="w-full" id="testStat">
              <Card>
                <div className="uppercase flex items-center justify-center w-full font-semibold text-green-500 ">
                  Thống kê ca thi
                </div>
              </Card>
              <div className="flex items-center">
                <div className="flex w-50">
                  {/* <PieChart
                                        data={countExamsByCreditClass.map(
                                            ({ numberOfExams }) => numberOfExams
                                        )}
                                        labels={countExamsByCreditClass.map(
                                            ({ schoolYear, semester, grp, subjectName }) =>
                                                `${schoolYear}-${semester}-${grp}-${subjectName}`
                                        )}
                                        height='400px'
                                        width='200px'
                                    /> */}
                </div>
                <div className="flex w-50"></div>
              </div>
            </div>

            <div className="w-full" id="userStat">
              <Card>
                <div className="uppercase flex items-center justify-center w-full font-semibold text-green-500 ">
                  Thống kê người dùng
                </div>
              </Card>
              <div className="flex items-center">
                <div className="max-h-6">
                  <PieChart
                    data={[
                      countTotal.totalUsersAdmin,
                      countTotal.totalUsersTeacher,
                      countTotal.totalUsersTeacherAndAdmin,
                      countTotal.totalUsersStudent,
                    ]}
                    labels={[
                      `Quản trị viên (${countTotal.totalUsersAdmin})`,
                      `Giảng viên (${countTotal.totalUsersTeacher})`,
                      `Quản trị viên, Giảng viên (${countTotal.totalUsersTeacherAndAdmin})`,
                      `Sinh viên (${countTotal.totalUsersStudent})`,
                    ]}
                  />
                </div>
                <div className="flex w-50"></div>
              </div>
            </div>
          </div>
        </>
      }
    />
  );
}

export default Dashboard;
