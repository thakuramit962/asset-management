import React, {useCallback, useEffect, useMemo, useState} from 'react'
import PageContainer from "../../components/containers/page-container"
import {updatePageTitle} from "../../slices/page-title-slice"
import {useDispatch} from "react-redux"
import {
    alpha,
    Autocomplete,
    Box,
    Button, Chip, Container, Divider, FormControl, FormControlLabel, FormLabel, Icon,
    IconButton,
    InputAdornment, MenuItem,
    Paper, Radio, RadioGroup, SelectChangeEvent, Stack, SvgIcon,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination,
    TableRow, Tooltip,
    Typography,
    useTheme
} from "@mui/material"
import ThemeFab from "../../components/button/theme-fab";
import {Link, useNavigate} from "react-router-dom";
import {updateSnackbarMessage} from "../../slices/snackbar-message-slice";
import {downloadFile, serverRoute} from "../../utils/app-helper";
import ThemeDialog from "../../components/dialog-box/theme-dialog";
import {LoadingButton, Pagination} from "@mui/lab";
import {Controller, useForm} from "react-hook-form";
import {
    ArrowRightRounded, CloudDownloadOutlined,
    CloudUploadOutlined,
    FileDownloadOutlined, FileUploadOutlined, Label, LabelOff, PersonAdd, PersonAddRounded, PersonRemoveRounded,
    Print, Refresh,
    Search, Sync, UploadRounded,
} from "@mui/icons-material";
import {LoadingItem} from "../../components/loading-view";
import {ThemeTableContainer} from "../../components/theme-table-container";
import {Inventory} from "../../models/inventory";
import usePagination from "../../hooks/use-pagination";
import {ThemeTextField} from "../../components/inputs/theme-text-field";
import moment from "moment";
import notifyBell from "../../assets/images/notify.png";
import API from "../../api";


