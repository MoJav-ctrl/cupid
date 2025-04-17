const User = require('../models/user')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { sendEmail } = require('../utils/emailService')
const generateVerificationCode = () => crypto.randomInt(100000, 999999).toString();

exports.getAllUsers = async (req, res) => {
  try {
    const { interestedIn, hobbies, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (interestedIn) {
      filter.interestedIn = interestedIn; 
    }

    if (hobbies) {
      filter.hobbies = { $in: hobbies.split(",") }; 
    }

    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (!users.length) {
      return res.status(404).json({ message: "No Users Found" });
    }

    res.status(200).json({
      message: "Successfully fetched users",
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -verificationCode -verificationCodeExpires");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

exports.signUp = async(req, res) => {
   try {
    const { firstName, lastName, gender, age, email, password, username, phone, bio, interestedIn, hobbies, occupation, dob, location, stateOfOrigin } = req.body

    if (!Array.isArray(interestedIn) || interestedIn.length === 0) {
      return res.status(400).json({ message: "InterestedIn field must be a non-empty array" });
    }
    const existingUserName = await User.findOne({ username})
    if (existingUserName) return res.status(400).json({ message: 'Username already exists' })
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ message: 'Email already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const verificationCode = generateVerificationCode()
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);


    const user = await new User({
        firstName,
        lastName,
        gender,
        age,
        email,
        password: hashedPassword,
        username,
        phone,
        bio,
        interestedIn,
        hobbies,
        occupation,
        dob,
        location,
        stateOfOrigin,
        verificationCode,
        verificationCodeExpires,
    }).save()

    await sendEmail(
        email,
        "Account Verification Code",
        `Your verification code is: ${verificationCode}. It expires in 10 minutes.`
      );
      return res.status(201).json({ message: "User created. Check your email for the verification code." });

      
   } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error", error: error.message });
   }
}
exports.verifyAccount = async (req, res) => {
    try {
      const { email, verificationCode } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) return res.status(404).json({ message: "User not found" });
      if (user.isVerified) return res.status(400).json({ message: "Account is already verified" });
  
      if (!user.verificationCode || user.verificationCodeExpires < new Date()) {
        return res.status(400).json({ message: "Verification code expired. Request a new one." });
      }
  
      if (user.verificationCode !== verificationCode) {
        return res.status(400).json({ message: "Invalid verification code" });
      }
  
      user.isVerified = true;
      user.verificationCode = null;
      user.verificationCodeExpires = null;
      await user.save();
  
      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      return res.status(200).json({ message: "Account verified successfully", token });
  
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  exports.resendVerificationCode = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) return res.status(404).json({ message: "User not found" });
      if (user.isVerified) return res.status(400).json({ message: "Account is already verified" });
  
      const newVerificationCode = generateVerificationCode();
      user.verificationCode = newVerificationCode;
      user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); 
      await user.save();
  
      await sendEmail(
        email,
        "New Verification Code",
        `Your new verification code is: ${newVerificationCode}. It expires in 10 minutes.`
      );
  
      return res.status(200).json({ message: "New verification code sent." });
  
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });
      if (!user.isVerified) return res.status(403).json({ message: "Account is not verified" });
      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({ message: "Logged in successfully", token });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
  }


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
