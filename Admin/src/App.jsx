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
} from "./pages";

function App() {
    const location = useLocation();

    useEffect(() => {
        document.querySelector("html").style.scrollBehavior = "auto";
        window.scroll({ top: 0 });
        document.querySelector("html").style.scrollBehavior = "";
    }, [location.pathname]); // triggered on route change

    return (
        <>
            <Routes>
                <Route exact path='/' element={<Dashboard />} />
                <Route path='/statistics' element={<Dashboard />} />
                <Route path='/auth' element={<LoginPage />} />
                <Route path='/subjects' element={<SubjectsPage />} />
                <Route path='/questions' element={<QuestionsPage />} />
                <Route path='/tests' element={<TestsPage />} />
                <Route path='/users' element={<UsersPage />} />
                <Route path='/creditClasses' element={<CreditClassesPage />} />
                <Route path='/registers' element={<RegistersPage />} />
                <Route path='/exams' element={<ExamsPage />} />
                <Route path='/roles' element={<RolesPage />} />
            </Routes>
        </>
    );
}

export default App;
