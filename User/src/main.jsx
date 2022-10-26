import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import GlobalStyle from "./globalStyle";
import persistStore from "redux-persist/es/persistStore";
import { PersistGate } from "redux-persist/integration/react";

export let persistor = persistStore(store);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <App />
                    <GlobalStyle />
                </Router>
            </PersistGate>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);
