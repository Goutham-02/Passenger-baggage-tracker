import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if ([name, email, password, role].some((field) => !field || field.trim() === "")) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const user = await User.create({ name, email, password, role });

        const createdUser = await User.findById(user._id).select("-password");
        if (!createdUser) {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: createdUser
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: "Email, Password, and Role are required" });
        }

        // Find user with matching email AND role
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(404).json({ success: false, message: "User with given email and role does not exist" });
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .cookie("role", role)
            .json({
                status: 200,
                success: true,
                message: "User logged in successfully",
                user: loggedInUser,
            });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

const logoutUser = async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ message: "User Loggedout successfully" })
}

export { registerUser, loginUser, logoutUser }