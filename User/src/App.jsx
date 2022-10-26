import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./css/style.scss";
import "./charts/ChartjsConfig";
import { HomePage, LoginPage } from "./pages";

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
                <Route exact path='/' element={<HomePage />} />
                <Route path='/auth'>
                    <Route path='login' element={<LoginPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
