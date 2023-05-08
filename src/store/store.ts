import {applyMiddleware, configureStore} from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import {combineReducers} from "redux";
import {persistReducer} from 'redux-persist'
import thunkMiddleware from 'redux-thunk'

import pageTitleSlice from '../slices/page-title-slice'
import colorModeSlice from '../slices/color-mode-slice'
import snackbarMessageSlice from '../slices/snackbar-message-slice'
import userAuthSlice from '../slices/auth-slice'


const reducers = combineReducers({
    pageTitle: pageTitleSlice,
    colorMode: colorModeSlice,
    snackbarMessage: snackbarMessageSlice,
    userAuth: userAuthSlice,
})

const persistConfig = {
    key: 'root',
    storage: storage,
    blacklist: ['snackbarMessageReducer'],
    // middleware: [thunkMiddleware],
    // whitelist: ['authReducer'] // reducers to be persisted
}

const persistedReducer = persistReducer(persistConfig, reducers)


const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunkMiddleware],
});

export default store


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch