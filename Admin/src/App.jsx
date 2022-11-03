import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./css/style.scss";
import "./charts/ChartjsConfig";

import Dashboard from "./pages/Dashboard";
import { ChaptersPage, ClassesPage, QuestionsPage, SubjectsPage, UsersPage } from "./pages";
import LoginPage from "./pages/auth/LoginPage";
import TestsPage from "./pages/tests/TestsPage";

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
                <Route path='/auth'>
                    <Route path='login' element={<LoginPage />} />
                </Route>

                <Route path='/chapters'>
                    <Route path='' element={<ChaptersPage />} />
                </Route>

                <Route path='/subjects'>
                    <Route path='' element={<SubjectsPage />} />
                </Route>

                <Route path='/questions'>
                    <Route path='' element={<QuestionsPage />} />
                </Route>

                <Route path='/tests'>
                    <Route path='' element={<TestsPage />} />
                </Route>

                <Route path='/users'>
                    <Route path='' element={<UsersPage />} />
                </Route>

                <Route path='/classes'>
                    <Route path='' element={<ClassesPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
