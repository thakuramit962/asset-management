import React from 'react'
import {Backdrop, Box, SxProps, Typography, useTheme} from "@mui/material"


interface LoadingViewProps {
    sx?: SxProps
    size?: 'small' | 'large'
    text?: string
    dots?: number
}

export default function LoadingView(props: LoadingViewProps) {

    const {size, text, dots} = props

    return (
        <Backdrop
            open
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                textAlign: 'center',
                flexFlow: 'column',
            }}>
            <LoadingItem size={size} text={text} dots={dots}/>
        </Backdrop>
    )
}

export const LoadingItem = (props: any) => {

    const theme = useTheme()
    const {size, text, dots} = props
    const isSmall = (size == 'small')
    const dotCount = dots ?? 5

    return (
        <>
            <Box sx={{
                userSelect: 'none',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: isSmall ? '3px' : '8px',
                animation: 'gap 1s ease-in-out 0.4s infinite',
                '& span': {flex: 1,},
                ['@keyframes gap']: {
                    '0%': {gap: isSmall ? '4px' : '6px',},
                    '50%': {gap: isSmall ? '4px' : '8px',},
                    '100%': {gap: isSmall ? '4px' : '6px',},
                },
            }}>
                {Array.from(Array(dotCount)).map((_, index) =>
                    <Box key={index} className={'loader-dot'}
                         sx={{
                             width: isSmall ? '7px' : '0.8rem',
                             height: isSmall ? '7px' : '0.8rem',
                             background: theme.palette.primary.main ?? '#0075ff',
                             borderRadius: '50vh',
                             animation: `${isSmall ? 'scale-small' : 'scale-2'} 1s ease-in-out 0.${index}s infinite`,
                             ['@keyframes scale-2']: {
                                 '0%': {
                                     transform: 'translateY(0) scale(0.7)',
                                     opacity: 0.2,
                                     background: theme.palette.primary.main
                                 },
                                 '50%': {
                                     transform: 'translateY(-8px)  scale(1)',
                                     opacity: 1,
                                     background: theme.palette.secondary.main ?? '#f16334'
                                 },
                                 '100%': {
                                     transform: 'translateY(0)  scale(0.7)',
                                     opacity: 0.2,
                                     background: theme.palette.primary.main
                                 },
                             },
                             ['@keyframes scale-small']: {
                                 '0%': {
                                     transform: 'translateY(0) scale(0.85)',
                                     opacity: 0.2,
                                     background: theme.palette.primary.main
                                 },
                                 '50%': {
                                     transform: 'translateY(-2px)  scale(1)',
                                     opacity: 1,
                                     background: theme.palette.secondary.main ?? '#f16334'
                                 },
                                 '100%': {
                                     transform: 'translateY(0)  scale(0.85)',
                                     opacity: 0.2,
                                     background: theme.palette.primary.main
                                 },
                             },
                         }}/>
                )}
            </Box>
            {text && <Typography mt={2} variant={'caption'} color={theme.palette.text.primary}>{text}</Typography>}
        </>
    )
}