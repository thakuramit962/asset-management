import React, {useCallback, useEffect, useState} from 'react'
import PageContainer from "../../components/containers/page-container"
import {updatePageTitle} from "../../slices/page-title-slice"
import {useDispatch} from "react-redux"
import {
    Box,
    Button, Container, FormLabel, Icon,
    IconButton,
    InputAdornment, MenuItem,
    Paper, SelectChangeEvent, Stack, SvgIcon,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination,
    TableRow,
    Typography,
    useTheme
} from "@mui/material"
import ThemeFab from "../../components/button/theme-fab";
import {useNavigate} from "react-router-dom";
import {updateSnackbarMessage} from "../../slices/snackbar-message-slice";
import {getFirstErrorMessage} from "../../utils/app-helper";
import ThemeDialog from "../../components/dialog-box/theme-dialog";
import {LoadingButton, Pagination} from "@mui/lab";
import RemoveItemDialog from "../../components/dialog-box/remove-item-dialog";
import {Controller, useForm} from "react-hook-form";
import {ArrowRightRounded, DeleteOutlined, DownloadRounded, EditOutlined, Search,} from "@mui/icons-material";
import {LoadingItem} from "../../components/loading-view";
import {ThemeTableContainer} from "../../components/theme-table-container";
import axios from "axios";
import {User} from "../../models/user";
import usePagination from "../../hooks/use-pagination";
import {ThemeTextField} from "../../components/inputs/theme-text-field";
import ThemePasswordInput from "../../components/inputs/theme-password-input";

import searchIcon from '../../assets/icons/search-icon.svg'


