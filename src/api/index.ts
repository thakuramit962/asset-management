import Axios from 'axios'
import {serverRoute} from "../utils/app-helper"


const API = Axios.create({
    baseURL: 'https://demo-assets.easemyorder.com/api',
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
})

export default API