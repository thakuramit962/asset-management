import React from "react"
import {Outlet, Navigate, useLocation} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {RootState} from "../store/store"
import {updateAuth} from "../slices/auth-slice"
import {User} from "../models/user"
import API from "../api"


export default function ProtectedRouteAuthCheck() {
    const dispatch = useDispatch()

    const location = useLocation()
    const accessToken = useSelector((state: RootState) => state.userAuth.accessToken)

    API.defaults.headers.common['Content-Type'] = `application/json`
    API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    API.defaults.headers.common['crossorigin'] = `anonymous`

    API.interceptors.response.use(function (response) {
        if (response.data.statuscode == 401) {
            dispatch(updateAuth({isLoggedIn: false, accessToken: '', currentUser: {} as User}))
        }
        return response
    }, function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error)
    })

    return (
        accessToken
            ? <Outlet/>
            : <Navigate to={'/login'} state={{fromLocation: location}} replace/>
    )
}
