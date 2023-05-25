import {lighten, styled, TableContainer} from "@mui/material"


export const ThemeTableContainer = styled(TableContainer)(({theme}) => ({
    minHeight: '290px',
    width: '-webkit-fill-available',
    overflowY: 'clip',
    margin: '0.5rem 1rem',
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
                backgroundColor: theme.palette.mode == 'dark'
                    ? lighten(theme.palette.text.secondary, 0.9)
                    : lighten(theme.palette.text.secondary, 0.9),
                // backgroundColor: theme.palette.primary.main,
                '& *': {
                    fontWeight: 600,
                    // color: theme.palette.primary.contrastText,
                },
                '& .MuiTableCell-root': {
                    borderBottom: '1px solid',
                    backgroundColor: theme.palette.mode == 'dark'
                        ? '#3f3f3f'
                        : '#ededed',
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
            '&:has(svg[data-testid="DeleteOutlinedIcon"]):not(:disabled)': {
                color: theme.palette.error.dark
            },
            '&:not(:last-of-type)': {
                // marginRight: '8px',
            },
            '&.Mui-disabled': {
                color: theme.palette.text.disabled,
            },
        },
    },
    ['@media (max-width:600px)']: {
        margin: '0.5rem 0',
        '& .MuiTable-root': {
            '& .stickyRight': {
                position: 'relative',
                '&:after': {
                    display: 'none',
                },
            },
            // '& .stickyLeft': {
            //     position: 'relative',
            //     '&:after': {
            //         display: 'none',
            //     },
            // },
        },
    },


}))