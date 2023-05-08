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
import {Brand} from "../../models/brand";
import ThemeFab from "../../components/button/theme-fab";
import {updateSnackbarMessage} from "../../slices/snackbar-message-slice";
import {getFirstErrorMessage} from "../../utils/app-helper";
import {ThemeTableContainer} from "../../components/theme-table-container";
import {LoadingItem} from "../../components/loading-view";
import moment from "moment";


export default function Brands() {

    const theme = useTheme()
    const dispatch = useDispatch()
    const [fetchingBrands, setFetchingBrands] = useState<boolean>(true)
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false)
    const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false)
    const [brands, setBrands] = useState<Brand[]>([])
    const [brand, setBrand] = useState<Brand>({} as Brand)
    const [searchKeyword, setSearchKeyword] = useState<string>('')
    const closeAddDialog = () => setAddDialogOpen(false)
    const closeUpdateDialog = () => setUpdateDialogOpen(false)

    const fetchBrands = () => {
        setFetchingBrands(true)
        axios.get('/api/brands')
            .then((res) => setBrands(res.data?.data))
            .catch((err) => console.error(err))
            .finally(() => setFetchingBrands(false))

    }

    const filteredBrands = useMemo(() => {
        return brands.filter(brand => {
            return Object.values({
                id: brand.id,
                brand: brand.name,
            }).join(' ').toLowerCase().includes(searchKeyword.toLowerCase() ?? '')
        })
    }, [brands, searchKeyword])

    const updateBrand = (data: any) => {
        axios.post(`/api/update-brand`, {...brand, ...data})
            .then((res) => {
                if (res.data?.status == true) {
                    console.log(JSON.stringify(res))
                    dispatch(updateSnackbarMessage({
                        title: 'Brand updated successfully',
                        message: 'Success',
                        severity: 'success'
                    }))
                    fetchBrands()
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
        fetchBrands()
        dispatch(updatePageTitle('Brands'))
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
                        placeholder={'Search brand...'}
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
                            {fetchingBrands
                                ? <TableRow>
                                    <TableCell colSpan={4} sx={{
                                        textAlign: 'center',
                                        py: 20,
                                        minHeight: '300px'
                                    }}>
                                        <LoadingItem/>
                                    </TableCell>
                                </TableRow>
                                : filteredBrands?.length < 1
                                    ? <TableRow>
                                        <TableCell colSpan={4} sx={{
                                            textAlign: 'center',
                                            py: 20,
                                            minHeight: '300px'
                                        }}>
                                            No Data
                                        </TableCell>
                                    </TableRow>
                                    : filteredBrands?.map((brand, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{brand?.id ?? '-'}</TableCell>
                                            <TableCell className={'highlighted'}>{brand?.name ?? '-'}</TableCell>
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
                                                      color={brand?.status == false ? 'warning' : brand?.status == true ? 'primary' : brand?.status == false ? 'secondary' : 'error'}
                                                      label={brand?.status == false ? 'Cancel' : brand?.status == true ? 'Unassigned' : brand?.status == false ? 'Assigned' : 'Scraped'}/>

                                            </TableCell>
                                            <TableCell className={'stickyRight'}>
                                                <ThemeSwitch className={'statusCheck'} size={'small'}
                                                             checked={brand?.status == true ? true : false}
                                                             onChange={(e, checked) => {
                                                                 setBrand(brand)
                                                                 updateBrand({status: checked ? 1 : 0, id: brand?.id})
                                                             }}/>
                                                <IconButton className={'actionButton'} onClick={() => {
                                                    setBrand(brand)
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
                         dialogBody={<AddBrandForm brand={brand} closeDialog={closeAddDialog}
                                                   fetchBrands={fetchBrands}/>}/>
            }

            {updateDialogOpen &&
            <ThemeDialog open={updateDialogOpen} onClickClose={closeUpdateDialog}
                         dialogBody={<UpdateBrandForm brand={brand} closeDialog={closeUpdateDialog}
                                                      fetchBrands={fetchBrands}/>}/>
            }
        </>
    )
}


const AddBrandForm = (props: any) => {

    const {brand, fetchBrands, closeDialog} = props
    const {control, handleSubmit, setError, setValue, reset, formState: {errors}} = useForm()
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const closeAndDiscard = () => {
        setValue('name', '')
        closeDialog()
    }

    const onSubmit = (data: any) => {
        setLoading(true)
        axios.post(`/api/add-brand`, {...data})
            .then((res) => {
                if (res.data?.status == true) {
                    reset()
                    dispatch(updateSnackbarMessage({
                        title: 'Brand added successfully',
                        message: 'Success',
                        severity: 'success'
                    }))
                    closeDialog()
                    fetchBrands()
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
            }}>Brand Name</Typography>
            <Controller
                name={`name`}
                control={control}
                defaultValue={brand?.name ?? ''}
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


const UpdateBrandForm = (props: any) => {

    const {brand, fetchBrands, closeDialog} = props
    const {control, handleSubmit,setError, setValue, reset, formState: {errors}} = useForm()
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    const closeAndDiscard = () => closeDialog()

    const updateBrand = (data: any) => {
        axios.post(`/api/update-brand`, {...brand, ...data})
            .then((res) => {
                if (res.data?.status == true) {
                    reset()
                    dispatch(updateSnackbarMessage({
                        title: 'Brand added successfully',
                        message: 'Success',
                        severity: 'success'
                    }))
                    closeDialog()
                    fetchBrands()
                } else {
                    setError("name", {type: "focus", message: res.data?.errors}, {shouldFocus: true})
                }
            })
            .catch((err) => {
                console.error(JSON.stringify(err))
            })
            .finally(() => setLoading(false))
    }

    const onSubmit = (data: any) => updateBrand(data)

    useEffect(() => {
        setValue('name', brand?.name)
    }, [brand])


    return (
        <Box component={'form'} sx={{minWidth: 'min(90vw, 350px)'}}>
            <Typography variant={'h6'} sx={{
                fontSize: '1.2rem',
                mb: 3,
            }}>Brand Name</Typography>
            <Controller
                name={`name`}
                control={control}
                defaultValue={brand?.name ?? ''}
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
