import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./css/style.scss";
import "./charts/ChartjsConfig";

import Dashboard from "./pages/Dashboard";
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

function App() {
    const location = useLocation();

    useEffect(() => {
        document.querySelector("html").style.scrollBehavior = "auto";
        window.scroll({ top: 0 });
        document.querySelector("html").style.scrollBehavior = "";
    }, [location.pathname]); // triggered on route change

    const { userRoles } = useSelector(persistUserState);

    return (
        <>
            <Routes>
                {userRoles.includes("Giảng viên", "Quản trị viên") ? (
                    <Route exact path='/' element={<Dashboard />} />
                ) : (
                    <Route exact path='/' element={<RanksPage />} />
                )}
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
            </Routes>
        </>
    );
}

export default App;
