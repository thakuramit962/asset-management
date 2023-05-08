import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch} from "react-redux"
import {Box, IconButton, InputAdornment, MenuItem, useTheme} from "@mui/material"
import {ArrowRightRounded, Visibility, VisibilityOff} from "@mui/icons-material"
import {Controller, useForm} from "react-hook-form"
import {updatePageTitle} from "../../slices/page-title-slice"
import PageContainer from "../../components/containers/page-container"
import {updateSnackbarMessage} from "../../slices/snackbar-message-slice";
import {getFirstErrorMessage} from "../../utils/app-helper";
import {useNavigate} from "react-router-dom";
import ThemeInput from "../../components/inputs/theme-input";
import {LoadingButton} from "@mui/lab";


export default function UpdateUser() {


    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [user, setUser] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const togglePassword = () => setShowPassword((prevState => !prevState))


    const {control, reset, setValue, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            role_id: '',
            name: '',
            email: '',
            phone: '',
            password: '',
        }
    })

    const fetchUser = useCallback((userId: string) => {
        console.log('zdsad')
    }, [])

    const onSubmit = (data: any) => {
        console.log(data)
    }

    useEffect(() => {
        dispatch(updatePageTitle('Update User'))
        fetchUser('1')
    }, [])

    return (
        <PageContainer>
            <Box component={'form'} sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexFlow: 'column',
                width: '1005',
                height: '100%',
            }}>
                <Box sx={{
                    pt: 3,
                    flex: 1,
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    justifyContent: 'center',
                    columnGap: '1rem',
                    maxWidth: '600px',
                    mx: 'auto',
                    '& .form-row': {
                        width: '100%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        alignContent: 'flex-start',
                        justifyContent: 'center',
                        columnGap: '1rem',
                    },
                }}>

                    <Box className={'form-row'}>
                        <Controller
                            name={`role_id`}
                            control={control}
                            rules={{required: {value: true, message: 'Required'}}}
                            render={({field}) => (
                                <ThemeInput {...field} size={'small'} required
                                                error={Boolean(errors?.role_id)} select
                                                helperText={(errors?.role_id?.message ?? '').toString()}
                                                label={'Role'} placeholder={'Select Role'}
                                                sx={{
                                                    flex: 1,
                                                    maxWidth: {xs: '100%', sm: '190px'},
                                                }}
                                >
                                    <MenuItem value={2}>Client Admin</MenuItem>
                                    <MenuItem value={3}>Warehouse Manager</MenuItem>
                                    <MenuItem value={4}>Warehouse User</MenuItem>
                                </ThemeInput>
                            )}/>
                        <Controller
                            name={`name`}
                            control={control}
                            rules={{required: {value: false, message: 'Required'}}}
                            render={({field}) => (
                                <ThemeInput
                                    {...field}
                                    error={Boolean(errors?.name)}
                                    helperText={errors?.name?.message}
                                    size={'small'} label={'Name'}
                                    sx={{
                                        flex: 1,
                                        maxWidth: '100%',
                                    }}
                                    placeholder={'Name'}
                                />
                            )}/>
                    </Box>

                    <Box className={'form-row'}>
                        <Controller
                            name={`email`}
                            control={control}
                            rules={{
                                required: {value: true, message: 'Required'},
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Enter valid email address'
                                }
                            }} render={({field}) => (
                            <ThemeInput
                                {...field}
                                error={Boolean(errors?.email)} required
                                helperText={errors?.email?.message}
                                size={'small'} label={'Email'}
                                sx={{
                                    flex: 1,
                                    maxWidth: {xs: '100%', sm: '50%'},
                                }}
                                placeholder={'email@company.domain'}
                            />
                        )}/>

                        <Controller
                            name={`phone`}
                            control={control}
                            rules={{
                                required: {value: false, message: 'Required'},
                                pattern: {value: /^[6-9]\d{9}$/, message: 'Enter valid phone number'}
                            }}
                            render={({field}) => (
                                <ThemeInput
                                    {...field}
                                    error={Boolean(errors?.phone)}
                                    helperText={errors?.phone?.message}
                                    size={'small'} label={'Phone'}
                                    sx={{
                                        flex: 1,
                                        maxWidth: {xs: '100%', sm: '50%'},
                                    }}
                                    placeholder={'XXXX XXX XXX'}
                                />
                            )}/>


                    </Box>

                    <Box className={'form-row'}>
                        <Controller
                            name={`password`}
                            control={control}
                            rules={{required: {value: true, message: 'Required'}}}
                            render={({field}) => (
                                <ThemeInput
                                    {...field}
                                    error={Boolean(errors?.password)}
                                    helperText={errors?.password?.message}
                                    size={'small'} label={'Password'} required
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={'*******'}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={togglePassword}
                                                    onMouseDown={togglePassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        flex: 1,
                                    }}
                                />
                            )}/>


                    </Box>

                </Box>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                    gap: 2,
                }}>
                    <LoadingButton onClick={() => reset()}>Reset</LoadingButton>
                    <LoadingButton onClick={handleSubmit(onSubmit)} variant={'contained'}
                                        loading={loading} sx={{minWidth: {xs: 'min-content', sm: '150px'}}}>
                        Create <ArrowRightRounded/>
                    </LoadingButton>
                </Box>
            </Box>
        </PageContainer>
    )
}