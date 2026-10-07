import { Request, Response } from "express"
import RefreshToken from "../models/RefreshToken"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        ) as {
            userId: string,
            username: string
        }

        const refreshTokens = await RefreshToken.find({user: decoded.userId })
            .sort({ createdAt: -1, _id: -1 })

        for(const token of refreshTokens){  
            const isMatch = await bcrypt.compare(refreshToken, token.tokenHash)

            if(isMatch){
                await RefreshToken.deleteOne({_id : token._id})

                break
            }                
        }  

        res.clearCookie("refreshToken",{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"?"none": "strict"
        })

        return res.status(204).send()

    } catch(error){
        console.error("Error loging out:", error)

        return res.status(500).json({
            message: "Failed to logout"
        })
    }
}

export default logout