import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface JwtPayload {
    userId: string;
    username: string;
}

const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization

    if(!authHeader?.startsWith("Bearer")){
        return res.status(401).json({
            message: "Access token required"
        })
    }

    const token = authHeader.split(" ")[1]

    try{
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        ) as JwtPayload

        req.user = decoded
        next()
    } catch(error){
        return res.status(401).json({
            message : "Invalid or expired access token"
        })
    }
}

export default authenticate
