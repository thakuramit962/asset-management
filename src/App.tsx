import React from 'react';
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {BrowserRouter} from "react-router-dom";
import {persistStore} from 'redux-persist';
import store from "./store/store";
import WebRoutes from "./web-routes";
import LoadingView from "./components/loading-view";
import './App.css'


export default function App() {

    let persistor = persistStore(store);

    return (
        <Provider store={store}>
            <PersistGate loading={<LoadingView/>} persistor={persistor}>
                <BrowserRouter>
                    <WebRoutes/>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    )
}