import React, {useState} from 'react'
import {IconButton, InputAdornment} from "@mui/material"
import {Visibility, VisibilityOff} from "@mui/icons-material"
import {ThemeTextField} from "./theme-text-field"


export default function ThemePasswordInput(props: any) {

    const [showPassword, setShowPassword] = useState<boolean>(false)
    const togglePassword = () => setShowPassword((prevState => !prevState))

    const {fieldProps, ...restProps} = props

    return (
        <ThemeTextField
            size={'small'}
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            placeholder={'*******'}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePassword}
                            onMouseDown={togglePassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                        </IconButton>
                    </InputAdornment>
                )
            }}
            {...fieldProps}
            {...restProps}
        />
    )
}