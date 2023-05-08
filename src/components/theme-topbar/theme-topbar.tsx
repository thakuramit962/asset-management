import React from 'react'
import {AppBar, Toolbar, Typography, IconButton, useTheme, Stack, Avatar, alpha, MenuItem} from "@mui/material"
import {Brightness4Rounded, Brightness7Rounded, Menu, MenuOpenRounded} from '@mui/icons-material'
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import UserMenu from "./user-menu";
import ThemeInput from "../inputs/theme-input";
import GlobalSearch from "../global-search";


export default function ThemeTopbar(props: any) {

    const {open, toggleDrawer} = props

    const theme = useTheme()

    const pageTitle = useSelector((state: RootState) => state.pageTitle.title)
    const isLoggedIn = true


    return (
        <AppBar position={'fixed'} sx={{
            zIndex: {xs: theme.zIndex.drawer - 1},
            width: '100%',
            p: 0,
            pl: {md: open ? '240px' : '65px'},
            background: alpha(theme.palette.background.paper, 0.2),
            backdropFilter: 'blur(22px)',
            boxShadow: '0 2px 10px -4px #83838360',
            color: theme.palette.text.primary,
        }}>
            <Toolbar sx={{
                justifyContent: 'space-between',
            }}>
                <Stack direction={'row'} alignItems={'center'}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        edge="start"
                        sx={{mr: 2,}}>
                        {open ? <MenuOpenRounded/> : <Menu/>}
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" onClick={props.toggleTheme}>
                        {pageTitle}
                    </Typography>
                </Stack>

                <Stack direction={'row'} alignItems={'center'} flex={1} justifyContent={'end'}>

                    <GlobalSearch sxProps={{width: 'min(50%, 350px)', display: {xs: 'none', sm: 'flex'}}}/>

                    <IconButton sx={{ml: 1}} onClick={props.toggleTheme} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Rounded/> : <Brightness4Rounded/>}
                    </IconButton>
                    {isLoggedIn && <UserMenu/>}
                </Stack>
            </Toolbar>
        </AppBar>
    )
}



