import React, {useState} from 'react'
import Snackbar, {SnackbarOrigin} from "@mui/material/Snackbar";
import {Alert, AlertColor, AlertTitle, IconButton, Slide, SlideProps} from "@mui/material";
import {CloseOutlined} from "@mui/icons-material";
import {updateSnackbarMessage} from "../../slices/snackbar-message-slice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";


export interface SnackbarProps {
    key?: string,
    title?: string,
    message: string,
    severity?: AlertColor,
}


const TransitionLeft = (props: SlideProps) => <Slide {...props} direction="left"/>


export default function ThemeSnackbar(props: SnackbarProps) {

    const dispatch = useDispatch()

    const snackbarData = useSelector((state: RootState) => state.snackbarMessage)
    const errorMessage = snackbarData?.message

    const {
        key, title, severity = 'error'
    } = props

    const closeSnackbar = () => {
        dispatch(updateSnackbarMessage(
            {
                key: '',
                title: '',
                message: '',
                severity: "info",
            }
        ))
    }

    return (
        <Snackbar
            key={key}
            open={!!(snackbarData?.message)}
            onClose={closeSnackbar}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            autoHideDuration={2500}
            TransitionComponent={TransitionLeft}
            sx={{
                '& .MuiAlert-root': {
                    minHeight: '4rem',
                    borderRadius: '12px',
                    alignItems: 'center',
                }
            }}>
            <Alert
                variant={'filled'}
                severity={snackbarData?.severity ?? 'info'}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={closeSnackbar}>
                        <CloseOutlined fontSize="inherit"/>
                    </IconButton>
                }>
                {snackbarData?.title && <AlertTitle>{snackbarData?.title}</AlertTitle>}
                {snackbarData?.message}
            </Alert>
        </Snackbar>)
}
