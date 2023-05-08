import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {alpha, lighten, useTheme} from "@mui/material";
import {ArrowRightRounded, LogoutRounded, ManageAccountsRounded} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {updateAuth} from "../../slices/auth-slice";
import {useDispatch} from "react-redux";
import {User} from "../../models/user";


export default function AccountMenu() {

    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const onLogout = () => {
        dispatch(updateAuth({isLoggedIn: false, accessToken: '', currentUser: {} as User}))
    }

    return (
        <React.Fragment>
            <Box sx={{display: 'flex', alignItems: 'center', textAlign: 'center'}}>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ml: 2}}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{width: 32, height: 32}}/>
                </IconButton>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        width: '180px',
                        overflow: 'visible',
                        background: (theme.palette.mode == 'dark')
                            ? lighten(theme.palette.primary.main, 0.2)
                            : lighten(theme.palette.primary.main, 0.8),
                        mt: 1.5,
                        borderRadius: '12px',
                        px: 1,
                        py: 0,
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            background: (theme.palette.mode == 'dark')
                                ? lighten(theme.palette.primary.main, 0.2)
                                : lighten(theme.palette.primary.main, 0.8),
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                        '& .userInfo': {
                            background: alpha(theme.palette.background.default, 0.2),
                            borderRadius: '8px',
                            lineHeight: '16px',
                            fontSize: '15px',
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.5px',
                            mb: 1,
                            '& span': {
                                color: theme.palette.text.secondary,
                                letterSpacing: '1px',
                            },
                            '& li':{
                                mt: 0
                            },
                        },
                    },
                }}>
                <Typography className={'userInfo'}>
                    <MenuItem onClick={()=>navigate('my-account')} sx={{
                        mt: 1,
                        borderRadius: '8px',
                        justifyContent: 'space-between',
                        '&:hover': {
                            '& .arrowIcon': {
                                right: '-7px',
                                opacity: 1,
                            },
                        },
                    }}>
                        Profile
                        <Box sx={{
                            display: 'flex',
                            width: '42px',
                            justifyContent: 'space-around',
                            position: 'relative',
                            '& .arrowIcon': {
                                position: 'absolute',
                                right: 0,
                                opacity: 0,
                                transition: 'all 200ms ease-in-out',
                            }
                        }}>
                            <Divider orientation={'vertical'} sx={{height: 'auto'}}/>
                            <ManageAccountsRounded fontSize="small"/>
                            <ArrowRightRounded fontSize="small" className={'arrowIcon'}/>
                        </Box>
                    </MenuItem>
                </Typography>
                <Divider/>
                <MenuItem onClick={onLogout} sx={{
                    mt: 1,
                    borderRadius: '8px',
                    justifyContent: 'space-between',
                    '&:hover': {
                        '& .arrowIcon': {
                            right: '-7px',
                            opacity: 1,
                        },
                    },
                }}>
                    <Box sx={{
                        display: 'flex',
                        width: '42px',
                        justifyContent: 'space-around',
                        position: 'relative',
                        '& .arrowIcon': {
                            position: 'absolute',
                            right: 0,
                            opacity: 0,
                            transition: 'all 200ms ease-in-out',
                        }
                    }}>
                        <LogoutRounded fontSize="small"/>
                        <Divider orientation={'vertical'} sx={{height: 'auto'}}/>
                    </Box>
                    Logout
                </MenuItem>
            </Menu>
        </React.Fragment>
    )
}
