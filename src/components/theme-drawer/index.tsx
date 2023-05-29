import React, {useState} from 'react';
import {
    Typography,
    Drawer,
    useTheme,
    Theme,
    CSSObject, useMediaQuery, alpha, Toolbar, MenuItem, Stack
} from '@mui/material'

// import logo from '../../assets/images/logo.png'
import logo from '../../assets/images/asset-logo.svg'

import DrawerItems from "./drawer-items";
import {Box} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ThemeInput from "../inputs/theme-input";
import GlobalSearch from "../global-search";


const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});


export default function ThemeDrawer(props: any) {


    const theme = useTheme();
    const {open, toggleDrawer, setOpen} = props

    const navigate = useNavigate()
    const isSmallScreen = useMediaQuery('(max-width:900px)')

    let [hoveredState, setHoveredState] = useState(false)

    return (
        <Drawer variant={isSmallScreen ? 'temporary' : 'permanent'} open={open} onClose={toggleDrawer}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                    ...(open && {
                        ...openedMixin(theme),
                        '& .MuiDrawer-paper': openedMixin(theme),
                    }),
                    ...(!open && {
                        ...closedMixin(theme),
                        '& .MuiDrawer-paper': closedMixin(theme),
                    }),
                    '& .MuiSelect-select':{
                        color: '#fff'
                    },
                    '& .MuiPaper-root': {
                        background: theme.palette.background.default,
                        // background: `radial-gradient(${alpha(theme.palette.secondary.main, 0.4)},${alpha(theme.palette.primary.dark, 0.4)}) ${theme.palette.primary.dark}`,
                        transition: 'all 300ms ease-in-out',
                        '& a': {
                            textDecoration: 'none',
                            // color: '#fff',
                        },
                        '& .MuiTypography-root': {
                            fontSize: '0.875rem',
                            color: theme.palette.text.primary,
                        },
                        '& .activeNavlink .MuiListItemButton-root': {
                            // backgroundColor: '#00000021',

                        },
                        '& .activeNavlink .MuiListItem-root': {
                            borderLeft: `2px solid ${theme.palette.primary.main}`,
                            '& .MuiListItemButton-root svg': {
                                color: theme.palette.text.primary,
                            },
                        },
                        '& .MuiListItem-root': {
                            display: 'block',
                            overflow: 'hidden',
                            borderRadius: '10px',
                            marginInline: '8px',
                            width: 'auto',
                            '& .MuiListItemButton-root': {
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                py: '6px',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.text.secondary, 0.05),
                                },
                                '& svg': {
                                    color: theme.palette.text.secondary,
                                    // color: theme.palette.primary.contrastText,
                                    height: '20px',
                                    width: '20px',
                                },
                                '& .MuiListItemIcon-root': {
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    '& .MuiBadge-badge': {
                                        minWidth: '5px',
                                        height: '5px',
                                    },
                                },
                                '& .MuiListItemText-root': {
                                    opacity: open ? 1 : 0
                                },
                            },
                        },
                    },
                }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: theme.spacing(1, 1),
                ...theme.mixins.toolbar,
                '& img': {
                    maxHeight: open ? 0 : '40px',
                    cursor: 'pointer',
                },
                '& .title': {
                    cursor: 'pointer',
                    // color: theme.palette.primary.contrastText,
                    fontSize: '1.2rem !important'
                },
            }}>
                <img src={logo} alt={'logo'} onClick={() => navigate('/')}/>
                <Typography className={'title'} sx={{
                    width: open ? 'auto' : 0,
                    overflow: 'hidden',
                    transition: 'all 300ms ease-in-out',
                }} onClick={() => navigate('/')}>Asset Management</Typography>
            </Box>

            <GlobalSearch sxProps={{width: 'min(95%, 350px)', mx: 'auto', display: {xs: 'flex', sm: 'none'}}}/>

            <DrawerItems toggleDrawer={toggleDrawer} isDrawerOpen={open}/>
        </Drawer>
    )
}





