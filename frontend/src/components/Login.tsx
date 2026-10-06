import { useState } from "react"
import api, { setApiAccessToken } from "../lib/api"
import toast from "react-hot-toast"

interface LoginProps {
    onLogin: (token: string) => void
    onSwitchToRegister: () => void
}

function Login({
    onLogin,
    onSwitchToRegister
} : LoginProps) { 

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async () => {
        try{
            const response = await api.post("/login", {
                username,
                password
            })
            
            console.log("Access token:", response.data.accessToken)

            onLogin(response.data.accessToken)
            setApiAccessToken(response.data.accessToken)
            console.log("Login res:", response.data)
        } catch(error){
            toast.error("Error logging in")
            console.error("Error logging in:", error)
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Welcome back</h2>
                <p>Log in to your study notes</p>
                
                <input 
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => {setUsername(e.target.value)}}
                />

                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                />

                <button onClick={handleLogin}>
                Login
                </button>
                <button
                    className="switch-auth-button"
                    onClick={onSwitchToRegister}
                >
                    Don't have an account? Register
                </button>
            </div>
        </div>
    )
}

export default Login