import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {AlertColor} from "@mui/material";
import {SnackbarOrigin} from "@mui/material/Snackbar";

export interface SnackbarMessage {
    key?: string,
    title?: string,
    message: string,
    severity?: AlertColor,
}

const initialState: SnackbarMessage = {
    key: '',
    title: '',
    message: '',
    severity: "info",
}

export const snackbarMessageSlice = createSlice({
    name: 'snackbarMessage',
    initialState,
    reducers: {
        updateSnackbarMessage: (state, action: PayloadAction<SnackbarMessage>) => {
            state.key = action.payload?.key
            state.title = action.payload?.title
            state.message = action.payload?.message
            state.severity = action.payload?.severity
        },
    },
})

export const {updateSnackbarMessage} = snackbarMessageSlice.actions

export default snackbarMessageSlice.reducer