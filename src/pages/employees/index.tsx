import React, {useCallback, useEffect, useState} from 'react'
import PageContainer from "../../components/containers/page-container"
import {updatePageTitle} from "../../slices/page-title-slice"
import {useDispatch} from "react-redux"
import {
    alpha,
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
import {getFirstErrorMessage, serverRoute} from "../../utils/app-helper";
import ThemeDialog from "../../components/dialog-box/theme-dialog";
import {LoadingButton, Pagination} from "@mui/lab";
import RemoveItemDialog from "../../components/dialog-box/remove-item-dialog";
import {Controller, useForm} from "react-hook-form";
import {
    ArrowRightRounded,
    DeleteOutlined,
    DownloadRounded,
    EditOutlined,
    FileDownloadOutlined, FileUploadOutlined,
    Search, Sync,
} from "@mui/icons-material";
import {LoadingItem} from "../../components/loading-view";
import {ThemeTableContainer} from "../../components/theme-table-container";
import {User} from "../../models/user";
import usePagination from "../../hooks/use-pagination";
import {ThemeTextField} from "../../components/inputs/theme-text-field";
import ThemePasswordInput from "../../components/inputs/theme-password-input";

import searchIcon from '../../assets/icons/search-icon.svg'
import API from "../../api";


export default function Employees() {

    const theme = useTheme()
    const dispatch = useDispatch()

    const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false)
    const [exporting, setExporting] = useState<boolean>(false)

    const closeImportDialog = () => setImportDialogOpen(false)

    const exportEmployees = () => {
        setExporting(true)
        setTimeout(() => setExporting(false), 1000)
    }


    useEffect(() => {
        dispatch(updatePageTitle('Users'))
    }, [])

    return (
        <>
            <PageContainer>
                <>
                    <Stack direction={'row'} sx={{
                        flex: 1,
                        gap: 2,
                        justifyContent: 'flex-end',
                        '& .MuiButton-root': {
                            textTransform: 'none',
                            flex: {xs: 1, sm: 'auto'},
                            maxWidth: {xs: 'auto', sm: '110px'}
                        },
                    }}>
                        <LoadingButton
                            loading={exporting}
                            variant={'contained'}
                            startIcon={<FileDownloadOutlined/>}
                            loadingPosition={'start'}
                            onClick={exportEmployees}>
                            Export
                        </LoadingButton>

                        <Button variant={'contained'} onClick={() => {
                            setImportDialogOpen(true)
                        }} sx={{
                            '& svg': {
                                fontSize: '20px',
                                marginRight: '6px',
                            },
                        }}>
                            <FileUploadOutlined/> Import
                        </Button>

                    </Stack>

                </>
            </PageContainer>

            {importDialogOpen &&
            <ThemeDialog open={importDialogOpen} dialogBody={
                <ImportEmployees closeDialog={closeImportDialog}
                                 title={'Upload Employees'}
                                 onCompletion={closeImportDialog}
                                 accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                 api={`employee/bulk-import`}
                />
            }/>
            }
        </>
    )
}


const ImportEmployees = (props: any) => {

    const {closeDialog, title, api, accept, onCompletion} = props

    const theme = useTheme()
    const dispatch = useDispatch()

    const {register, handleSubmit, watch, reset, formState: {errors}} = useForm()

    const [isFunctioning, setIsFunctioning] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [downloadingSample, setDownloadingSample] = useState(false)

    const fileName = watch('importFile')

    const onCloseClick = () => {
        closeDialog()
        setIsFunctioning(false)
    }

    const downloadSample = () => {
        setIsFunctioning(true)
        const link = document.createElement("a")
        link.href = `${serverRoute}/inventory/sample-inventories`
        link.setAttribute("download", 'fddfdsf.xlsx')
        document.body.appendChild(link)
        link.click()
        link.parentNode?.removeChild(link)
        setIsFunctioning(false)
    }


    const onUpload = (data: any) => {
        setIsFunctioning(true)
        const newData = {employeeFile: data.importFile[0]}
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
                    closeDialog()
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
