import React from 'react'
import ThemeInput from "../inputs/theme-input";
import {MenuItem, SelectChangeEvent, Stack} from "@mui/material";

export default function GlobalSearch(props: any) {

    const {sxProps} = props

    const onChangeInput = (e: SelectChangeEvent) => {
        console.log('global searching...', e.target.value)
    }

    return (
        <ThemeInput
            onChange={onChangeInput}
            select defaultValue="1"
            sxProps={{
                minHeight: 'max-content',
                ...sxProps
            }}>
            <MenuItem value={'1'}>03AAGCE4639L1ZI (ETERNITY FORWARDERS)</MenuItem>
            <MenuItem value={'2'}>Option 2</MenuItem>
            <MenuItem value={'3'}>Option 3</MenuItem>
        </ThemeInput>
    )
}