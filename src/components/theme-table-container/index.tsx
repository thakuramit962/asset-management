import {alpha, lighten, styled, TableContainer, useMediaQuery} from "@mui/material"


export const ThemeTableContainer = styled(TableContainer)(({theme}) => ({
    minHeight: '300px',
    width: '-webkit-fill-available',
    // width: 'calc(100% - 2rem)',
    overflowY: 'clip',
    borderRadius: '12px',
    boxShadow: '0 0 12px #83838360',
    margin: '1rem',
    '& .MuiTable-root': {
        minWidth: 'max-content !important',
        '& .MuiTableCell-root': {
            backgroundColor: theme.palette.background.paper,
        },
        '& .MuiTableRow-root': {
            '&:last-child td, &:last-child th': {
                border: 0,
            },
        },
        '& .MuiTableHead-root': {
            '& .MuiTableRow-root': {
                backgroundColor: theme.palette.primary.main,
                '& *': {
                    color: theme.palette.primary.contrastText,
                },
                '& .MuiTableCell-root': {
                    backgroundColor: theme.palette.primary.main,
                },
            },
        },
        '& .stickyRight, & .stickyLeft': {
            position: 'sticky',
            '&:after': {
                position: 'absolute',
                top: 0,
                bottom: '-1px',
                left: 0,
                width: '30px',
                transform: 'translateX(-100%)',
                transition: 'box-shadow 0.3s',
                content: '""',
                pointerEvents: 'none',
            },
        },
        '& .stickyRight': {
            right: 0,
            textAlign: 'center !important',
            '&:after': {
                left: 0,
                transform: 'translateX(-100%)',
                boxShadow: 'inset -10px 0 8px -8px rgb(5 5 5 / 20%)'
            },
        },
        '& .stickyLeft': {
            left: 0,
            '&:after': {
                left: 'calc(100% + 30px)',
                transform: 'translateX(-100% )',
                boxShadow: 'inset 10px 0 8px -8px rgb(5 5 5 / 20%)'
            },
        },
        '& .MuiIconButton-root': {
            height: '1.5rem',
            width: '2rem',
            color: theme.palette.primary.main,
            transition: 'all 300ms ease-in-out',
            borderRadius: '50vh',
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
            },
            '&.Mui-disabled':{
                color: theme.palette.text.disabled,
            },
        },
        ['@media (max-width:600px)']: {
            '& .stickyRight': {
                position: 'relative',
                '&:after': {
                    display: 'none',
                },
            },
            '& .stickyLeft': {
                position: 'relative',
                '&:after': {
                    display: 'none',
                },
            },
        },
    },
}))