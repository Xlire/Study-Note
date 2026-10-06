import axios from "axios";

let apiAccessToken : string | null = null

let onAuthExpired : (() => void) | null = null

export function setApiAccessToken(token: string | null) {
    apiAccessToken = token
}

export function setAuthExpiredHandler(handler: (() => void) | null) {
    onAuthExpired = handler
}

export async function refreshAccessToken(){
    const response = await refreshApi.post("/refresh")

    setApiAccessToken(response.data)

    return response.data
}
const api = axios.create({
    baseURL : import.meta.env.VITE_API_URL,
    withCredentials: true
})

const refreshApi = axios.create({
    baseURL:  import.meta.env.VITE_API_URL,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    if(apiAccessToken) {
        config.headers.Authorization = `Bearer ${apiAccessToken}`
    }

    return config
})

api.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config

        if (
            error.status === 401 &&
            !error.config._retry
        ) {

            originalRequest._retry = true
            try {
                const token = await refreshAccessToken()

                // console.log("New access token:", token)
                // console.log("About to retry:", originalRequest)
                return api(originalRequest)
            } catch (refreshError) {
                console.error("Refresh failed:", refreshError)
                setApiAccessToken(null)
                onAuthExpired?.()
            }   
        }

        return Promise.reject(error)
    }
)

export default api