import React from 'react'
import {Box, Drawer, Typography, useTheme} from "@mui/material"
import {useNavigate} from "react-router-dom"

import logo from "../../assets/images/logo.png"
import DrawerItems from "../../components/theme-drawer/drawer-items"


export default function ThemeMobileDrawer(props: any) {

    const {open, toggleDrawer} = props

    const theme = useTheme()
    const navigate = useNavigate()

    return (
        <div>
            <React.Fragment>
                <Drawer anchor={'left'} open={open}
                        onClose={toggleDrawer}
                        sx={{zIndex: theme.zIndex.drawer + 4}}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: theme.spacing(4, 1),
                        ...theme.mixins.toolbar,
                        '& img': {
                            maxHeight: '40px',
                            cursor: 'pointer',
                        },
                        '& .title': {
                            cursor: 'pointer',
                            color: theme.palette.primary.contrastText,
                            fontSize: '1.2rem !important'
                        },
                    }}>
                        <img src={logo} alt={'logo'} onClick={() => navigate('/')}/>
                        <Typography className={'title'} sx={{
                            width: open ? 'auto' : 0,
                            overflow: 'hidden',
                            transition: 'all 300ms ease-in-out',
                        }} onClick={() => navigate('/')}>Scheduler</Typography>
                    </Box>

                    <DrawerItems/>

                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'flex-end',
                        alignContent: open ? 'space-between' : 'flex-end',
                        pb: '10px',
                        width: '100%',
                    }}>

                        {open &&
                        <Box onClick={toggleDrawer} sx={{
                            width: '100%',
                            margin: '1rem 0.7rem',
                            height: '100px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #9AD1D4, #C2F9BB)',
                        }}>
                            s
                        </Box>
                        }

                    </Box>
                </Drawer>
            </React.Fragment>
        </div>
    )
}
