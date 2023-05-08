import React, {useMemo} from 'react'
import {Routes, Route} from 'react-router-dom'
import ProtectedRouteAuthCheck from "./protected-route-auth-check";
import Layout from "../layout";
import Dashboard from "../pages/dashboard";
import Login from "../auth/login";
import {useSelector} from "react-redux";
import {RootState} from "../store/store";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Users from "../pages/users";
import CreateUser from "../pages/users/create-user";
import AssetCategories from "../pages/asset-categories";
import Brands from "../pages/brands";
import Inventories from "../pages/inventories";
import CreateInventory from "../pages/inventories/create-inventory";
import TestPages from "../pages/test-pages";
import SingleAsset from "../pages/inventories/single-asset";

export default function WebRoutes() {

    const initialMode = useSelector((state: RootState) => state.colorMode.mode)

    const theme = useMemo(() =>
            createTheme({
                palette: {
                    primary: {
                        main: '#182a88',
                    },
                    secondary: {
                        main: '#a68529',
                    },
                    mode: initialMode,
                },
                typography: {
                    h1: {fontFamily: "Montserrat, sans-serif"},
                    h2: {fontFamily: "Montserrat, sans-serif"},
                    h3: {fontFamily: "Montserrat, sans-serif"},
                    h4: {fontFamily: "Montserrat, sans-serif"},
                    h5: {fontFamily: "Montserrat, sans-serif"},
                    h6: {fontFamily: "Montserrat, sans-serif"},
                    button: {
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 500,
                    },
                    fontFamily: "Montserrat, sans-serif",
                    // fontFamily: "Roboto, sans-serif"
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: '12px'
                            }
                        }
                    },
                    MuiMenu: {
                        styleOverrides: {
                            paper: {
                                borderRadius: '16px !important'
                            },
                        },
                    },
                },
            }),
        [initialMode],
    )

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Routes>
                <Route path="login" element={<Login/>}/>
                <Route path="*" element={<h1>No Page Found</h1>} />
                <Route element={<ProtectedRouteAuthCheck/>}>
                    <Route path="/" element={<Layout/>}>
                        <Route path="" element={<Dashboard/>}/>
                        <Route path="inventories" element={<Inventories/>}/>
                        <Route path="inventories/:inventoryId" element={<SingleAsset/>}/>
                        <Route path="create-inventory" element={<CreateInventory/>}/>
                        <Route path="categories" element={<AssetCategories/>}/>
                        <Route path="brands" element={<Brands/>}/>
                        <Route path="configurations" element={<h1>configurations</h1>}/>
                        <Route path="demo" element={<TestPages/>}/>
                        <Route path="users" element={<Users/>}/>
                        <Route path="create-user" element={<CreateUser/>}/>
                    </Route>
                </Route>
            </Routes>
        </ThemeProvider>
    )
}