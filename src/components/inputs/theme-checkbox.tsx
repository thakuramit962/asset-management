import React from 'react'
import {alpha, Checkbox, CheckboxProps, FormControlLabel, useTheme} from "@mui/material"
import {RadioButtonUncheckedRounded, TaskAltRounded} from "@mui/icons-material"


interface ThemeCheckboxProps {
    label?: string
    checkboxProps?: CheckboxProps
    field?: any
    isSmall?: boolean
}

export default function ThemeCheckbox(props: ThemeCheckboxProps) {

    const {field, label, checkboxProps, isSmall} = props

    const theme = useTheme()

    return (
        <FormControlLabel
            label={label}
            control={<Checkbox
                size={'small'}
                icon={<RadioButtonUncheckedRounded/>}
                checkedIcon={<TaskAltRounded/>}
                {...field}
                {...checkboxProps}
            />}
            sx={{
                boxShadow: `0 0 12px ${alpha(theme.palette.error.light, 0.3)} inset`,
                borderRadius: isSmall ? '8px' : '12px',
                pr: 1,
                userSelect: 'none',
                '& .MuiCheckbox-root': {
                    p: isSmall ? '3px' : '9px'
                },
                '& .MuiTypography-root': {
                    fontSize: isSmall ? '12px' : '14px',
                    color: theme.palette.error.dark,
                },
                '& svg': {
                    color: theme.palette.error.dark,
                    height: isSmall ? '1rem' : '1em',
                    width: isSmall ? '1rem' : '1em',
                },
                '&:hover': {
                    outline: `2px solid ${alpha(theme.palette.error.light, 0.4)}`,
                    outlineOffset: isSmall ? '-2px' : '-4px',
                },
                '&:has(.Mui-checked)': {
                    boxShadow: `0 0 12px ${alpha(theme.palette.success.light, 0.3)} inset`,
                    '&:hover': {
                        outline: `2px solid ${alpha(theme.palette.success.light, 0.4)}`,
                    },
                    '& svg': {
                        color: theme.palette.success.dark,
                    },
                    '& .MuiTypography-root': {
                        color: theme.palette.success.dark,
                    },
                },
                '&:has(input:disabled)': {
                    boxShadow: `0 0 12px ${alpha(theme.palette.text.disabled, 0.3)} inset`,
                    '& *': {
                        color: theme.palette.text.disabled,
                    },
                    '&:hover': {
                        outline: `2px solid ${alpha(theme.palette.text.disabled, 0.4)}`,
                        cursor: 'not-allowed'
                    }
                }
            }}/>
    )
}