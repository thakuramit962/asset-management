import React from 'react'
import {alpha, lighten, styled, TextField, Theme, useTheme} from "@mui/material";


export const ThemeTextField = styled(TextField)(({theme}) => ({
    margin: '0 !important',
    width: '100%',
    minHeight: '65px',
    '& label': {
        '&.Mui-focused': {
            ...(theme.palette.mode == 'dark'
                ? {color: lighten(theme.palette.primary.light, 0.4)}
                : {})
        },
        '&.Mui-error': {
            color: theme.palette.error.main,
        },
    },

    '& .MuiFormHelperText-root': {
        marginTop: 0,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },

    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        borderWidth: '1px',
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1px',
            borderColor: `${alpha(theme.palette.primary.main, 1)} !important`,
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#b7c2ce !important',
        },
        '& input': {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: 500,
            '&[type=number]': {
                MozAppearance: 'textfield',
                '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                },
            },
            '&:focus:valid': {
                color: theme.palette.success.main,
            },
            '&:focus:invalid': {
                color: theme.palette.warning.main,
            },
            '&:focus:valid + fieldset': {
                // borderWidth: '1px',
                borderRadius: '12px',
            },
            '&:invalid + fieldset': {
                // borderWidth: '1px',
                borderRadius: '12px',
            },
            '&:-internal-autofill-selected': {
                background: 'transparent !important'
            },
        },
        '& fieldset': {
            borderWidth: '1px',
            borderColor: '#83838350',
            borderRadius: '12px',
            '&:hover': {
                borderWidth: '1px',
                // borderColor: '#83838350',
                borderRadius: '12px',
            }
        },
        '&.Mui-disabled fieldset': {
            background: alpha(theme.palette.text.disabled, 0.1),
        },
        '&.Mui-focused fieldset': {
            background: theme.palette.primary.main + '07',
        },
        '&.Mui-error fieldset': {
            borderWidth: '1px',
            borderRadius: '12px',
            borderColor: `${theme.palette.error.main} !important`,
        },
    },
    '& .MuiOutlinedInput-input.Mui-disabled': {
        WebkitTextFillColor: theme.palette.text.secondary,
    },
    '& .MuiSelect-select': {
        fontSize: theme.typography.pxToRem(14),
        fontWeight: 500,
    },

    '&:has(input[type="file"])': {
        '& .Mui-focused fieldset': {
            background: 'transparent !important',
        },
        "& .MuiOutlinedInput-root *:not(svg)": {
            fontSize: '12px',
            lineHeight: '12px',
            borderWidth: '0 !important',
        },
    },
    '&:has(svg, input[type="file"])': {
        "& .MuiOutlinedInput-root *:not(svg)": {
            borderWidth: '1px !important',
        },
    },
    '& .MuiOutlinedInput-root input::-webkit-file-upload-button': {
        fontSize: '12px',
        borderRadius: '20px',
        background: alpha(theme.palette.primary.main, 1),
        border: `2px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.contrastText,
    }
}))

// const theme = useTheme()

export const textFieldSx = (theme: Theme) => ({
    margin: '0 !important',
    width: '100%',
    minHeight: '65px',
    '& label': {
        '&.Mui-focused': {
            ...(theme.palette.mode == 'dark'
                ? {color: lighten(theme.palette.primary.light, 0.4)}
                : {})
        },
        '&.Mui-error': {
            color: theme.palette.error.main,
        },
    },
    '& .MuiFormHelperText-root': {
        marginTop: 0,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        borderWidth: '1px',
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1px',
            borderColor: `${alpha(theme.palette.primary.main, 1)} !important`,
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#b7c2ce !important',
        },
        '& input': {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: 500,
            '&[type=number]': {
                MozAppearance: 'textfield',
                '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                },
            },
            '&:focus:valid': {
                color: theme.palette.success.main,
            },
            '&:focus:invalid': {
                color: theme.palette.warning.main,
            },
            '&:focus:valid + fieldset': {
                // borderWidth: '1px',
                borderRadius: '12px',
            },
            '&:invalid + fieldset': {
                // borderWidth: '1px',
                borderRadius: '12px',
            },
            '&:-internal-autofill-selected': {
                background: 'transparent !important'
            },
        },
        '& fieldset': {
            borderWidth: '1px',
            borderColor: '#83838350',
            borderRadius: '12px',
            '&:hover': {
                borderWidth: '1px',
                // borderColor: '#83838350',
                borderRadius: '12px',
            }
        },
        '&.Mui-disabled fieldset': {
            background: alpha(theme.palette.text.disabled, 0.1),
        },
        '&.Mui-focused fieldset': {
            background: theme.palette.primary.main + '07',
        },
        '&.Mui-error fieldset': {
            borderWidth: '1px',
            borderRadius: '12px',
            borderColor: `${theme.palette.error.main} !important`,
        },
    },
    '& .MuiOutlinedInput-input.Mui-disabled': {
        WebkitTextFillColor: theme.palette.text.secondary,
    },
    '& .MuiSelect-select': {
        fontSize: theme.typography.pxToRem(14),
        fontWeight: 500,
    },
})