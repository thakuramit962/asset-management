import React, {useEffect, useState} from 'react'
import {useDispatch} from "react-redux"
import {
    alpha,
    Box,
    Checkbox, Container,
    FormControlLabel,
    IconButton,
    InputAdornment,
    MenuItem,
    Typography,
    useTheme
} from "@mui/material"
import {ArrowRightRounded, Visibility, VisibilityOff} from "@mui/icons-material"
import {Controller, useForm} from "react-hook-form"
import {updatePageTitle} from "../../slices/page-title-slice"
import PageContainer from "../../components/containers/page-container"
import {useNavigate} from "react-router-dom";
import ThemeInput from "../../components/inputs/theme-input";
import {LoadingButton} from "@mui/lab";
import {ThemeTextField} from "../../components/inputs/theme-text-field";
import ThemePasswordInput from "../../components/inputs/theme-password-input";
import {updateSnackbarMessage} from "../../slices/snackbar-message-slice";
import API from "../../api";


interface optionData {
    id: string
    name: string
    slug: string
}

export default function CreateUser() {


    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const [roles, setRoles] = useState<optionData[]>([])
    const [locations, setLocations] = useState<optionData[]>([])
    const [permissions, setPermissions] = useState<optionData[]>([])

    const {control, reset, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            role_id: '',
            login_id: '',
            name: '',
            email: '',
            phone: '',
            password: '',
            // assign_permission: permissions,
        }
    })


    const fetchRole = () => {
        API.get(`/get-role`)
            .then((res) => {
                if (res.data?.status == true) {
                    setRoles(res.data?.data?.roles)
                    setLocations(res.data?.data?.locations)
                    setPermissions(res.data?.data?.permissions)
                }
                else console.log('some error occured')
            })
            .catch((err) => console.error(JSON.stringify(err)))
    }

    const onSubmit = (data: any) => {
        console.log(data)
        setLoading(true)
        API.post(`/register`, {...data})
            .then((res) => {
                if (res.data?.status == true) {
                    reset();
                    dispatch(updateSnackbarMessage({
                        title: 'Updated!',
                        message: 'User updated successfully!',
                        severity: 'success'
                    }))
                } else {
                    dispatch(updateSnackbarMessage({
                        title: 'Updated Failed',
                        message: 'User updated failed...',
                        severity: 'error'
                    }))
                }
            })
            .catch((err) => console.error(JSON.stringify(err)))
            .finally(() => setLoading(false))

    }

    useEffect(() => {
        dispatch(updatePageTitle('Create Client'))
        fetchRole()
    }, [])

    // @ts-ignore
    return (
        <PageContainer>
            <Container sx={{
                height: '100%',
            }}>
                <Box component={'form'} sx={{
                    pt: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexFlow: 'column',
                    minHeight: 'min(100%, 500px)',
                }}>
                    <Typography variant={'h3'} className={'pageHeading'}>User Info</Typography>
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
                        // maxWidth: '600px',
                        mx: 'auto',
                    }}>
                        <Controller
                            name={`role_id`}
                            control={control}
                            rules={{required: {value: true, message: 'Required'}}}
                            render={({field}) => (
                                <ThemeTextField
                                    {...field} select required
                                    autoComplete={'off'}
                                    error={Boolean(errors?.role_id)}
                                    helperText={errors?.role_id?.message}
                                    size={'small'} label={'Role'}
                                    sx={{flex: 1, minWidth: {xs: '100%', sm: '22%'}}}
                                    placeholder={'Select Role'}>
                                    {roles?.map((role, index) => (
                                        <MenuItem key={index} value={role.id}>{role.name}</MenuItem>
                                    ))}
                                </ThemeTextField>
                            )}/>

                        <Controller
                            name={`login_id`}
                            control={control}
                            rules={{
                                required: {value: true, message: 'Required'},
                            }}
                            render={({field}) => (
                                <ThemeTextField
                                    {...field} required
                                    autoComplete="dsadsad"
                                    error={Boolean(errors?.login_id)}
                                    helperText={errors?.login_id?.message}
                                    size={'small'} label={'Login Id'}
                                    sx={{flex: 1, minWidth: {xs: '100%', sm: '22%'}}}
                                    placeholder={'@login_id'}
                                />
                            )}/>

                        <Controller
                            name={'password'}
                            control={control}
                            rules={{required: {value: true, message: 'Required'}}}
                            defaultValue={''}
                            render={({field}) => (
                                <ThemePasswordInput
                                    autoComplete="off"
                                    fieldProps={field} error={Boolean(errors?.password)}
                                    helperText={errors?.password?.message}
                                    label={'Password'} placeholder={'********'}
                                    sx={{flex: 1, minWidth: {xs: '100%', sm: '22%'}}}
                                />
                            )}/>

                        <Controller
                            name={`name`}
                            control={control}
                            rules={{required: {value: true, message: 'Required'}}}
                            render={({field}) => (
                                <ThemeTextField
                                    {...field} required
                                    error={Boolean(errors?.name)}
                                    helperText={errors?.name?.message}
                                    size={'small'} label={'Name'}
                                    sx={{flex: 1, minWidth: {xs: '100%', sm: '22%'}}}
                                    placeholder={'Name'}
                                />
                            )}/>

                        <Controller
                            name={`email`}
                            control={control}
                            rules={{
                                required: {value: false, message: 'Required'},
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Enter valid email address'
                                }
                            }} render={({field}) => (
                            <ThemeTextField
                                {...field} error={Boolean(errors?.email)}
                                helperText={errors?.email?.message}
                                size={'small'}
                                label={'Email'}
                                sx={{flex: 1, minWidth: {xs: '100%', sm: '22%'}}}
                                placeholder={'your@email.address'}/>
                        )}/>

                        <Controller
                            name={`phone`}
                            control={control}
                            rules={{
                                required: {value: false, message: 'Required'},
                                pattern: {value: /^[6-9]\d{9}$/, message: 'Enter valid phone number'}
                            }}
                            render={({field}) => (
                                <ThemeTextField
                                    {...field}
                                    error={Boolean(errors?.phone)}
                                    helperText={errors?.phone?.message}
                                    size={'small'} label={'Phone'}
                                    sx={{flex: 1, minWidth: {xs: '100%', sm: '22%'}}}
                                    placeholder={'XXXX XXX XXX'}
                                />
                            )}/>

                        {/*<Box sx={{width: '100%'}}>*/}
                        {/*    <Typography className={'pageHeading'}>Permissions</Typography>*/}
                        {/*    <Box sx={{p: 2}}>*/}
                        {/*        {permissions?.map((permission, index)=> (*/}
                        {/*            <Controller name={`assign_permission.${index}.${permission.slug}`} control={control}*/}
                        {/*                        render={({field}) => (*/}
                        {/*                            <ThemeCheckbox label={permission?.name} field={field}/>*/}
                        {/*                        )}/>*/}
                        {/*        ))}*/}
                        {/*    </Box>*/}
                        {/*</Box>*/}


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
            </Container>
        </PageContainer>
    )
}