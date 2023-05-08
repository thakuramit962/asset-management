import React from "react";
import {Outlet, Navigate, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../store/store";
import axios from "axios";


export default function ProtectedRouteAuthCheck() {

    const location = useLocation()
    const accessToken = useSelector((state: RootState) => state.userAuth.accessToken)

    axios.defaults.headers.common['Content-Type'] = `application/json`
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    axios.defaults.headers.common['crossorigin'] = `anonymous`

    return (
        accessToken
            ? <Outlet/>
            // : <Navigate to={'/login'} replace={true}/>
            : <Navigate to={'/login'} state={{fromLocation: location}} replace/>
    )
}
