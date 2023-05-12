import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch} from "react-redux"
import {
    Autocomplete,
    alpha,
    Box, Button,
    Container,
    IconButton,
    InputAdornment,
    MenuItem,
    Typography,
    useTheme, InputLabel, FormHelperText, Input, FormControl
} from "@mui/material"
import {
    ArrowRightRounded,
    Attachment,
    DeleteOutlined,
} from "@mui/icons-material"
import {Controller, useFieldArray, useForm} from "react-hook-form"
import {updatePageTitle} from "../../slices/page-title-slice"
import PageContainer from "../../components/containers/page-container"
import {useNavigate} from "react-router-dom";
import {LoadingButton} from "@mui/lab";
import {textFieldSx, ThemeTextField} from "../../components/inputs/theme-text-field";
import axios from "axios";
import {updateSnackbarMessage} from "../../slices/snackbar-message-slice";
import {DatePicker} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import moment from "moment";
import LoadingView from "../../components/loading-view";
import {serverRoute} from "../../utils/app-helper";


interface optionData {
    id: string
    name: string
    slug: string
}

const billToUnits = [
    {id: 'SD1', name: 'SD1'},
    {id: 'MA2', name: 'MA2'},
    {id: 'SD3', name: 'SD3'},
    {id: 'MA4', name: 'MA4'},
]