export default function Inventories() {

    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const [searchKeyword, setSearchKeyword] = useState<string>('')
    const [inventoryFetching, setInventoryFetching] = useState<boolean>(true)
    const [inventories, setInventories] = useState<Inventory[]>([])
    const [selectedAsset, setSelectedAsset] = useState<Inventory>({} as Inventory)
    const [printingUnderTaking, setPrintingUnderTaking] = useState<boolean>(false)
    const [exporting, setExporting] = useState<boolean>(false)
    const [underTakingUploadDialogOpen, setUnderTakingUploadDialogOpen] = useState<boolean>(false)
    const [assignStatusDialogOpen, setAssignStatusDialogOpen] = useState<boolean>(false)
    const [unAssignStatusDialogOpen, setUnAssignStatusDialogOpen] = useState<boolean>(false)
    const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false)
    const closeUnAssignStatusDialog = () => setUnAssignStatusDialogOpen(false)
    const closeAssignStatusDialog = () => setAssignStatusDialogOpen(false)


    const filteredInventories = useMemo(() => {
        return inventories.filter((inventory) => {
            return Object.values({
                ...inventory,
                ...inventory.inventories,
                category: inventory.category.name,
                brand: inventory.brand.name,
            }).join(' ').toLowerCase().includes(searchKeyword.toLowerCase() ?? '');
        });

        // return inventories.filter(inventory => {
        //     return Object.values({
        //         id: inventory.id,
        //         un_id: inventory.un_id,
        //         category: inventory.category.name,
        //         brand: inventory.brand.name,
        //         sno: inventory.sno,
        //     }).join(' ').toLowerCase().includes(searchKeyword.toLowerCase() ?? '')
        // })
    }, [inventories, searchKeyword])

    const [itemsPerPage, setItemsPerPage] = useState(10)
    const {currentPage, getCurrentData, setCurrentPage, pageCount} = usePagination(filteredInventories, itemsPerPage)
    const inventoryList = getCurrentData()

    const onChangeItemsPerPage = (event: any) => {
        setItemsPerPage(+event.target.value)
        setCurrentPage(1)
    }

    const fetchInventory = useCallback(() => {
        setInventoryFetching(true)
        API.get(`/inventories`)
            .then((res) => {
                if (res.data?.status == true) console.log('inventory', res.data?.data)
                if (res.data?.status == true) setInventories(res.data?.data)
                // else console.log('some error occured')
            })
            .catch((err) => console.error(JSON.stringify(err)))
            .finally(() => setInventoryFetching(false))
    }, [])

    const exportInventory = () => {
        setExporting(true)
        const today = moment().format('DD-MM-YYYY-HH-mm-ss')
        API.get(`/inventory/export`)
            .then((res) => {
                console.log('inventory', res.data)
                downloadFile(res.data, `asset-inventory-${today}.csv`)
            })
            .catch((err) => console.error(JSON.stringify(err)))
            .finally(() => setExporting(false))
    }

    const printUnderTaking = (id: string) => {
        setPrintingUnderTaking(true)
        API.get(`/pdf-inventory/${id}`)
            .then((res) => {
                console.log('inventory', res.data)
                downloadFile(res.data, `assest-${id}-undertaking.pdf`)
            })
            .catch((err) => console.error(JSON.stringify(err)))
            .finally(() => setPrintingUnderTaking(false))
    }


    useEffect(() => {
        dispatch(updatePageTitle('Inventory List'))
        fetchInventory()
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
                               flexWrap: 'wrap',
                               rowGap: '8px',
                               justifyContent: 'space-between',
                           }}>

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
                            placeholder={'Search entries...'}
                        />

                        <Stack direction={'row'} sx={{
                            flex: 1,
                            gap: 2,
                            justifyContent: 'flex-end',
                            '& .MuiButton-root': {
                                textTransform: 'none'
                            },
                        }}>
                            <LoadingButton
                                loading={exporting}
                                variant={'contained'}
                                startIcon={<FileDownloadOutlined/>}
                                loadingPosition={'start'}
                                onClick={exportInventory}>
                                Export
                            </LoadingButton>
                            <Button variant={'contained'} onClick={() => setImportDialogOpen(true)} sx={{
                                '& svg': {
                                    fontSize: '20px',
                                    marginRight: '6px',
                                },
                            }}>
                                <FileUploadOutlined/> Import
                            </Button>

                            <IconButton onClick={fetchInventory}><Sync/></IconButton>
                        </Stack>

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
                                    <TableCell className={'stickyLeft'} sx={{width: '140px'}}>Asset Code</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell sx={{width: '180px'}}>Assigned To</TableCell>
                                    <TableCell>Assigned Date</TableCell>
                                    <TableCell>Brand</TableCell>
                                    <TableCell>Model</TableCell>
                                    <TableCell>Serial No</TableCell>
                                    <TableCell>Unit Price</TableCell>
                                    <TableCell>Bill to Unit</TableCell>
                                    <TableCell sx={{width: '200px'}}>Vendor</TableCell>
                                    <TableCell>Invoice No</TableCell>
                                    <TableCell>Invoice Date</TableCell>
                                    <TableCell>Invoice Price</TableCell>
                                    {/*<TableCell sx={{width: '140px', textAlign: 'center'}}>Parent Asset</TableCell>*/}
                                    {/*<TableCell sx={{width: '116px', textAlign: 'center'}}>Child Assets</TableCell>*/}

                                    <TableCell>Email Approval</TableCell>
                                    <TableCell className={'stickyRight'} sx={{width: '170px'}}>Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {inventoryFetching
                                    ? <TableRow>
                                        <TableCell colSpan={15} sx={{
                                            textAlign: 'center',
                                            py: 15,
                                        }}>
                                            <LoadingItem/>
                                        </TableCell>
                                    </TableRow>
                                    : filteredInventories?.length < 1
                                        ? <TableRow>
                                            <TableCell colSpan={15} sx={{
                                                textAlign: 'center',
                                                py: 15,
                                            }}>
                                                No Data<br/><br/>
                                                <IconButton onClick={fetchInventory} sx={{
                                                    fontSize: '12px',
                                                    minWidth: '4rem',
                                                    borderRadius: '50vh'
                                                }}><Sync/> Refresh</IconButton>

                                            </TableCell>
                                        </TableRow>
                                        : inventoryList?.map((inventory, index) => (
                                            <TableRow key={index}>
                                                <TableCell className={'highlighted stickyLeft'}
                                                           sx={{
                                                               cursor: 'pointer',
                                                               color: inventory?.status == 3 ? theme.palette.error.main : theme.palette.text.primary,
                                                           }}>
                                                    <span onClick={() => navigate(`${inventory?.id}`)}>
                                                        {inventory?.un_id ? `FR-CHD-${inventory?.un_id}` : '-'}
                                                    </span>

                                                </TableCell>
                                                <TableCell>
                                                    {inventory?.category?.name ?? '-'}
                                                </TableCell>

                                                <TableCell>
                                                    <Chip size={'small'}
                                                        // onClick={() => {
                                                        //     if (inventory?.status == 1 || inventory?.status == 2) {
                                                        //         setSelectedAsset(inventory)
                                                        //         if (inventory?.status == 2) setUnAssignStatusDialogOpen(true)
                                                        //         else setAssignStatusDialogOpen(true)
                                                        //     }
                                                        // }}
                                                          sx={{
                                                              minWidth: '90px',
                                                              height: '20px',
                                                              fontSize: '11px',
                                                              fontWeight: 600,
                                                              borderWidth: '1.5px',
                                                              mr: 1,
                                                          }}
                                                          variant={'outlined'}
                                                          color={inventory?.status == 0 ? 'warning' : inventory?.status == 1 ? 'primary' : inventory?.status == 2 ? 'success' : 'error'}
                                                          label={inventory?.status == 0 ? 'Cancel' : inventory?.status == 1 ? 'Unassigned' : inventory?.status == 2 ? 'Assigned' : 'Scraped'}/>

                                                </TableCell>


                                                <TableCell sx={{
                                                    width: '180px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    <Tooltip title={inventory?.assign_emp_name ?? ''} arrow
                                                             placement={'bottom'}>
                                                        <span>{inventory?.assign_emp_name ?? '-'}</span>
                                                    </Tooltip>
                                                </TableCell>

                                                <TableCell>
                                                    {inventory?.assigned_date ? moment(inventory?.assigned_date, ["DD-MM-YYYY"]).format('DD-MM-yyyy') : '-'}
                                                </TableCell>

                                                <TableCell>
                                                    {inventory?.brand?.name ?? '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {inventory?.model ?? '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {inventory?.sno ?? '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {inventory?.unit_price ? `₹${inventory?.unit_price}` : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {inventory?.inventories?.unit_id ?? '-'}
                                                </TableCell>
                                                <TableCell sx={{
                                                    width: '200px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    <Tooltip title={inventory?.inventories?.vendor_name ?? ''} arrow>
                                                        <span>{inventory?.inventories?.vendor_name ?? '-'}</span>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>
                                                    {inventory?.inventories?.invoice_no ?? '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {inventory?.inventories?.invoice_date
                                                        ? moment(inventory?.inventories?.invoice_date, ["DD-MM-YYYY"]).format('DD-MM-yyyy')
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {inventory?.inventories?.invoice_price
                                                        ? `₹${inventory?.inventories?.invoice_price}`
                                                        : '-'}
                                                </TableCell>

                                                {/*<TableCell className={'highlighted'} sx={{textAlign: 'center'}}>*/}
                                                {/*    {inventory?.asset_parent_id*/}
                                                {/*        ? `FR-CHD-${inventory?.asset_parent_id}`*/}
                                                {/*        : '-'}*/}
                                                {/*</TableCell>*/}

                                                {/*<TableCell className={'highlighted'} sx={{textAlign: 'center'}}>*/}
                                                {/*    {inventory?.asset_children?.length}*/}
                                                {/*</TableCell>*/}

                                                <TableCell sx={{textAlign: 'center'}}>
                                                    <Chip size={'small'}
                                                          sx={{
                                                              minWidth: '90px',
                                                              height: '20px',
                                                              fontSize: '11px',
                                                              fontWeight: 600,
                                                              borderWidth: '1.5px',
                                                          }}
                                                          variant={'outlined'}
                                                          color={
                                                              inventory?.status == 1 && !inventory?.unassigned_date
                                                                  ? 'primary'
                                                                  : inventory.is_approved == 0 ? 'warning'
                                                                  : inventory.is_approved == 1 ? 'success'
                                                                      : 'error'}
                                                          label={
                                                              inventory?.status == 1 && !inventory?.unassigned_date
                                                                  ? 'Created'
                                                                  : inventory.is_approved == 0 ? 'Pending'
                                                                  : inventory.is_approved == 1 ? 'Approved'
                                                                      : 'Declined'}/>
                                                </TableCell>

                                                <TableCell className={'stickyRight'}>
                                                    <Tooltip title={'Assign Asset'} arrow>
                                                        <IconButton
                                                            onClick={() => {
                                                                if (inventory?.status == 1) {
                                                                    setSelectedAsset(inventory)
                                                                    setAssignStatusDialogOpen(true)
                                                                }
                                                            }}
                                                            disabled={(inventory?.status != 1) || (inventory?.status == 3)}><PersonAddRounded/></IconButton>
                                                    </Tooltip>
                                                    <Tooltip title={'Unassign Asset'} arrow>
                                                        <IconButton
                                                            onClick={() => {
                                                                if (inventory?.status == 2) {
                                                                    setSelectedAsset(inventory)
                                                                    setUnAssignStatusDialogOpen(true)
                                                                }
                                                            }}
                                                            disabled={(inventory?.status != 2) || (inventory?.status == 3)}>
                                                            <PersonRemoveRounded/>
                                                        </IconButton>
                                                    </Tooltip>

                                                    {inventory?.undertaking_image
                                                        ? <Tooltip title={'View uploaded Undertaking'} arrow>
                                                            <a href={inventory?.undertaking_image} target="_blank">
                                                                <IconButton sx={{
                                                                    minWidth: '4rem',
                                                                    fontSize: '12px',
                                                                    borderRadius: '50vh',
                                                                    gap: '4px',
                                                                }}>
                                                                    <CloudDownloadOutlined/> View
                                                                </IconButton>
                                                            </a>
                                                        </Tooltip>
                                                        : <>
                                                            <Tooltip title={'Print Undertaking'} arrow>
                                                                <IconButton
                                                                    onClick={() => printUnderTaking(inventory?.id)}
                                                                    disabled={printingUnderTaking || (inventory?.status != 2) || (inventory?.status == 3)}><Print/></IconButton>
                                                            </Tooltip>
                                                            <Tooltip title={'Upload Undertaking'} arrow>
                                                                <IconButton onClick={() => {
                                                                    setSelectedAsset(inventory)
                                                                    setUnderTakingUploadDialogOpen(true)
                                                                }}
                                                                            disabled={printingUnderTaking || (inventory?.status != 2) || (inventory?.status == 3)}>
                                                                    <CloudUploadOutlined/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    }


                                                </TableCell>
                                            </TableRow>
                                        ))}
                            </TableBody>
                        </Table>
                    </ThemeTableContainer>

                    {inventories?.length > 0 &&
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


            {assignStatusDialogOpen &&
            <ThemeDialog open={assignStatusDialogOpen}
                         dialogBody={<AssignStatusForm closeDialog={closeAssignStatusDialog}
                                                       assetId={selectedAsset.id} onCompletion={fetchInventory}/>}/>
            }


            {unAssignStatusDialogOpen &&
            <ThemeDialog open={unAssignStatusDialogOpen}
                         dialogBody={<UnAssignStatusForm closeDialog={closeUnAssignStatusDialog}
                                                         asset={selectedAsset} onCompletion={fetchInventory}/>}/>
            }

            {importDialogOpen &&
            <ThemeDialog open={importDialogOpen}
                         dialogBody={<ImportForm setDialogOpen={setImportDialogOpen} title={'Import Inventory'}
                                                 api={'inventory/bulk-upload'} onCompletion={fetchInventory}
                                                 accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>}/>
            }


            {underTakingUploadDialogOpen &&
            <ThemeDialog open={underTakingUploadDialogOpen}
                         dialogBody={<ImportForm setDialogOpen={setUnderTakingUploadDialogOpen}
                                                 title={'Upload Undertaking'} onCompletion={fetchInventory}
                                                 accept={'image/png, image/jpeg, image/jpg'}
                                                 api={`undertaking-upload/${selectedAsset.id}`}/>}
            />
            }


            <ThemeFab onClick={() => navigate('/create-inventory')}/>
        </>
    )
}


const AssignStatusForm = (props: any) => {

    const {closeDialog, assetId, onCompletion} = props
    const dispatch = useDispatch()

    const {control, handleSubmit, setValue, reset, formState: {errors}} = useForm()
    const [loading, setLoading] = useState<boolean>(false)
    const [fetchingEmployees, setFetchingEmployees] = useState<boolean>(false)
    const [employees, setEmployees] = useState<any[]>([])

    const [assetValue, setAssetValue] = useState('assign')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setAssetValue((e.target as HTMLInputElement).value)


    async function fetchEmployees() {
        setFetchingEmployees(true)
        try {
            let fetchedData = await fetch('https://test-courier.easemyorder.com/api/get-employee-list')
            const fetchedResponse = await fetchedData.json()
            console.log('ss', fetchedResponse)
            setEmployees(fetchedResponse.data)
            setFetchingEmployees(false)
        } catch (error) {
            console.log(error);
            setFetchingEmployees(false)
        }
    }

    const onSubmit = (data: any) => {
        setLoading(true)
        let newData = {}
        if (assetValue != 'assign')
            newData = {asset_id: assetId, status: 3, remarks: data.remarks}
        else newData = {
            asset_id: assetId,
            status: 2,
            assign_emp_id: data.employee_id.value,
            assign_emp_name: data.employee_id.name,
            remarks: data.remarks
        }

        API.post(`/update-assign-status`, newData)
            .then((res) => {
                if (res.data?.status == true) {
                    onCompletion()
                    reset();
                    dispatch(updateSnackbarMessage({
                        title: 'Updated!',
                        message: 'Asset updated successfully!',
                        severity: 'success'
                    }))
                    closeDialog()
                } else {
                    dispatch(updateSnackbarMessage({
                        title: 'Updated Failed',
                        message: 'Asset updated failed...',
                        severity: 'error'
                    }))
                }
            })
            .catch((err) => console.error(JSON.stringify(err)))
            .finally(() => setLoading(false))
    }

    const resetAndClose = () => {
        setValue('remarks', '')
        setValue('employee_id', '')
        setAssetValue('assign')
        closeDialog()
    }


    useEffect(() => {
        fetchEmployees()
    }, [])

    return (
        <Box sx={{width: '95vw', maxWidth: '700px'}}>
            <Typography variant={'h6'} sx={{
                fontSize: '1.2rem',
                mb: 3,
            }}>Change Asset Status</Typography>

            <Box component={'form'} sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexFlow: 'column',
                gap: 3,
                minHeight: 'min(40vh, 500px)',
            }}>
                <Box sx={{
                    flex: 1,
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    justifyContent: 'flex-start',
                    columnGap: '1rem',
                    // maxWidth: '600px',
                    mx: 'auto',
                }}>

                    <FormControl sx={{mb: 3,}}>
                        <FormLabel id="asset_status" sx={{fontSize: '13px', fontWeight: 600}}>Choose Status</FormLabel>
                        <RadioGroup row aria-labelledby="asset_status" name="asset_status" value={assetValue}
                                    onChange={handleChange}>
                            <FormControlLabel value="assign" control={<Radio size={'small'}/>} label="Assign"/>
                            <FormControlLabel value="scrap" control={<Radio size={'small'}/>} label="Scrap"/>
                        </RadioGroup>
                    </FormControl>

                    <Controller name={`employee_id`}
                                control={control}
                                rules={{required: {value: assetValue == 'assign', message: 'Required'}}}
                                defaultValue={''} render={({field: {onChange, value}}) => (
                        <Autocomplete size={'small'}
                                      className={'formItem'}
                                      onChange={(e, data) => onChange(data)}
                                      loading={fetchingEmployees}
                                      disabled={assetValue != 'assign'}
                                      options={employees.map((employee) => ({
                                          label: `${employee.id} - ${employee.name} - ${employee.status}`,
                                          value: employee.employee_id,
                                          name: employee.name,
                                          status: employee.status
                                      }))}
                                      getOptionDisabled={(option) => option?.status == "Blocked"}
                                      sx={{width: '100%'}}
                                      isOptionEqualToValue={((option, value) => option.value == value.value)}
                                      renderInput={(params) => (
                                          <ThemeTextField
                                              {...params} required
                                              error={Boolean(errors?.employee_id)}
                                              helperText={(errors?.employee_id?.message ?? '').toString()}
                                              size={'small'} label={'Employee'}
                                              placeholder={'Select employee'}
                                          />
                                      )}/>
                    )}/>

                    <Controller
                        name={`remarks`}
                        control={control}
                        rules={{required: {value: true, message: 'Required'}}}
                        render={({field}) => (
                            <ThemeTextField
                                {...field} required multiline rows={4}
                                error={Boolean(errors?.remarks)}
                                helperText={(errors?.remarks?.message ?? '').toString()}
                                size={'small'} label={'Remarks'}
                                sx={{flex: 1, minWidth: {xs: '100%', sm: '100%'}}}
                                placeholder={'remarks...'}
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
                    <LoadingButton onClick={resetAndClose} disabled={loading}>Discard & Close</LoadingButton>
                    <LoadingButton onClick={handleSubmit(onSubmit)} variant={'contained'}
                                   loading={loading} sx={{minWidth: {xs: 'min-content', sm: '150px'}}}>
                        Update <ArrowRightRounded/>
                    </LoadingButton>
                </Box>
            </Box>

        </Box>
    )
}


const UnAssignStatusForm = (props: any) => {

    const {closeDialog, asset, onCompletion} = props
    const dispatch = useDispatch()

    const {control, handleSubmit, setValue, reset, formState: {errors}} = useForm()
    const [loading, setLoading] = useState<boolean>(false)


    const onSubmit = (data: any) => {
        setLoading(true)
        let newData = {
            asset_id: asset?.id,
            status: 1,
            remarks: data.remarks,
            assign_emp_name: '',
            assign_emp_id: '',
            assigned_date: '',
        }

        API.post(`/update-assign-status`, newData)
            .then((res) => {
                if (res.data?.status == true) {
                    onCompletion()
                    reset()
                    dispatch(updateSnackbarMessage({
                        title: 'Updated!',
                        message: 'Asset updated successfully!',
                        severity: 'success'
                    }))
                    closeDialog()
                } else {
                    dispatch(updateSnackbarMessage({
                        title: 'Updated Failed',
                        message: 'Asset updated failed...',
                        severity: 'error'
                    }))
                }
            })
            .catch((err) => console.error(JSON.stringify(err)))
            .finally(() => setLoading(false))
    }

    const resetAndClose = () => {
        setValue('remarks', '')
        closeDialog()
    }

    return (
        <Box sx={{width: '95vw', maxWidth: '500px'}}>

            <Box component={'form'} sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexFlow: 'column',
                gap: 3,
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
                    '& img': {
                        maxHeight: '80px',
                        mb: 2,
                    },
                }}>

                    <img src={notifyBell} alt={'notify'}/>

                    <Typography variant={'h6'} sx={{
                        width: '100%',
                        fontSize: '1.2rem',
                        mb: 3,
                        textAlign: 'center'
                    }}>
                        Unassign <strong>FR-CHD-{asset?.un_id}</strong> <br/>
                        from <strong>{asset?.assign_emp_name}</strong> ?</Typography>


                    <Controller
                        name={`remarks`}
                        control={control}
                        rules={{required: {value: true, message: 'Required'}}}
                        render={({field}) => (
                            <ThemeTextField
                                {...field} required multiline rows={4}
                                error={Boolean(errors?.remarks)}
                                helperText={(errors?.remarks?.message ?? '').toString()}
                                size={'small'} label={'Remarks'}
                                sx={{flex: 1, minWidth: {xs: '100%', sm: '100%'}}}
                                placeholder={'remarks...'}
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
                    <LoadingButton onClick={resetAndClose} disabled={loading}>Discard & Close</LoadingButton>
                    <LoadingButton onClick={handleSubmit(onSubmit)} variant={'contained'}
                                   loading={loading} sx={{minWidth: {xs: 'min-content', sm: '150px'}}}>
                        Un-assign <ArrowRightRounded/>
                    </LoadingButton>
                </Box>
            </Box>

        </Box>
    )
}


const ImportForm = (props: any) => {

    const {setDialogOpen, title, api, accept, onCompletion} = props

    const theme = useTheme()
    const dispatch = useDispatch()

    const {register, handleSubmit, watch, reset, formState: {errors}} = useForm()

    const [isFunctioning, setIsFunctioning] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [downloadingSample, setDownloadingSample] = useState(false)

    const fileName = watch('importFile')

    const onCloseClick = () => {
        setDialogOpen(false)
        setIsFunctioning(false)
    }

    const downloadSample = () => {
        setIsFunctioning(true)
        const link = document.createElement("a")
        link.href = `/sample-inventories`
        link.setAttribute("download", 'fddfdsf.xlsx')
        document.body.appendChild(link)
        link.click()
        link.parentNode?.removeChild(link)
        setIsFunctioning(false)
    }


    const onUpload = (data: any) => {
        setIsFunctioning(true)
        const newData = {importFile: data.importFile[0]}
        API.post(`/${api}`, newData, {
            onUploadProgress: (progressEvent) => {
                console.log('progress', progressEvent.progress)
                console.log('loaded', progressEvent.loaded)
                console.log('upload', progressEvent.upload)
                console.log('bytes', progressEvent.bytes)
            },
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then((res) => {
                if (res.data?.status == true) {
                    dispatch(updateSnackbarMessage({
                        title: 'Uploaded!',
                        message: 'Uploaded successfully!',
                        severity: 'success'
                    }))
                    setDialogOpen(false)
                    onCompletion()
                    reset()
                } else {
                    dispatch(updateSnackbarMessage({
                        title: 'Upload Failed',
                        message: 'Upload failed...',
                        severity: 'error'
                    }))
                }
            })
            .catch((err) => console.error(JSON.stringify(err)))
            .finally(() => {
                setIsFunctioning(false)
            })
    }


    return (
        <Box component={'form'} sx={{
            width: 'min(calc(95vw - 70px), 420px)',
            minHeight: '200px',
        }}>

            <Typography sx={{
                fontWeight: 600,
                textAlign: 'center',
                color: theme.palette.primary.main,
                mb: 3,
            }}>{title ?? 'Import'}</Typography>

            <Box onDragOver={() => setIsHovered(true)}
                 onMouseLeave={() => setIsHovered(false)}
                 sx={{
                     position: 'relative',
                     outline: `2px dashed ${Boolean(errors?.importFile) ? theme.palette.error.main : theme.palette.primary.main}`,
                     outlineOffset: isHovered ? '3px' : '2px',
                     borderRadius: '12px',
                     height: '120px',
                     overflow: 'hidden',
                     p: '5px',
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                     flexFlow: 'column',
                     transition: 'all 300ms ease-in-out',
                     backgroundColor: isHovered ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.primary.main, 0.12),
                     cursor: 'pointer',
                     '& input': {
                         cursor: 'pointer',
                         zIndex: 0,
                         transition: 'all 300ms ease-in-out',
                         position: 'absolute',
                         inset: 0,
                         color: 'transparent',
                         m: '5px',
                         '&::file-selector-button': {
                             display: 'none'
                         },
                     },
                     '& img': {
                         maxHeight: '90px'
                     },
                     '&:hover': {
                         backgroundColor: alpha(theme.palette.primary.main, 0.2),
                         outlineOffset: '4px',
                     },
                     '& svg': {
                         overflow: 'visible',
                         height: '3rem',
                         width: '3rem',
                         my: 3,
                         '& .folder': {
                             fill: '#83838370'
                         },
                         '& .uploadArrow': {
                             visibility: isFunctioning ? 'visible' : 'hidden',
                             fill: theme.palette.primary.main,
                             animation: isFunctioning ? 'uploading 1000ms linear infinite' : 'none',
                             transformOrigin: 'center'
                         },
                     },
                     ['@keyframes uploading']: {
                         '0%': {
                             opacity: 0,
                             transform: 'none',
                         },
                         '20%': {
                             opacity: 1,
                             transform: 'none',
                         },
                         '90%': {
                             opacity: 0,
                             transform: 'translateY(-12px) scale(0.8)',
                         },
                         '100%': {
                             opacity: 0,
                             transform: 'translateY(0) scale(1)',
                         },
                     }

                 }}>
                <input required accept={accept ?? '*'}
                       {...register(`importFile`, {required: true})}
                       type={'file'}/>
                <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-uqopch" focusable="false"
                     aria-hidden="true" viewBox="0 0 24 24" data-testid="FolderRoundedIcon">
                    <path className={'folder'}
                          d="M10.59 4.59C10.21 4.21 9.7 4 9.17 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-1.41-1.41z"/>
                    <path className={'uploadArrow'}
                          d="M10 16h4c.55 0 1-.45 1-1v-5h1.59c.89 0 1.34-1.08.71-1.71L12.71 3.7a.9959.9959 0 0 0-1.41 0L6.71 8.29c-.63.63-.19 1.71.7 1.71H9v5c0"/>
                </svg>
                <Typography sx={{
                    fontWeight: 700,
                    fontSize: '0.85rem'
                }}>
                    {fileName?.length > 0 ? fileName[0]?.name : 'Select file to import'}
                </Typography>
            </Box>


            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1,
                mt: 4,
                mb: -2,
                '& .MuiButton-root': {
                    borderRadius: '12px',
                    textTransform: 'none',

                },
            }}>
                <Box sx={{
                    flex: 1,
                    '& .MuiButton-root': {
                        fontSize: '12px',
                        '& svg': {
                            height: '16px',
                            width: '16px',
                        },
                    },
                    ['@media(max-width: 350px)']: {
                        minWidth: '90%',
                    },

                }}>
                    {/*<a href={"http://192.168.5.31:8000/api/sample-inventories"} target={'_blank'}>Smaple</a>*/}
                    <LoadingButton
                        loading={isFunctioning}
                        startIcon={<FileDownloadOutlined/>}
                        loadingPosition={'start'}
                        onClick={downloadSample}>
                        Sample File
                    </LoadingButton>
                </Box>
                <Button size={'small'} disabled={isFunctioning} onClick={() => {
                    onCloseClick()
                    reset()
                }}>Close</Button>
                <Button disabled={isFunctioning} size={'small'} sx={{minWidth: '90px'}} variant={'contained'}
                        onClick={handleSubmit(onUpload)}>{isFunctioning ? 'Uploading' : 'Upload'}</Button>
            </Box>
        </Box>
    )
}

