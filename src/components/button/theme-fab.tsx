import React from 'react'
import {Fab, Zoom, useTheme} from '@mui/material'
import {Add, SvgIconComponent} from "@mui/icons-material"


interface ThemeFabProps {
    hoveredWidth?: string
    label?: string
    FabIcon1?: SvgIconComponent
    onClick: () => void
}

export default function ThemeFab(props: ThemeFabProps) {

    const label = props.label ?? 'Add'
    const FabIcon1 = props.FabIcon1 ?? Add
    const hoveredWidth = props.hoveredWidth ?? '120px'
    const onClick = props.onClick

    const theme = useTheme()

    return (
        <Zoom
            key={'d'}
            in={true}
            timeout={{
                enter: theme.transitions.duration.enteringScreen,
                exit: theme.transitions.duration.leavingScreen,
            }}
            style={{transitionDelay: `200ms`,}}
            unmountOnExit>
            <Fab sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                height: '60px',
                width: '60px',
                minWidth: '60px',
                borderRadius: '20px',
                background: theme.palette.primary.main,
                padding: '1rem',
                overflow: 'hidden',
                gap: '1rem',
                transition: 'all 300ms ease-in-out !important',
                justifyContent: 'flex-start',
                '& svg': {
                    fontSize: '1.8rem',
                },
                '&:hover': {
                    width: hoveredWidth,
                    transition: 'all 300ms ease-in-out',
                },
            }} aria-label={label} variant={'extended'} color={"primary"} onClick={onClick}>
                <FabIcon1/> {label}
            </Fab>
        </Zoom>
    )
}
