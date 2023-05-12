import React, {useEffect, useState} from 'react'
import {Box, Checkbox, FormControlLabel, IconButton, InputAdornment, Stack, Typography, useTheme} from "@mui/material"
import {LoadingButton} from '@mui/lab'
import {Visibility, VisibilityOff} from "@mui/icons-material"
import {useForm, Controller} from 'react-hook-form'
import ThemeInput from "../components/inputs/theme-input"
import logo from '../assets/images/frontiers-logo.svg'
import ThemePasswordInput from "../components/inputs/theme-password-input";
import {ThemeTextField} from "../components/inputs/theme-text-field";
import axios from 'axios'
import {updateSnackbarMessage} from "../slices/snackbar-message-slice";
import {useDispatch, useSelector} from "react-redux";
import {User} from "../models/user";
import {updateAuth} from "../slices/auth-slice";
import {useLocation} from "react-router";
import {RootState} from "../store/store";
import {useNavigate} from "react-router-dom";
import ThemeSnackbar from "../components/theme-snackbar";
import {serverRoute} from "../utils/app-helper";


export default function Login() {

    const theme = useTheme()
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const isLoggedIn = useSelector((state: RootState) => state.userAuth.isLoggedIn)

    const errorMessage = useSelector((state: RootState) => state.snackbarMessage.message)

    const {handleSubmit, control, setError, formState: {errors}} = useForm()
    const [submitting, setSubmitting] = useState<boolean>(false)


    const onSubmit = (data: any) => {
        setSubmitting(true)
        axios.post(`${serverRoute}/api/login`, {...data})
            .then((res) => {
                if (res.data?.status == true) {
                    const userInfo: User = res.data?.data?.user
                    console.log(userInfo, 'userInfo')
                    dispatch(updateAuth({isLoggedIn: true, accessToken: res.data?.data?.token, currentUser: userInfo}))
                    dispatch(updateSnackbarMessage({
                        title: 'Welcome Buddy!!',
                        message: 'Successfully logged in',
                        severity: 'success'
                    }))
                } else if (res.data?.statuscode == 403) {
                    dispatch(updateSnackbarMessage({
                        title: 'Error',
                        message: res.data?.message,
                        severity: 'error'
                    }))
                } else {
                    // const errors = res?.data?.errors
                    // Object.keys(errors).forEach(key => {
                    //     if (['email', 'password'].includes(key)) {
                    //         setError(key, {message: errors[key]?.[0]})
                    //         delete errors[key]
                    //     }
                    // })
                    dispatch(updateSnackbarMessage({
                        title: 'Invalid Credentials',
                        message: 'Username or password is incorrect',
                        severity: 'error'
                    }))
                }
            })
            .catch((err) => {
                setSubmitting(false)
                console.error(JSON.stringify(err))
            }).finally(() => setSubmitting(false))

    }

    const fromLocation = location?.state?.fromLocation
    const fromPath = fromLocation?.pathname || '/'

    useEffect(() => {
        if (isLoggedIn) navigate(fromPath, {state: fromLocation?.state, replace: true})
    }, [isLoggedIn])

    return (
        <>
            <Box component={'section'} sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'stretch',
                justifyContent: 'center',
                background: `radial-gradient(${theme.palette.secondary.main},#00101c66) ${theme.palette.primary.dark}`,
                minHeight: '100vh',
                p: 1,
                '& .illustrationBlock': {
                    flex: '2 1 300px',
                    display: {xs: 'none', sm: 'flex'}
                },
                '& .loginContentBlock': {
                    flex: '1 1 300px',
                    background: theme.palette.background.paper,
                    borderRadius: 4,
                    display: 'flex',
                    flexFlow: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '& img': {
                        width: '80%',
                        maxHeight: '60px',
                        mb: 5,
                    },
                    '& form': {
                        p: 2,
                        display: 'flex',
                        flexFlow: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '300px',
                        '& .title': {
                            fontWeight: 600,
                            fontSize: 'clamp(1.2rem, 8vw, 1.8rem)'
                        },
                        '& .des': {
                            fontSize: theme.typography.pxToRem(13),
                            mb: 4,
                        },
                    },
                },
            }}>
                <Box className={'loginContentBlock'}>
                    <img src={logo} alt={'logo'}/>

                    <Box component={'form'}>
                        <Typography className={'title'}>Welcome</Typography>
                        <Typography className={'des'}>Please enter your credentials</Typography>

                        <Controller
                            name={'email'}
                            control={control}
                            rules={{
                                required: {value: true, message: 'Required'},
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Enter valid email address'
                                }
                            }}
                            defaultValue={''}
                            render={({field}) => (
                                <ThemeTextField
                                    {...field} autoFocus required
                                    error={Boolean(errors?.email)}
                                    helperText={(errors?.email?.message ?? '').toString()}
                                    size={'small'}
                                    label={'Email'}
                                    placeholder={'your@email.address'}
                                />
                            )}/>
                        <Controller
                            name={'password'}
                            control={control}
                            rules={{required: {value: true, message: 'Required'}}}
                            defaultValue={''}
                            render={({field}) => (
                                <ThemePasswordInput
                                    fieldProps={field} required
                                    error={Boolean(errors?.password)}
                                    helperText={errors?.password?.message}
                                    label={'Password'} placeholder={'********'}
                                />
                            )}/>

                        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{
                            pl: 2,
                            width: '100%',
                            mt: -1,
                            mb: 2,
                            '& .MuiCheckbox-root': {
                                p: '0 !important',
                            },
                            '& .MuiTypography-root': {
                                fontSize: '12px',
                                cursor: 'pointer'
                            },
                        }}>
                            <FormControlLabel control={<Checkbox size={'small'} disableRipple/>} label="Remember me"/>
                            <Typography variant={'caption'}>Forgot password ?</Typography>
                        </Stack>


                        <LoadingButton
                            fullWidth
                            variant={'contained'}
                            onClick={handleSubmit(onSubmit)}
                            type={'submit'}
                            loading={submitting}
                            endIcon={<></>}
                            loadingPosition="end">
                            Login
                        </LoadingButton>

                    </Box>

                    {/*<Typography variant={'caption'}>Not registered yet? <span>Register</span></Typography>*/}
                </Box>
                <Box className={'illustrationBlock'}>

                </Box>
            </Box>
            <ThemeSnackbar message={errorMessage}/>
        </>
    )
}