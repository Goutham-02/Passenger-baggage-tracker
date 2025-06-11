import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new Error(401, "Unauthorized Request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new Error(401, "Invlalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        throw new Error(401, error?.message || "Invalid Access")
    }
}