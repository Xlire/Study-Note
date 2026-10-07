import { rateLimit } from "express-rate-limit"

export const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: "Too many authentication attempts. Please try again later."
    }
})

export const registerLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: "Too many authentication attempts. Please try again later."
    }
})

export const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator: (req) => {
        if (!req.user) {
            throw new Error("Authenticated user is missing")
        }

        return `user:${req.user.userId}`
    },
    message: {
        message: "Too many AI requests. Please try again later."
    }
})