export default function Users() {

    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const [userFetching, setUserFetching] = useState<boolean>(true)
    const [users, setUsers] = useState<User[]>([])
    const [user, setUser] = useState<User>({} as User)
    const [userId, setUserId] = useState<string | number | undefined>()
    const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false)
    const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false)
    const closeRemoveDialog = () => setRemoveDialogOpen(false)
    const closeUpdateDialog = () => setUpdateDialogOpen(false)

    const [itemsPerPage, setItemsPerPage] = useState(10)
    const {currentPage, getCurrentData, setCurrentPage, pageCount} = usePagination(users, itemsPerPage)
    const userList = getCurrentData()

    const onChangeItemsPerPage = (event: any) => {
        setItemsPerPage(+event.target.value)
        setCurrentPage(1)
    }

    const fetchUsers = useCallback(() => {
        setUserFetching(true)
        axios.get('/api/users')
            .then((res) => {
                if (res.data?.status == true) setUsers(res.data?.data)
                else console.log('some error occured')
            })
            .catch((err) => console.error(JSON.stringify(err)))
            .finally(() => setUserFetching(false))
    }, [])


    useEffect(() => {
        dispatch(updatePageTitle('Users'))
        fetchUsers()
    }, [])

    return (
        <>
            <PageContainer>
                <>
                    <Stack direction={'row'}
                           sx={{
                               mt: 2,
                               mx: 'auto',
                               width: 'calc(100% - 2rem)',
                               justifyContent: 'space-between',
                           }}>
                        <LoadingButton
                            loading={false}
                            variant={'contained'}
                            startIcon={<DownloadRounded/>}
                            loadingPosition={'start'}>
                            Export
                        </LoadingButton>

                        <ThemeTextField
                            size={'small'}
                            sx={{
                                minHeight: 'max-content',
                                maxWidth: '350px'
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search/>
                                    </InputAdornment>
                                ),
                            }}
                            placeholder={'Search entries...'}
                        />
                    </Stack>

                    <ThemeTableContainer>
                        <Table sx={{minWidth: 650}} size={'small'}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{width: '15%', minWidth: '120px'}}>Role</TableCell>
                                    <TableCell sx={{width: '30%', minWidth: '150px'}}>Full Name</TableCell>
                                    <TableCell sx={{width: '20%', minWidth: '120px'}}>Login Id</TableCell>
                                    <TableCell sx={{width: '20%', minWidth: '120px'}}>Password</TableCell>
                                    <TableCell className={'stickyRight'}
                                               sx={{width: '15%', minWidth: '120px'}}>Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {userFetching
                                    ? <TableRow>
                                        <TableCell colSpan={5} sx={{
                                            textAlign: 'center',
                                            py: 20,
                                            minHeight: '300px'
                                        }}>
                                            <LoadingItem/>
                                        </TableCell>
                                    </TableRow>
                                    : users?.length < 1
                                        ? <TableRow>
                                            <TableCell colSpan={5} sx={{
                                                textAlign: 'center',
                                                py: 20,
                                                minHeight: '300px'
                                            }}>
                                                No Data
                                            </TableCell>
                                        </TableRow>
                                        : userList?.map((user, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{user?.role_id}</TableCell>
                                                <TableCell>{user?.name}</TableCell>
                                                <TableCell>{user?.login_id}</TableCell>
                                                <TableCell>{user?.user_password}</TableCell>
                                                <TableCell className={'stickyRight'}>
                                                    <IconButton onClick={() => {
                                                        setUser(user)
                                                        setUpdateDialogOpen(true)
                                                    }}><EditOutlined/></IconButton>
                                                    <IconButton onClick={() => {
                                                        setUserId(user?.id)
                                                        setRemoveDialogOpen(true)
                                                    }}><DeleteOutlined/></IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                            </TableBody>
                        </Table>
                    </ThemeTableContainer>

                    {users?.length > 0 &&
                    <Box sx={{
                        pt: 3,
                        px: 3,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                    }}>
                        <ThemeTextField select size={'small'} label={'Items per Page'}
                                        defaultValue={itemsPerPage}
                                        sx={{flex: 1, maxWidth: '130px', minHeight: 'max-content'}}
                                        onChange={onChangeItemsPerPage}>
                            {[
                                {label: '10', value: 10},
                                {label: '20', value: 20},
                                {label: '50', value: 50},
                                {label: '100', value: 100},
                            ]?.map((role, index) => (
                                <MenuItem key={index} value={role.value}
                                          selected={itemsPerPage == role.value}>{role.label}</MenuItem>
                            ))}
                        </ThemeTextField>
                        <Box sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Pagination
                                count={pageCount}
                                onChange={(_, newPage) => setCurrentPage(newPage)}
                                page={(currentPage > pageCount) ? 1 : currentPage}
                                // showFirstButton
                                // showLastButton
                                sx={{ml: {xs: 0, sm: 5}}}
                            />
                        </Box>
                    </Box>
                    }
                </>
            </PageContainer>

            <ThemeDialog open={removeDialogOpen} onClickClose={closeRemoveDialog}
                         dialogBody={<RemoveItemDialog apiName={'delete-user'} closeDialog={closeRemoveDialog}
                                                       itemName={'user'} id={userId} onCompletion={fetchUsers}/>}/>

            <ThemeDialog open={updateDialogOpen} onClickClose={closeUpdateDialog}
                         dialogBody={<UpdateUserForm user={user} closeDialog={closeUpdateDialog}
                                                     fetchUsers={fetchUsers}/>}/>

            <ThemeFab onClick={() => navigate('/create-user')}/>
        </>

    )
}


interface optionData {
    id: string
    name: string
    slug: string
}

const UpdateUserForm = (props: any) => {

    const {user, closeDialog, fetchUsers} = props
    const dispatch = useDispatch()

    const {control, handleSubmit, setValue, reset, formState: {errors}} = useForm({
        defaultValues: {
            role_id: user?.id,
            branch_id: user?.branch_id,
            login_id: user?.login_id,
            password: user?.password,
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
        }
    })
    const [loading, setLoading] = useState<boolean>(false)

    const [roles, setRoles] = useState<optionData[]>([])
    const [locations, setLocations] = useState<optionData[]>([])
    const [permissions, setPermissions] = useState<optionData[]>([])


    const fetchRole = () => {
        axios.get('/api/get-role')
            .then((res) => {
                if (res.data?.status == true) {
                    setRoles(res.data?.data?.roles)
                    setLocations(res.data?.data?.locations)
                    setPermissions(res.data?.data?.permissions)
                } else console.log('some error occured')
            })
            .catch((err) => console.error(JSON.stringify(err)))
    }

    const onSubmit = (data: any) => {
        setLoading(true)
        axios.post(`/api/update-user/${user?.id}`, {...data})
            .then((res) => {
                if (res.data?.status == true) {
                    console.log(JSON.stringify(res))
                    reset()
                    dispatch(updateSnackbarMessage({
                        title: 'User created successfully',
                        message: 'Success',
                        severity: 'success'
                    }))
                    closeDialog()
                    fetchUsers()
                } else {
                    const errorMessage = getFirstErrorMessage(res.data?.message)
                    dispatch(updateSnackbarMessage({
                        title: errorMessage,
                        message: 'error',
                        severity: 'error'
                    }))
                }
            })
            .catch((err) => {
                console.error(JSON.stringify(err))
            })
            .finally(() => setLoading(false))
    }

    const setDefaultValues = () => {
        setValue('role_id', user?.role_id)
        setValue('branch_id', user?.branch_id)
        setValue('login_id', user?.login_id)
        setValue('password', user?.user_password)
        setValue('name', user?.name)
        setValue('email', user?.email)
        setValue('phone', user?.phone)
    }

    useEffect(() => {
        fetchRole()
        setDefaultValues()
    }, [user])

    return (
        <Box sx={{minWidth: '90%', maxWidth: '700px'}}>
            <Typography variant={'h6'} sx={{
                fontSize: '1.2rem',
                mb: 3,
            }}>User Info</Typography>

            <Box component={'form'} sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexFlow: 'column',
                minHeight: 'min(40vh, 500px)',
            }}>
                <Box sx={{
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
                    {/*<Controller*/}
                    {/*    name={`role_id`}*/}
                    {/*    control={control}*/}
                    {/*    defaultValue={user?.role_id ?? ''}*/}
                    {/*    rules={{required: {value: true, message: 'Required'}}}*/}
                    {/*    render={({field}) => (*/}
                    {/*        <ThemeTextField*/}
                    {/*            disabled*/}
                    {/*            {...field} select required*/}
                    {/*            error={Boolean(errors?.role_id)}*/}
                    {/*            helperText={(errors?.role_id?.message ?? '').toString()}*/}
                    {/*            size={'small'} label={'Role'}*/}
                    {/*            sx={{flex: 1, minWidth: {xs: '100%', sm: '22%'}}}*/}
                    {/*            placeholder={'Select Role'}>*/}
                    {/*            {roles?.map((role, index) => (*/}
                    {/*                <MenuItem key={index} value={role.id}>{role.name}</MenuItem>*/}
                    {/*            ))}*/}
                    {/*        </ThemeTextField>*/}
                    {/*    )}/>*/}
                    {/*<Controller*/}
                    {/*    name={`branch_id`}*/}
                    {/*    defaultValue={user?.branch_id ?? ''}*/}
                    {/*    control={control}*/}
                    {/*    rules={{required: {value: true, message: 'Required'}}}*/}
                    {/*    render={({field}) => (*/}
                    {/*        <ThemeTextField*/}
                    {/*            disabled*/}
                    {/*            {...field} select required*/}
                    {/*            error={Boolean(errors?.branch_id)}*/}
                    {/*            helperText={(errors?.branch_id?.message ?? '').toString()}*/}
                    {/*            size={'small'} label={'Branch'}*/}
                    {/*            sx={{flex: 1, minWidth: {xs: '100%', sm: '22%'}}}*/}
                    {/*            placeholder={'Select Branch'}>*/}
                    {/*            {locations?.map((location, index) => (*/}
                    {/*                <MenuItem key={index} value={location.id}>{location.name}</MenuItem>*/}
                    {/*            ))}*/}
                    {/*        </ThemeTextField>*/}
                    {/*    )}/>*/}

                    <Controller
                        name={`name`}
                        defaultValue={user?.name ?? ''}
                        control={control}
                        rules={{required: {value: true, message: 'Required'}}}
                        render={({field}) => (
                            <ThemeTextField
                                {...field} required
                                error={Boolean(errors?.name)}
                                helperText={(errors?.name?.message ?? '').toString()}
                                size={'small'} label={'Name'}
                                sx={{flex: 1, minWidth: {xs: '100%', sm: '100%'}}}
                                placeholder={'Name'}
                            />
                        )}/>
                    <Controller
                        name={`login_id`}
                        defaultValue={user?.login_id ?? ''}
                        control={control}
                        rules={{required: {value: true, message: 'Required'}}}
                        render={({field}) => (
                            <ThemeTextField
                                {...field} required
                                error={Boolean(errors?.login_id)}
                                helperText={(errors?.login_id?.message ?? '').toString()}
                                size={'small'} label={'Login Id'}
                                sx={{flex: 1, minWidth: {xs: '100%', sm: '40%'}}}
                                placeholder={'@login_id'}
                            />
                        )}/>

                    <Controller
                        name={'password'}
                        defaultValue={user?.user_password ?? ''}
                        control={control}
                        rules={{required: {value: true, message: 'Required'}}}
                        render={({field}) => (
                            <ThemePasswordInput
                                fieldProps={field} error={Boolean(errors?.password)}
                                helperText={(errors?.password?.message ?? '').toString()}
                                label={'Password'} placeholder={'********'}
                                sx={{flex: 1, minWidth: {xs: '100%', sm: '40%'}}}
                            />
                        )}/>


                    <Controller
                        name={`email`}
                        defaultValue={user?.email ?? ''}
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
                            helperText={(errors?.email?.message ?? '').toString()}
                            size={'small'}
                            label={'Email'}
                            sx={{flex: 1, minWidth: {xs: '100%', sm: '22%'}}}
                            placeholder={'your@email.address'}/>
                    )}/>

                    <Controller
                        name={`phone`}
                        defaultValue={user?.phone ?? ''}
                        control={control}
                        rules={{
                            required: {value: false, message: 'Required'},
                            pattern: {value: /^[6-9]\d{9}$/, message: 'Enter valid phone number'}
                        }}
                        render={({field}) => (
                            <ThemeTextField
                                {...field}
                                error={Boolean(errors?.phone)}
                                helperText={(errors?.phone?.message ?? '').toString()}
                                size={'small'} label={'Phone'}
                                sx={{flex: 1, minWidth: {xs: '100%', sm: '22%'}}}
                                placeholder={'XXXX XXX XXX'}
                            />
                        )}/>

                </Box>


                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                    gap: 2,
                }}>
                    <LoadingButton onClick={setDefaultValues}>Reset</LoadingButton>
                    <LoadingButton onClick={handleSubmit(onSubmit)} variant={'contained'}
                                   loading={loading} sx={{minWidth: {xs: 'min-content', sm: '150px'}}}>
                        Update <ArrowRightRounded/>
                    </LoadingButton>
                </Box>
            </Box>

        </Box>
    )
}
