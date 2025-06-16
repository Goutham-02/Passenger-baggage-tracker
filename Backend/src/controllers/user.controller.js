import { User } from "../models/user.model.js";
import { Plane } from "../models/plane.model.js";
import { Baggage } from "../models/baggage.model.js";

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
};

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
            .cookie("userId", user._id)
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
};

const addPlane = async (req, res) => {
    try {
        const { name, from, to, departureTime, arrivalTime } = req.body;

        if ([name, from, to, departureTime, arrivalTime].some((field) => !field || field.trim() === "")) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingPlane = await Plane.findOne({ name });
        if (existingPlane) {
            return res.status(409).json({ success: false, message: "Plane with this name already exists" });
        }

        const plane = await Plane.create({ name, from, to, departureTime, arrivalTime });

        return res.status(201).json({
            success: true,
            message: "Plane added successfully",
            plane
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

const addBaggage = async (req, res) => {
    try {
        const { passengerId, flightId, weight, status, location } = req.body;

        if ([passengerId, flightId, status, location].some((field) => !field || field.trim() === "") || !weight) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const flight = await Plane.findById(flightId);
        if (!flight) {
            return res.status(404).json({ success: false, message: "Flight not found" });
        }

        const passenger = await User.findById(passengerId);
        if (!passenger) {
            return res.status(404).json({ success: false, message: "Passenger not found" });
        }

        const existingBaggage = await Baggage.findOne({ passengerId, flightId });
        if (existingBaggage) {
            return res.status(409).json({
                success: false,
                message: "Baggage for this passenger and flight already exists"
            });
        }

        const flightCode = (flight.name || "").substring(0, 3).toUpperCase();
        const userCode = (passenger.name || "").substring(0, 3).toUpperCase();

        let baggageID;
        let isUnique = false;

        while (!isUnique) {
            const randomDigits = Math.floor(1000 + Math.random() * 9000);
            baggageID = `${flightCode}${userCode}${randomDigits}`;

            const existingTag = await Baggage.findOne({ baggageID });
            if (!existingTag) isUnique = true;
        }

        const baggage = await Baggage.create({
            passengerId,
            flightId,
            weight,
            status,
            baggageID
        });

        return res.status(201).json({
            success: true,
            message: "Baggage added successfully",
            baggage
        });

    } catch (error) {
        console.error("Error adding baggage:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

const updateBaggageStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        if (!id || !status) {
            return res.status(400).json({ success: false, message: "Baggage ID and status are required" });
        }

        const baggage = await Baggage.findByIdAndUpdate(id, { status }, { new: true });
        if (!baggage) {
            return res.status(404).json({ success: false, message: "Baggage not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Baggage status updated successfully",
            baggage
        });

    } catch (error) {
        console.error("Error updating baggage status:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

const searchBaggage = async (req, res) => {
    try {
        const { tagNumber } = req.params;
        if (!tagNumber) {
            return res.status(400).json({ success: false, message: "Tag number is required" });
        }

        const baggage = await Baggage.findOne({ tagNumber })
            .populate('passengerId', 'name')
            .populate('flightId', 'name from to');

        if (!baggage) {
            return res.status(404).json({ success: false, message: "Baggage not found" });
        }

        return res.status(200).json({
            success: true,
            baggage
        });

    } catch (error) {
        console.error("Error searching baggage:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

const getAllBaggagesOfPassenger = async (req, res) => {
    try {
        const { passengerId } = req.params;
        if (!passengerId) {
            return res.status(400).json({ success: false, message: "Passenger ID is required" });
        }
        const baggages = await Baggage.find({ passengerId })
            .populate('passengerId', 'name')
            .populate('flightId', 'name from to departureTime arrivalTime');

        return res.status(200).json({
            success: true,
            baggages
        });

    } catch (error) {
        console.error("Error fetching baggages:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

const getAllBaggages = async (req, res) => {
    try {
        const baggages = await Baggage.find({})
            .populate('passengerId', 'name')
            .populate('flightId', 'name from to departureTime arrivalTime');

        return res.status(200).json({
            success: true,
            baggages
        });

    } catch (error) {
        console.error("Error fetching all baggages:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};


export {
    registerUser,
    loginUser,
    logoutUser,
    addPlane,
    generateAccessAndRefreshToken,
    addBaggage,
    updateBaggageStatus,
    searchBaggage,
    getAllBaggages,
    getAllBaggagesOfPassenger
};