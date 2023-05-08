import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'

export interface CounterState {
    title: string
}

const initialState: CounterState = {title: 'Asset Management',}

export const pageTitleSlice = createSlice({
    name: 'pageTitle',
    initialState,
    reducers: {
        updatePageTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload
        },
    },
})

export const {updatePageTitle} = pageTitleSlice.actions

export default pageTitleSlice.reducer