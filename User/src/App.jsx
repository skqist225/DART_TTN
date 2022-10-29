import React from "react";
import { Route, Routes } from "react-router-dom";
import "./css/style.scss";
import "./charts/ChartjsConfig";
import { HomePage, LoginPage, TestsPage } from "./pages";

function App() {
    return (
        <>
            <Routes>
                <Route exact path='/' element={<HomePage />} />
                <Route path='/auth'>
                    <Route path='login' element={<LoginPage />} />
                </Route>
                <Route exact path='/tests'>
                    <Route path=':id' element={<TestsPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
