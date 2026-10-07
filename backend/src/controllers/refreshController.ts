import { Request, Response } from "express"
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken"
import RefreshToken from "../models/RefreshToken"
import bcrypt from "bcrypt"

interface RefreshTokenPayload extends jwt.JwtPayload {
    userId: string
    username: string
}

export const refresh = async (req: Request, res: Response) => {
    try{
        const refreshToken = req.cookies.refreshToken

        if(! refreshToken){
            return res.status(401).json({
                message: "Refresh token is required"
            })
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        ) as RefreshTokenPayload

        const refreshTokens = await RefreshToken.find({
            user : decoded.userId
        })

        let matchedToken = null
        
        for (const token of refreshTokens){
            const isMatch = await bcrypt.compare(refreshToken, token.tokenHash!)

            if(isMatch){
                matchedToken = token
                break
            }
        }

        if(!matchedToken){
            return res.status(403).json({
                message : "Invalid refresh token"
            })
        }

        if (!matchedToken.expiresAt) {
            return res.status(500).json({
                message: "Refresh token expiration is missing"
        })
}

        if(matchedToken.expiresAt < new Date()){

            return res.status(403).json({
                message: "Refresh token has expired"
            })
        }

        //sign new access token
        const accessToken = jwt.sign({
            userId: decoded.userId ,
            username : decoded.username
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: "15m"
        }
        )

        return res.status(200).json(accessToken)
    } catch(error){
        if(error instanceof TokenExpiredError) {
            return res.status(401).json({
            message: "Refresh token has expired"
        })
        }

        if (error instanceof JsonWebTokenError) {
        return res.status(401).json({
            message: "Invalid refresh token"
        })
        }
        console.error("Error refreshing token:", error)

        return res.status(500).json({
            message: "Failed to refresh token"
        })
    }
}

export default refresh