import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import RefreshToken from "../models/RefreshToken";
import refresh from "./refreshController";

export const login = async (req: Request, res: Response) => {
    try{
        const {username, password} = req.body

        if(!username || !password)  {
            return res.status(400).json({
                message: "Username and password are required"
            })
        }

        if (typeof username !== "string" || typeof password !== "string") {
            return res.status(400).json({
                message: "Username and password must be strings"
            })
        }

        if (username.length > 30 || password.length > 100) {
            return res.status(400).json({
                message: "Invalid username or password"
            })
        }

        const user = await User.findOne({username})

        if(!user){
            return res.status(401).json({
                message : "Invalid username or password"
            })
        }

        const matchPassword = await bcrypt.compare(password, user.password!)
        
        if(!matchPassword){
            return res.status(401).json({
                message: "Invalid username or password"
            })
        }

        const accessToken = jwt.sign({
            userId: user._id.toString() ,
            username : user.username
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: "15m"
        }
        )
        
        const refreshToken = jwt.sign({
            userId: user._id.toString(),
            username: user.username,
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: "7d"
        }
        )

        const refreshTokenHashed = await bcrypt.hash(refreshToken, 10)
        
        const savedRefreshToken = await RefreshToken.create({
            user: user._id,
            tokenHash: refreshTokenHashed,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7*24*60*60*1000
        })

        res.status(200).json({
            message : "User logged in successfully",
            accessToken
        })
    } catch(error){
        console.error("Error registering user:", error)
        return res.status(500).json({
            message : "Failed to login"
        })
    }
}

export default login