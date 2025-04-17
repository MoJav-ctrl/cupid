const mongoose = require("mongoose");

const datingUserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    interestedIn: {
      type: [String], 
      required: [true, "InterestedIn field is required"],
      validate: {
        validator: function (arr) {
          return arr.length > 0; 
        },
        message: "InterestedIn cannot be empty",
      },
    },
    age: {
      type: Number,
      min: [18, "Users must be at least 18 years old"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      match: [/^\d{10,15}$/, "Please enter a valid phone number"],
    },
    bio: {
      type: String,
      maxlength: [300, "Bio cannot exceed 300 characters"],
      default: null,
    },
    hobbies: {
      type: [String],
      default: [],
    },
    occupation: {
      type: String,
      default: null,
    },
    dob: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    stateOfOrigin: {
      type: String,
      default: null,
    },
    picture: {
      type: String,
      default: "default-profile.jpg",
    },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", datingUserSchema);

module.exports = User;