export default function CreateInventory() {


    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)
    const [fetchingVendors, setFetchingVendors] = useState<boolean>(false)
    const [fetchingRequires, setFetchingRequires] = useState<boolean>(true)

    const [unit, setUnit] = useState<string>('')
    const [roles, setRoles] = useState<optionData[]>([])
    const [brands, setBrands] = useState<optionData[]>([])
    const [vendors, setVendors] = useState<any[]>([])
    const [categories, setCategories] = useState<optionData[]>([])

    const inventoryItem = {sno: '', category_id: '', brand_id: '', model: '', unit_price: '', invc_image: ''}

    const {control, reset, register, handleSubmit, setError, watch, clearErrors, formState: {errors}} = useForm({
        defaultValues: {
            vendor_id: '',
            unit_id: '',
            invoice_no: '',
            invoice_date: '',
            invoice_price: '',
            invoice_image: '',
            invoice_count: '',
            inventoryItems: [{...inventoryItem}]
        }
    })

    const {fields, remove, append} = useFieldArray({name: "inventoryItems", control})
    const appendRows = () => append(inventoryItem)


    const fetchRole = () => {
        setFetchingRequires(true)
        axios.get(`${serverRoute}/api/get-role`)
            .then((res) => {
                if (res.data?.status == true) {
                    setRoles(res.data?.data?.roles)
                } else console.log('some error occured')
            })
            .catch((err) => console.error(JSON.stringify(err)))
            .finally(() => setFetchingRequires(false))
    }
    const fetchBrands = () => {
        setFetchingRequires(true)
        axios.get(`${serverRoute}/api/get-brand`)
            .then((res) => {
                if (res.data?.status == true) {
                    setBrands(res.data?.data?.brands)
                    setCategories(res.data?.data?.categories)
                } else console.log('some error occured')
            })
            .catch((err) => console.error(JSON.stringify(err)))
            .finally(() => setFetchingRequires(false))
    }

    const fetchVendors = useCallback((unit: string) => {
        setFetchingVendors(true)
        axios.get(`${serverRoute}/api/get-vendors/${unit}`)
            .then((res) => {
                if (res.data?.status == true) {
                    setVendors(res.data?.data?.vendor_data)
                } else console.log('some error occured')
            })
            .catch((err) => console.error(JSON.stringify(err)))
            .finally(() => setFetchingVendors(false))
    }, [unit])


    const watchItems = watch('inventoryItems')

    const isUniqueSno = (sno: string, inputName: any) => {

        if (watchItems.filter((x) => x.sno == sno).length > 1) setError(inputName, {
            type: "focus",
            message: 'Duplicate serial no'
        }, {shouldFocus: true})
        else {
            axios.get(`${serverRoute}/api/check-serialno/${sno}`)
                .then((res) => {
                    console.log(res.data?.status)
                    if (res.data?.status == true) setError(inputName, {
                        type: "focus",
                        message: 'Serial No already exists'
                    }, {shouldFocus: true})
                    else clearErrors([inputName])
                })
                .catch((err) => console.error(JSON.stringify(err)))
        }
    }

    const onSubmit = (data: any) => {

        setLoading(true)
        const itemImages = [] as any

        for (let x = 0; x < fields.length; x++) {
            itemImages[x] = {invc_image: data.inventoryItems[x].invc_image[0]}
        }

        const newData = {
            ...data,
            unit_id: unit,
            vendor_id: data.vendor_id.value,
            vendor_name: data.vendor_id.name,
            invoice_date: moment(data.invoice_date).format('DD-MM-YYYY'),
            invoice_image: data.invoice_image[0],
            invoice_count: fields.length,
            itemImages
        }

        console.log('newData', newData)
        axios.post(`${serverRoute}/api/create-inventory`, newData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then((res) => {
                if (res.data?.status == true) {
                    reset();
                    dispatch(updateSnackbarMessage({
                        title: 'Updated!',
                        message: 'User updated successfully!',
                        severity: 'success'
                    }))
                    navigate('/inventories')
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
        dispatch(updatePageTitle('Add Inventory'))
        fetchRole()
        fetchBrands()
    }, [])


    return (
        <PageContainer>
            <Container sx={{
                height: '100%',
            }}>
                {
                    fetchingRequires
                        ? <LoadingView/>
                        : <>
                            <Box component={'form'} sx={{
                                pt: 3,
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexFlow: 'column',
                                minHeight: 'min(100%, 500px)',
                                '& .formItem': {
                                    flex: 1,
                                    minWidth: {xs: '100%', sm: '30%'}
                                },
                                '& .itemRow': {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    '& .MuiIconButton-root': {
                                        mt: 1,
                                        height: '1.5rem',
                                        width: '1.5rem',
                                        color: theme.palette.primary.main,
                                        transition: 'all 300ms ease-in-out',
                                        '&:hover': {
                                            boxShadow: '0 0 12px -4px inset',
                                        },
                                        '& svg': {
                                            height: '16px',
                                            width: '16px',
                                        },
                                        '&:has(svg[data-testid="DeleteOutlinedIcon"])': {
                                            color: theme.palette.error.dark
                                        },
                                        '&:not(:last-of-type)': {
                                            // marginRight: '8px',
                                        }
                                    },
                                    '& .formItem': {
                                        flex: 1,
                                        minWidth: {xs: '100%', sm: '15%'}
                                    },
                                    '& .srNo': {
                                        height: '1.5rem',
                                        width: '1rem',
                                        pt: '8px',
                                        display: 'grid',
                                        placeItems: 'center',
                                    },
                                    '& .sno': {
                                        width: {xs: '100%', sm: '15%'},
                                        minWidth: '120px',
                                    },
                                    '& .category': {
                                        width: {xs: '100%', sm: '15%'},
                                        minWidth: '120px',
                                    },
                                    '& .brand': {
                                        width: {xs: '100%', sm: '15%'},
                                        minWidth: '120px',
                                    },
                                    '& .model': {
                                        width: {xs: '100%', sm: '15%'},
                                        minWidth: '120px',
                                    },
                                    '& .price': {
                                        width: {xs: '100%', sm: '10%'},
                                        minWidth: '120px',
                                    },
                                    '& .invcImg': {
                                        width: {xs: '100%', sm: '15%'},
                                        minWidth: '120px',
                                    },
                                },
                                '& input.invcImage::-webkit-file-upload-button': {
                                    display: 'none',
                                },
                                '& .fileInput': {
                                    '& .MuiFormLabel-root': {
                                        '&:after': {
                                            content: '""',
                                            background: theme.palette.background.paper,
                                            position: 'absolute',
                                            height: '100%',
                                            display: 'block',
                                            width: '100%',
                                            top: 0,
                                            zIndex: '-1',
                                        },
                                    },
                                    '& .MuiInputBase-root': {
                                        padding: '8.5px 14px 8.5px 26px',
                                        position: 'relative',
                                        marginTop: 0,
                                        borderRadius: '12px',
                                        fontSize: '13px',
                                        border: '1px solid #b7c2ce',
                                        '&:after, &:before': {
                                            display: 'none',
                                        },
                                        '&.Mui-error': {
                                            border: `1px solid ${theme.palette.error.main}`,
                                        },
                                        '& input': {
                                            padding: 0,
                                            '&::-webkit-file-upload-button': {
                                                display: 'none',
                                            },
                                        },
                                    },
                                    '&:has(.Mui-focused)': {},
                                    '& svg': {
                                        position: 'absolute',
                                        left: '6px',
                                        top: '8px',
                                        height: '22px',
                                        width: '22px',
                                        color: '#b7c2ce',
                                    },
                                },

                            }}>
                                <Box sx={{flex: 1}}>

                                    <Typography variant={'h3'} className={'pageHeading'}>Items Detail</Typography>
                                    <Box sx={{
                                        p: 1,
                                        py: 3,
                                        borderRadius: '20px',
                                        flex: 1,
                                        width: '100%',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'flex-start',
                                        alignContent: 'flex-start',
                                        justifyContent: 'flex-end',
                                        columnGap: '1rem',
                                        mx: 'auto',
                                        mb: 4,
                                        background: alpha(theme.palette.background.paper, 0.2),
                                        backdropFilter: 'blur(12px)',
                                    }}>
                                        {fields.map((field, index) => {
                                            return (
                                                <Box className={'itemRow'} key={field.id}>
                                                    <Box className={'srNo'}>{index + 1}</Box>
                                                    <Controller
                                                        name={`inventoryItems.${index}.sno`}
                                                        control={control}
                                                        rules={{required: {value: true, message: 'Required'}}}
                                                        render={({field}) => (
                                                            <ThemeTextField
                                                                {...field} required autoFocus
                                                                onBlur={(e) => isUniqueSno(e.target.value, `inventoryItems.${index}.sno`)}
                                                                error={Boolean(errors?.inventoryItems?.[index]?.sno)}
                                                                helperText={errors?.inventoryItems?.[index]?.sno?.message}
                                                                size={'small'} label={'Serial No'}
                                                                className={'sno'}
                                                                placeholder={'serial no'}/>
                                                        )}/>


                                                    <Controller
                                                        name={`inventoryItems.${index}.category_id`}
                                                        control={control}
                                                        rules={{required: {value: true, message: 'Required'}}}
                                                        render={({field}) => (
                                                            <ThemeTextField
                                                                {...field} select required
                                                                error={Boolean(errors?.inventoryItems?.[index]?.category_id)}
                                                                helperText={errors?.inventoryItems?.[index]?.category_id?.message}
                                                                size={'small'} label={'Category'}
                                                                className={'category'}
                                                                placeholder={'Select Category'}>
                                                                {categories?.map((category, index) => (
                                                                    <MenuItem key={index}
                                                                              value={category.id}>{category.name}</MenuItem>
                                                                ))}
                                                            </ThemeTextField>
                                                        )}/>
                                                    <Controller
                                                        name={`inventoryItems.${index}.brand_id`}
                                                        control={control}
                                                        rules={{required: {value: true, message: 'Required'}}}
                                                        render={({field}) => (
                                                            <ThemeTextField
                                                                {...field} select required
                                                                error={Boolean(errors?.inventoryItems?.[index]?.brand_id)}
                                                                helperText={errors?.inventoryItems?.[index]?.brand_id?.message}
                                                                size={'small'} label={'Brand'}
                                                                className={'brand'}
                                                                placeholder={'Select Brand'}>
                                                                {brands?.map((brand, index) => (
                                                                    <MenuItem key={index}
                                                                              value={brand.id}>{brand.name}</MenuItem>
                                                                ))}
                                                            </ThemeTextField>
                                                        )}/>

                                                    <Controller
                                                        name={`inventoryItems.${index}.model`}
                                                        control={control}
                                                        rules={{required: {value: true, message: 'Required'}}}
                                                        render={({field}) => (
                                                            <ThemeTextField
                                                                {...field} required
                                                                error={Boolean(errors?.inventoryItems?.[index]?.model)}
                                                                helperText={errors?.inventoryItems?.[index]?.model?.message}
                                                                size={'small'} label={'Model'}
                                                                className={'model'}
                                                                placeholder={'Enter model'}/>
                                                        )}/>

                                                    <Controller
                                                        name={`inventoryItems.${index}.unit_price`}
                                                        control={control}
                                                        rules={{required: {value: true, message: 'Required'}}}
                                                        render={({field}) => (
                                                            <ThemeTextField
                                                                {...field} required
                                                                error={Boolean(errors?.inventoryItems?.[index]?.unit_price)}
                                                                helperText={errors?.inventoryItems?.[index]?.unit_price?.message}
                                                                size={'small'} label={'Unit Price'}
                                                                className={'price'}
                                                                placeholder={'price'}/>
                                                        )}/>


                                                    <FormControl className={'fileInput invcImg'}
                                                                 error={Boolean(errors?.inventoryItems?.[index]?.invc_image)}>
                                                        <InputLabel htmlFor={`inventoryItems.${index}.invc_image`}>Item
                                                            Image*</InputLabel>
                                                        <Input id={`inventoryItems.${index}.invc_image`}
                                                               aria-describedby={`invoice-image-text-${index}`}
                                                               startAdornment={<InputAdornment
                                                                   position="start"><Attachment/></InputAdornment>}
                                                               required
                                                               inputProps={{accept: 'image/png, image/jpeg, image/jpg'}}
                                                               type={'file'}  {...register(`inventoryItems.${index}.invc_image`, {required: true})}/>
                                                        <FormHelperText
                                                            id={`invoice-image-text-${index}`}>{Boolean(errors?.inventoryItems?.[index]?.invc_image) && 'Required'}</FormHelperText>
                                                    </FormControl>


                                                    <IconButton onClick={() => remove(index)}>
                                                        <DeleteOutlined/>
                                                    </IconButton>
                                                </Box>
                                            )
                                        })}

                                        <Button size={'small'} variant={'outlined'} onClick={appendRows}>Add Item</Button>

                                    </Box>

                                    <Typography variant={'h3'} className={'pageHeading'}>Invoice Details</Typography>
                                    <Box sx={{
                                        pt: 3,
                                        flex: 1,
                                        width: '100%',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'flex-start',
                                        alignContent: 'flex-start',
                                        columnGap: '1rem',
                                        mx: 'auto',
                                        mb: 4,
                                    }}>

                                        {/*<Controller name={`unit_id`}*/}
                                        {/*            control={control}*/}
                                        {/*            rules={{required: {value: true, message: 'Required'}}}*/}
                                        {/*            defaultValue={''} render={({field}) => (*/}
                                        <ThemeTextField
                                            select required
                                            error={Boolean(errors?.unit_id)}
                                            helperText={errors?.unit_id?.message}
                                            size={'small'} label={'Bill to Unit'}
                                            className={'formItem'}
                                            value={unit}
                                            onChange={(e) => {
                                                setUnit(e.target.value)
                                                fetchVendors(e.target.value)
                                            }}
                                            placeholder={'Select Unit'}>
                                            {billToUnits?.map((unit, index) => (
                                                <MenuItem key={index} value={unit.id}>{unit.name}</MenuItem>
                                            ))}
                                        </ThemeTextField>
                                        {/*)}/>*/}

                                        <Controller name={`vendor_id`}
                                                    control={control}
                                                    rules={{required: {value: true, message: 'Required'}}}
                                                    defaultValue={''} render={({field: {onChange, value}}) => (
                                            <Autocomplete size={'small'}
                                                          className={'formItem'}
                                                          onChange={(e, data) => onChange(data)}
                                                          loading={fetchingVendors}
                                                          options={vendors.map((vendor) => ({
                                                              label: `${vendor.id} - ${vendor.vname}`,
                                                              value: vendor.id,
                                                              name: vendor.vname
                                                          }))}
                                                          isOptionEqualToValue={((option, value) => option.value == value.value)}
                                                          renderInput={(params) => (
                                                              <ThemeTextField
                                                                  {...params} required
                                                                  error={Boolean(errors?.vendor_id)}
                                                                  helperText={errors?.vendor_id?.message}
                                                                  size={'small'} label={'Vendors'}
                                                                  placeholder={'Select vendor'}
                                                              />
                                                          )}/>
                                        )}/>


                                        <Controller
                                            name={`invoice_no`}
                                            control={control}
                                            rules={{required: {value: true, message: 'Required'}}}
                                            render={({field}) => (
                                                <ThemeTextField
                                                    {...field} required
                                                    error={Boolean(errors?.invoice_no)}
                                                    helperText={errors?.invoice_no?.message}
                                                    size={'small'} label={'Invoice No'}
                                                    className={'formItem'}
                                                    placeholder={'Invoice no'}
                                                />
                                            )}/>

                                        <Controller
                                            name={`invoice_date`}
                                            control={control}
                                            rules={{required: {value: true, message: 'Required'}}}
                                            render={({field: {onChange, value}}) => (
                                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                                    <DatePicker
                                                        disableFuture
                                                        label="Invoice Date"
                                                        format={'DD-MM-Y'}
                                                        value={value}
                                                        onChange={onChange}
                                                        sx={{}}
                                                        slotProps={{
                                                            textField: {
                                                                size: 'small',
                                                                sx: textFieldSx,
                                                                className: 'formItem',
                                                                error: Boolean(errors?.invoice_date),
                                                                helperText: errors?.invoice_date?.message,
                                                            }
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            )}/>

                                        <Controller
                                            name={`invoice_price`}
                                            control={control}
                                            rules={{required: {value: true, message: 'Required'}}} render={({field}) => (
                                            <ThemeTextField
                                                {...field} error={Boolean(errors?.invoice_price)}
                                                helperText={errors?.invoice_price?.message}
                                                size={'small'} type={'number'}
                                                label={'Invoice Price'} required
                                                className={'formItem'}
                                                placeholder={'Enter price'}/>
                                        )}/>

                                        <FormControl className={'fileInput formItem'}
                                                     error={Boolean(errors?.invoice_image)}>
                                            <InputLabel htmlFor="invoice_image">Invoice Image*</InputLabel>
                                            <Input id="invoice_image" aria-describedby="invoice-image-text"
                                                   startAdornment={<InputAdornment
                                                       position="start"><Attachment/></InputAdornment>}
                                                   required
                                                   inputProps={{accept: 'image/png, image/jpeg, image/jpg'}}
                                                   type={'file'}  {...register('invoice_image', {required: true})}/>
                                            <FormHelperText
                                                id="invoice-image-text">{Boolean(errors?.invoice_image) && 'Required'}</FormHelperText>
                                            {/*<Attachment/>*/}
                                        </FormControl>


                                    </Box>


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
                                <LoadingButton onClick={handleSubmit(onSubmit)} variant={'contained'} type={'submit'}
                                               loading={loading} sx={{minWidth: {xs: 'min-content', sm: '150px'}}}>
                                    Create <ArrowRightRounded/>
                                </LoadingButton>
                            </Box>
                        </>
                }

            </Container>
        </PageContainer>
    )
}