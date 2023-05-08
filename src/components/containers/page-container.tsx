import React, {ReactNode} from 'react'
import {Paper, useTheme} from "@mui/material"
import demoBg from '../../assets/images/demo-bg.svg'


interface PageContainerProps {
    children: ReactNode
}

export default function PageContainer(props: PageContainerProps) {

    const {children} = props
    const theme = useTheme()

    return (
        <Paper sx={{
            flex: 1,
            boxShadow: 0,
            borderRadius: '12px',
            py: 2,
            // background: `url(${demoBg})`,
            // backgroundPosition: 'bottom',
            // backgroundSize: 'cover',
            // backgroundRepeat: 'no-repeat',
            maxWidth: '100vw',
            // maxHeight: 'calc(100vh - 96px)',
            // overflowY: 'auto',
            '& .pageHeading': {
                fontSize: 'clamp(0.9rem, 7vw, 1rem)',
                lineHeight: 'clamp(0.9rem, 7vw, 1.1rem)',
                width: 'max-content',
                position: 'relative',
                color: theme.palette.text.secondary,
                '&:after': {
                    content: '""',
                    background: theme.palette.text.primary,
                    height: '2px',
                    width: 'calc(100% + 1rem)',
                    display: 'flex',
                    position: 'absolute',
                    bottom: 0,
                },
            },
        }}>
            {children}
        </Paper>
    )
}