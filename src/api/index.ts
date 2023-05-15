import Axios from 'axios';


const API = Axios.create({
    baseURL: 'https://demo-assets.easemyorder.com/api',
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
})

export default API