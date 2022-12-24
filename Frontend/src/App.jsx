import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./charts/ChartjsConfig";
import "./css/style.scss";

import { useSelector } from "react-redux";
import { persistUserState } from "./features/persistUserSlice";
import {
    CreditClassesPage,
    ExamsPage,
    LoginPage,
    QuestionsPage,
    RanksPage,
    RegistersPage,
    RegisterUserPage,
    RolesPage,
    SubjectsPage,
    TakeTestPage,
    TestsPage,
    UsersPage,
} from "./pages";
import Dashboard from "./pages/dashboard/Dashboard";
import ViewOldExamsPage from "./pages/exams/ViewOldExamsPage";
import ViewExamDetailPage from "./pages/takeTests/ViewExamDetailPage";

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
    if (!user) {
        HomePage = <LoginPage />;
    } else {
        if (userRoles.includes("Quản trị viên")) {
            HomePage = <Dashboard />;
        } else if (userRoles.includes("Giảng viên")) {
            HomePage = <QuestionsPage />;
        } else {
            HomePage = <RanksPage />;
        }
    }

    return (
        <>
            <Routes>
                <Route exact path='/' element={HomePage} />
                <Route path='/statistics' element={<Dashboard />} />
                <Route path='/auth/login' element={<LoginPage />} />
                <Route path='/auth/register' element={<RegisterUserPage />} />
                <Route path='/auth/edit/:userId' element={<RegisterUserPage />} />
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
