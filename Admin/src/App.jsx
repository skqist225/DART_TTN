import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./css/style.scss";
import "./charts/ChartjsConfig";

import Dashboard from "./pages/dashboard/Dashboard";
import {
    CreditClassesPage,
    ExamsPage,
    QuestionsPage,
    RolesPage,
    SubjectsPage,
    UsersPage,
    TestsPage,
    LoginPage,
    RegistersPage,
    TakeTestPage,
    RanksPage,
} from "./pages";
import { useSelector } from "react-redux";
import { persistUserState } from "./features/persistUserSlice";
import ViewExamDetailPage from "./pages/takeTests/ViewExamDetailPage";
import ViewOldExamsPage from "./pages/exams/ViewOldExamsPage";

function App() {
    const location = useLocation();

    useEffect(() => {
        document.querySelector("html").style.scrollBehavior = "auto";
        window.scroll({ top: 0 });
        document.querySelector("html").style.scrollBehavior = "";
    }, [location.pathname]); // triggered on route change

    const { user } = useSelector(persistUserState);
    const userRoles = (user && user.roles.map(({ name }) => name)) || [];

    let HomePage = null;
    if (userRoles.includes("Quản trị viên")) {
        HomePage = <Dashboard />;
    } else if (userRoles.includes("Giảng viên")) {
        HomePage = <QuestionsPage />;
    } else {
        HomePage = <RanksPage />;
    }

    return (
        <>
            <Routes>
                <Route path='/' element={HomePage} />
                <Route path='/statistics' element={<Dashboard />} />
                <Route path='/auth/login' element={<LoginPage />} />
                <Route path='/subjects' element={<SubjectsPage />} />
                <Route path='/questions' element={<QuestionsPage />} />
                <Route path='/tests' element={<TestsPage />} />
                <Route path='/users' element={<UsersPage />} />
                <Route path='/creditClasses' element={<CreditClassesPage />} />
                <Route path='/registers' element={<RegistersPage />} />
                <Route path='/exams' element={<ExamsPage />} />
                <Route path='/roles' element={<RolesPage />} />
                <Route path='/takeTest' element={<TakeTestPage />} />
                <Route path='/ranks' element={<RanksPage />} />
                <Route path='/viewExams' element={<ExamsPage />} />
                <Route path='/viewOldExams' element={<ViewOldExamsPage />} />
                <Route path='/viewExamsDetail'>
                    <Route path=':examId' element={<ViewExamDetailPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
