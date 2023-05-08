import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {PaletteMode} from "@mui/material";


interface ColorMode {
    mode: PaletteMode
}

const initialState: ColorMode = {mode: 'light'}

export const colorModeSlice = createSlice({
    name: 'colorMode',
    initialState,
    reducers: {
        updateColorMode: (state, action: PayloadAction<PaletteMode>) => {
            state.mode = action.payload
        },
    },
})

export const {updateColorMode} = colorModeSlice.actions

export default colorModeSlice.reducer