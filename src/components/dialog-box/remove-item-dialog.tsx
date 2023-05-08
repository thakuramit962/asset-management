import React, {useState} from 'react'
import {alpha, Box, Button, Typography, useTheme} from "@mui/material";
import {useDispatch} from "react-redux";
import {updateSnackbarMessage} from "../../slices/snackbar-message-slice";
import {camelCaseWords, getFirstErrorMessage} from "../../utils/app-helper";
import notifyBell from "../../assets/images/notify.png";
import {LoadingButton} from "@mui/lab";
import axios from "axios";


interface RemoveItemDialogProps {
    apiName: string
    itemName?: string
    removeText?: string
    closeDialog: () => void
    onCompletion:() => void
    id: string | number | undefined
}

export default function RemoveItemDialog(props: RemoveItemDialogProps) {

    const nullFunction = () => {
    }

    const apiName = props.apiName ?? ''
    const itemName = props.itemName ?? 'Item'
    const removeText = props.removeText ?? 'Remove'
    const closeDialog = props.closeDialog
    const onCompletion = props.onCompletion ?? nullFunction
    const id = props.id

    const theme = useTheme()
    const dispatch = useDispatch()

    const [loading, setLoading] = useState<boolean>(false)

    const removeRegionalClient = () => {
        setLoading(true)
        setTimeout(()=>setLoading(false))
        axios.post(`/api/${apiName}/${id}`, {status: 0})
            .then((res) => {
                if (res.data?.status == true) {
                    console.log(JSON.stringify(res))
                    onCompletion()
                    closeDialog()
                    dispatch(updateSnackbarMessage({
                        title: `${itemName} removed successfully`,
                        message: 'Success',
                        severity: 'success'
                    }))
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
                setLoading(false)
                console.error(JSON.stringify(err))
            })
            .finally(() => setLoading(false))
    }


    return (
        <>
            <Box sx={{
                display: 'flex',
                flexFlow: 'column',
                alignItems: 'center',
                columnGap: 2,
                mb: -2,
                width: {xs: '100%', sm: '350px'},

            }}>
                <Box sx={{
                    flex: 1,
                    mt: 2, mb: 2,
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    background: alpha(theme.palette.background.default, 0.1),
                    '& img': {
                        maxHeight: '80px',
                        mb: 2,
                    },
                }}>
                    <img src={notifyBell} alt={'notify'}/>
                    <Typography sx={{fontWeight: 700, fontSize: '1.2rem', color: theme.palette.warning.dark}}>Remove
                        {itemName ? camelCaseWords(itemName) : 'Item'}?</Typography>
                    <Typography sx={{
                        fontWeight: 600,
                        fontSize: '0.825rem',
                        maxWidth: '240px',
                        textAlign: 'center',
                        color: theme.palette.text.secondary
                    }}>
                        Are you sure to remove {itemName ? itemName : 'Item'}
                        <strong>#{id ? id : ''}</strong> permanently?
                    </Typography>

                </Box>

                <Box sx={{
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    gap: 2,
                    width: '100%',
                    '& .MuiButton-root': {
                        borderRadius: '50vh',
                        minWidth: '110px',
                    },
                }}>
                    <LoadingButton
                        size={'small'}
                        variant={'outlined'}
                        color={'error'}
                        endIcon={<></>}
                        loadingPosition={'end'}
                        loading={loading}
                        onClick={removeRegionalClient}>
                        {removeText}
                    </LoadingButton>
                    <Button size={'small'} onClick={closeDialog}>Cancel</Button>
                </Box>

            </Box>
        </>
    )
}