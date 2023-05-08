import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {User} from "../models/user"

export interface AuthInterface {
    isLoggedIn?: boolean
    accessToken?: string
    currentUser?: User
}

const initialState: AuthInterface = {
    isLoggedIn: false,
    accessToken: '',
    currentUser: {} as User
}

export const authSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        updateAuth: (state, action: PayloadAction<AuthInterface>) => {
            state.isLoggedIn = action.payload?.isLoggedIn
            state.accessToken = action.payload?.accessToken
            state.currentUser = action.payload?.currentUser
        },
    },
})

export const {updateAuth} = authSlice.actions

export default authSlice.reducer