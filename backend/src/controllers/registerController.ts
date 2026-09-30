import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt"

export const register = async (req: Request, res: Response) => {
    try{
        const {username, password} = req.body

        if(!username || !password)  {
            return res.status(400).json({
                message: "Username and password are required"
            })
        }

        const existingUser = await User.findOne({username})

        if(existingUser){
            return res.status(409).json({
                message : "Username already exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            username,
            password : hashedPassword
        })

        return res.status(201).json({
            message : "User registered successfully",
            user : {
                id: user._id,
                username : user.username
            }
        })
    } catch(error){
        console.error("Error registering user:", error)
        return res.status(500).json({
            message : "Failed to register user"
        })
    }
}

export default register