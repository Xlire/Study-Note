import { useState } from "react"
import api from "../lib/api"
import toast from "react-hot-toast"

interface RegisterProps {
    onSwitchToLogin: () => void
}

function Register({ onSwitchToLogin }: RegisterProps) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleRegister = async () => {
        if (!username.trim() || !password || !confirmPassword) {
            toast.error("Please fill in all fields")
            return
        }
        
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        try {
            await api.post("/register", {
                username: username.trim(),
                password
            })

            toast.success("Account created successfully")
            onSwitchToLogin()
        } catch (error: any) {
            console.error("Error registering:", error)

            const message = error.response?.data?.message || "Failed to create account"
            toast.error(message)
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Create account</h2>

                <p>
                    Create an account to start using Study-Note.
                </p>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button onClick={handleRegister}>
                    Register
                </button>

                <button
                    className="switch-auth-button"
                    onClick={onSwitchToLogin}
                >
                    Already have an account? Log in
                </button>
            </div>
        </div>
    )
}

export default Register