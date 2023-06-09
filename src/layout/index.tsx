import React, {useState} from 'react'
import {Box, useTheme, Toolbar, alpha} from '@mui/material'
import {Outlet} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux"

import ThemeTopbar from "../components/theme-topbar/theme-topbar"
import ThemeDrawer from "../components/theme-drawer"
import ThemeSnackbar from "../components/theme-snackbar"

import {RootState} from "../store/store"
import {updateColorMode} from "../slices/color-mode-slice"


export default function Layout() {

    const theme = useTheme()
    const errorMessage = useSelector((state: RootState) => state.snackbarMessage.message)


    const dispatch = useDispatch()

    const changeColorMode = () => {
        if (theme.palette.mode == 'dark')
            dispatch(updateColorMode('light'))
        else dispatch(updateColorMode('dark'))
    }


    const [open, setOpen] = useState(false)
    const toggleDrawer = () => setOpen(prevState => !prevState)


    return (
        <Box sx={{
            display: 'flex',
            gap: 0,
            '& main': {
                flexGrow: 1,
                p: '5px',
                display: 'flex',
                flexFlow: 'column',
                minHeight: '100vh',
                mx: 'auto',
                // maxWidth: '100%'
                maxWidth: {xs: 'calc(100vw - 1rem)', md: open ? `calc(100vw - 240px)` : `calc(100vw - calc(${theme.spacing(9)} + 1px))`},
            },
            '& input::-webkit-file-upload-button': {
                fontSize: '12px',
                borderRadius: '20px',
                background: alpha(theme.palette.primary.main, 1),
                border: `2px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.contrastText,
            },
            // '& .MuiTooltip-popper .MuiTooltip-tooltip': {
            //     background: '#fff !important',
            //     padding: '10px 16px',
            //     borderRadius: '12px',
            //     color: theme.palette.text.secondary,
            //     boxShadow: ' 0 0 12px -3px #83838380',
            // },
        }}>
            <ThemeDrawer open={open} toggleDrawer={toggleDrawer} setOpen={setOpen}/>
            <ThemeTopbar open={open} toggleDrawer={toggleDrawer} toggleTheme={changeColorMode}/>
            <Box component="main">
                <Toolbar sx={{mb: 1}}/>
                <Outlet/>
            </Box>
            <ThemeSnackbar message={errorMessage}/>
        </Box>
    )
}
