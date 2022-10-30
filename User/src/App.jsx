import React from "react";
import { Route, Routes } from "react-router-dom";
import "./css/style.scss";
import { HomePage, LoginPage, TakeTestPage, TestsPage } from "./pages";

function App() {
    return (
        <>
            <Routes>
                <Route exact path='/' element={<HomePage />} />
                <Route path='/auth'>
                    <Route path='login' element={<LoginPage />} />
                </Route>
                <Route exact path='/tests'>
                    <Route path=':subjectId' element={<TestsPage />} />
                </Route>

                <Route exact path='/take-test'>
                    <Route path=':testId' element={<TakeTestPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
