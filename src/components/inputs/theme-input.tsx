import React from 'react'
import {alpha, lighten, TextField, useTheme} from "@mui/material";


export default function ThemeInput(props: any) {

    const theme = useTheme()

    const {br = '12px', bw = '1px', fieldProps, sxProps, ...restProps} = props

    return (
        <TextField
            size={'small'}
            variant="outlined"
            sx={{
                width: '100%',
                minHeight: '65px',
                '& label.Mui-focused': {
                    ...(theme.palette.mode == 'dark'
                        ? {color: lighten(theme.palette.primary.light, 0.4)}
                        : {})
                },
                '& label.Mui-error': {
                    color: theme.palette.error.main,
                },
                '& .MuiFormHelperText-root': {
                    marginTop: 0,
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                },
                '& .MuiOutlinedInput-root': {
                    borderRadius: br,
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderWidth: bw,
                        borderColor: `${alpha(theme.palette.primary.main, 1)} !important`,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#b7c2ce !important',
                    },
                    '& input': {
                        // fontSize: '14px',
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
                            borderWidth: bw,
                            borderRadius: br,
                        },
                        '&:invalid + fieldset': {
                            borderWidth: bw,
                            borderRadius: br,
                        },
                        '&:-internal-autofill-selected': {
                            WebkitBoxShadow: `0 0 0 30px ${theme.palette.background.default} inset !important`,
                            background: 'transparent !important'
                        },
                    },
                    '& fieldset': {
                        borderWidth: bw,
                        borderColor: '#83838350',
                        borderRadius: br,
                        '&:hover': {
                            borderWidth: bw,
                            borderColor: '#83838350',
                            borderRadius: br,
                        }
                    },
                    '&.Mui-focused fieldset': {
                        background: theme.palette.primary.main + '07',
                    },
                    '&.Mui-error fieldset': {
                        borderWidth: bw,
                        borderRadius: br,
                        borderColor: `${theme.palette.error.main} !important`,
                    },
                },
                '& .MuiOutlinedInput-input.Mui-disabled': {
                    WebkitTextFillColor: theme.palette.text.secondary,
                },
                '& .MuiSelect-select':{
                    fontSize: '14px',
                    pt: '10px',
                    '& .MuiMenuItem-root':{
                        fontSize: '14px',

                    },
                },
                ...sxProps
            }}
            {...fieldProps}
            {...restProps}
        />
    )
}