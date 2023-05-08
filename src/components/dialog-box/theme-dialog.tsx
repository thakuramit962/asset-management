import React, {ReactNode} from 'react'
import {Dialog, DialogActions, DialogContent, DialogTitle, Slide} from '@mui/material'
import {TransitionProps} from "@mui/material/transitions"


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>) {
    return <Slide direction="up" ref={ref} {...props} />
})

interface ThemeDialogProps {
    title?: string,
    open: boolean,
    onClickClose?: () => void,
    dialogBody: ReactNode,
    dialogAction?: ReactNode,
}

export default function ThemeDialog(props: ThemeDialogProps) {

    const {title, open = false, onClickClose, dialogBody, dialogAction} = props

    return (
        <Dialog open={open} TransitionComponent={Transition}
                keepMounted onClose={onClickClose} aria-describedby={title}
                sx={{
                    '& .MuiPaper-root': {
                        maxWidth: '95%',
                        borderRadius: '20px',
                        m: 1,
                        '& .MuiDialogActions-root': {
                            '& .MuiButton-root': {
                                borderRadius: '50vh',
                                fontSize: '14px',
                                minWidth: '100px',
                                textTransform: 'capitalize',
                                letterSpacing: '1px',
                                boxShadow: 0
                            },
                        },

                    },
                }}>
            <DialogContent>{dialogBody}</DialogContent>
            <DialogActions>{dialogAction}</DialogActions>
        </Dialog>
    )
}