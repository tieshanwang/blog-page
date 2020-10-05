import axios from 'axios'
import router from './router'

axios.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `JWT ${token}`
        }
        return config
    },
    error => Promise.reject(error)
)

axios.interceptors.response.use(
    response => response.data,
    error => {
        if (error.response.status === 401) {
            router.replace({
                path: '/login',
                query: {
                    redirect: router.currentRoute.fullPath
                }
            })
        } else {
            return Promise.reject(error)
        }
    }
)

export default axios
