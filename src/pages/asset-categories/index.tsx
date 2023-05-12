import React, {useEffect, useMemo, useState} from 'react'
import PageContainer from "../../components/containers/page-container";
import {updatePageTitle} from "../../slices/page-title-slice";
import {useDispatch} from "react-redux";
import {
    alpha,
    Box,
    Button,
    Chip,
    darken,
    IconButton,
    InputAdornment,
    lighten,
    Stack, Table, TableBody, TableCell, TableHead, TableRow,
    Typography,
    useTheme
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {ArrowRightRounded, DownloadRounded, Edit, Search} from "@mui/icons-material";
import {ThemeTextField} from "../../components/inputs/theme-text-field";
import demoImg from '../../assets/images/laptop.png'
import ThemeDialog from "../../components/dialog-box/theme-dialog";
import {ThemeSwitch} from "../../components/inputs/theme-switch";
import {Controller, useForm} from "react-hook-form";
import axios from "axios";
import {Category} from "../../models/category";
import ThemeFab from "../../components/button/theme-fab";
import {updateSnackbarMessage} from "../../slices/snackbar-message-slice";
import {getFirstErrorMessage, serverRoute} from "../../utils/app-helper";
import {ThemeTableContainer} from "../../components/theme-table-container";
import {LoadingItem} from "../../components/loading-view";


export default function AssetCategories() {

    const theme = useTheme()
    const dispatch = useDispatch()
    const [fetchingCategories, setFetchingCategories] = useState<boolean>(true)
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false)
    const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [category, setCategory] = useState<Category>({} as Category)
    const [searchKeyword, setSearchKeyword] = useState<string>('')
    const closeAddDialog = () => setAddDialogOpen(false)
    const closeUpdateDialog = () => setUpdateDialogOpen(false)

    const fetchCategory = () => {
        setFetchingCategories(true)
        axios.get(`${serverRoute}/api/categories`)
            .then((res) => {
                setCategories(res.data?.data)
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => setFetchingCategories(false))

    }

    const filteredCategories = useMemo(() => {
        return categories.filter(category => {
            return Object.values({
                id: category.id,
                category: category.name,
            }).join(' ').toLowerCase().includes(searchKeyword.toLowerCase() ?? '')
        })
    }, [categories, searchKeyword])


    const updateCategory = (data: any) => {
        axios.post(`${serverRoute}/api/update-category`, {...category, ...data})
            .then((res) => {
                if (res.data?.status == true) {
                    dispatch(updateSnackbarMessage({
                        title: 'Category updated successfully',
                        message: 'Success',
                        severity: 'success'
                    }))
                    fetchCategory()
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
    }


    useEffect(() => {
        fetchCategory()
        dispatch(updatePageTitle('Asset Categories'))
    }, [])

    return (
        <>
            <PageContainer>
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
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search/>
                                </InputAdornment>
                            ),
                        }}
                        placeholder={'Search category...'}
                    />
                </Stack>


                <ThemeTableContainer sx={{
                    '& .MuiTableCell-root': {
                        fontSize: '13px',
                        '&.highlighted': {
                            fontWeight: 600
                        },
                    },
                }}>
                    <Table sx={{minWidth: 650}} size={'small'}>
                        <TableHead>
                            <TableRow>
                                <TableCell width={'120px'}>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell sx={{width: '120px', textAlign: 'center'}}>Status</TableCell>
                                <TableCell className={'stickyRight'} sx={{width: '120px'}}>Action</TableCell>
                            </TableRow>


                        </TableHead>

                        <TableBody>
                            {fetchingCategories
                                ? <TableRow>
                                    <TableCell colSpan={4} sx={{
                                        textAlign: 'center',
                                        py: 15,
                                    }}>
                                        <LoadingItem/>
                                    </TableCell>
                                </TableRow>
                                : filteredCategories?.length < 1
                                    ? <TableRow>
                                        <TableCell colSpan={4} sx={{
                                            textAlign: 'center',
                                            py: 15,
                                        }}>
                                            No Data
                                        </TableCell>
                                    </TableRow>
                                    : filteredCategories?.map((ctry, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{ctry?.id ?? '-'}</TableCell>
                                            <TableCell className={'highlighted'}>{ctry?.name ?? '-'}</TableCell>
                                            <TableCell>
                                                <Chip size={'small'}
                                                      sx={{
                                                          minWidth: '90px',
                                                          height: '20px',
                                                          fontSize: '11px',
                                                          fontWeight: 600,
                                                          borderWidth: '1.5px',
                                                      }}
                                                      variant={'outlined'}
                                                      color={ctry?.status == false ? 'warning' : ctry?.status == true ? 'primary' : ctry?.status == false ? 'secondary' : 'error'}
                                                      label={ctry?.status == false ? 'Cancel' : ctry?.status == true ? 'Unassigned' : ctry?.status == false ? 'Assigned' : 'Scraped'}/>

                                            </TableCell>
                                            <TableCell className={'stickyRight'}>
                                                <ThemeSwitch className={'statusCheck'} size={'small'}
                                                             checked={ctry?.status == true ? true : false}
                                                             onChange={(e, checked) => {
                                                                 setCategory(ctry)
                                                                 updateCategory({status: checked ? 1 : 0, id: ctry?.id})
                                                             }}/>
                                                <IconButton className={'actionButton'} onClick={() => {
                                                    setCategory(ctry)
                                                    setUpdateDialogOpen(true)
                                                }}>
                                                    <Edit/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                        </TableBody>
                    </Table>
                </ThemeTableContainer>

            </PageContainer>

            <ThemeFab onClick={() => setAddDialogOpen(true)}/>

            {addDialogOpen &&
            <ThemeDialog open={addDialogOpen} onClickClose={closeAddDialog}
                         dialogBody={<AddCategoryForm category={category} closeDialog={closeAddDialog}
                                                      fetchCategory={fetchCategory}/>}/>
            }

            {updateDialogOpen &&
            <ThemeDialog open={updateDialogOpen} onClickClose={closeUpdateDialog}
                         dialogBody={<UpdateCategoryForm category={category} closeDialog={closeUpdateDialog}
                                                         fetchCategory={fetchCategory}/>}/>
            }

        </>
    )
}


const AddCategoryForm = (props: any) => {

    const {category, fetchCategory, closeDialog} = props
    const {control, handleSubmit, setError, setValue, reset, formState: {errors}} = useForm()
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const closeAndDiscard = () => {
        setValue('name', '')
        closeDialog()
    }

    const onSubmit = (data: any) => {
        setLoading(true)
        axios.post(`${serverRoute}/api/add-category`, {...data})
            .then((res) => {
                if (res.data?.status == true) {
                    reset()
                    dispatch(updateSnackbarMessage({
                        title: 'Category added successfully',
                        message: 'Success',
                        severity: 'success'
                    }))
                    closeDialog()
                    fetchCategory()
                } else {
                    const errorMessage = getFirstErrorMessage(res.data?.errors)
                    setError("name", {type: "focus", message: errorMessage}, {shouldFocus: true})
                }
            })
            .catch((err) => {
                console.error(JSON.stringify(err))
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        setValue('name', '')
    }, [])


    return (
        <Box component={'form'} sx={{
            minWidth: 'min(90vw, 350px)'
        }}>
            <Typography variant={'h6'} sx={{
                fontSize: '1.2rem',
                mb: 3,
            }}>Category Name</Typography>
            <Controller
                name={`name`}
                control={control}
                defaultValue={category?.name ?? ''}
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

            <Box sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                gap: 2,
            }}>
                <LoadingButton onClick={closeAndDiscard}>Discard</LoadingButton>
                <LoadingButton onClick={handleSubmit(onSubmit)} variant={'contained'}
                               loading={loading}
                               sx={{minWidth: {xs: 'min-content', sm: '150px'}}}>
                    Save <ArrowRightRounded/>
                </LoadingButton>
            </Box>

        </Box>
    )
}


const UpdateCategoryForm = (props: any) => {

    const {category, fetchCategory, closeDialog} = props
    const {control, handleSubmit,setError, setValue, reset, formState: {errors}} = useForm()
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    const closeAndDiscard = () => closeDialog()

    const updateCategory = (data: any) => {
        axios.post(`${serverRoute}/api/update-category`, {...category, ...data})
            .then((res) => {
                if (res.data?.status == true) {
                    reset()
                    dispatch(updateSnackbarMessage({
                        title: 'Category updated successfully',
                        message: 'Success',
                        severity: 'success'
                    }))
                    closeDialog()
                    fetchCategory()
                } else {
                    setError("name", {type: "focus", message: res.data?.errors}, {shouldFocus: true})
                }
            })
            .catch((err) => {
                console.error(JSON.stringify(err))
            })
            .finally(() => setLoading(false))
    }

    const onSubmit = (data: any) => updateCategory(data)

    useEffect(() => {
        setValue('name', category?.name)
    }, [category])


    return (
        <Box component={'form'} sx={{minWidth: 'min(90vw, 350px)'}}>
            <Typography variant={'h6'} sx={{
                fontSize: '1.2rem',
                mb: 3,
            }}>Category Name</Typography>
            <Controller
                name={`name`}
                control={control}
                defaultValue={category?.name ?? ''}
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

            <Box sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                gap: 2,
            }}>
                <LoadingButton onClick={closeAndDiscard}>Discard</LoadingButton>
                <LoadingButton
                    onClick={handleSubmit(onSubmit)}
                    variant={'contained'} loading={loading}
                    sx={{minWidth: {xs: 'min-content', sm: '150px'}}}>
                    Update <ArrowRightRounded/>
                </LoadingButton>
            </Box>

        </Box>
    )
}
