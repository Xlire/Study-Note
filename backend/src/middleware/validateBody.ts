import { Request, Response, NextFunction } from "express"

export const validateString = (
    field: string,
    maxLength: number,
    required = true
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const value = req.body[field]

        if (value === undefined && !required) {
            return next()
        }

        if (typeof value !== "string") {
            return res.status(400).json({
                message: `${field} must be a string`
            })
        }

        if (required && value.trim() === "") {
            return res.status(400).json({
                message: `${field} is required`
            })
        }

        if (value.length > maxLength) {
            return res.status(400).json({
                message: `${field} is too long`
            })
        }

        next()
    }
}