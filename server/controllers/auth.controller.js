const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { hashPassword } = require('../utils/authHelper');

// Google Sign-In
const googleSignIn = async (req, res) => {
    try {
        if (!req.body.email || !req.body.username || !req.body.avatar) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if user already exists
        let user = await User.findOne({ email: req.body.email });
        let isNewUser = false;

        if (!user) {
            // If user doesn't exist, create a new one
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await hashPassword(generatedPassword);

            user = new User({
                username: req.body.username.split(" ").join("").toLowerCase(),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.avatar
            });

            await user.save();
            isNewUser = true;
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Remove sensitive data from the response
        const { password, ...rest } = user._doc;
        const userWithToken = { ...rest, token };

        // Send response
        if (isNewUser) {
            return res.status(200).json({ user: userWithToken, message: "New user created successfully!" });
        } else {
            return res.status(200).json({ user: userWithToken, message: "Login Successful!" });
        }
    } catch (error) {
        console.error("Error in googleSignIn:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// Traditional Signup
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "User already exists with that email", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Traditional Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const errorMsg = "Auth failed, email or password is wrong";

        if (!user) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const jwtToken = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            name: user.name
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

module.exports = {
    googleSignIn,
    signup,
    login
};