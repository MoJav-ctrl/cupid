const LoveRequest = require('../models/loveRequest')
const User = require('../models/user')
const { sendEmail } = require('../utils/emailService')

exports.sendLoveRequest = async (req, res) => {
    try {
      const { userId, receiverEmail } = req.body;
  
      if (!userId || !receiverEmail) {
        return res.status(400).json({ message: "User ID and Receiver's Email are required." });
      }
  
      const sender = await User.findById(userId).select("-password -verificationCode -verificationCodeExpires");
      if (!sender) {
        return res.status(404).json({ message: "Sender not found." });
      }
  
      const recipient = await User.findOne({ email: receiverEmail.toLowerCase() }).select("-password -verificationCode -verificationCodeExpires");
      if (!recipient) {
        return res.status(404).json({ message: "Recipient not found." });
      }
  
      const isMatch = recipient.interestedIn.some(interest => sender.interestedIn.includes(interest));
      if (!isMatch) {
        return res.status(400).json({ message: "Recipient is not interested in your preferences." });
      }
  
      const existingRequest = await LoveRequest.findOne({ sender: userId, receiver: recipient._id, status: "pending" });
      if (existingRequest) {
        return res.status(400).json({ message: "A pending love request already exists." });
      }
  
      const newRequest = new LoveRequest({ sender: userId, receiver: recipient._id });
      await newRequest.save();
  
      await sendEmail(
        recipient.email,
        "New Love Request",
        `Hello ${recipient.firstName}, you have received a new love request from ${sender.firstName} ${sender.lastName}.`
      );
  
      return res.status(201).json({ message: "Love request sent successfully.", request: newRequest });
  
    } catch (error) {
      console.error("Error sending love request:", error);
      return res.status(500).json({ message: "Unable to send love request. Try again later.", error: error.message });
    }
  };
  exports.respondToLoveRequest = async (req, res) => {
    try {
      const { userId, senderId, action } = req.body; 
  
      if (!userId || !senderId || action === undefined) {
        return res.status(400).json({ message: "Recipient ID, Sender ID, and action (true/false) are required." });
      }
  
      // Find the pending love request
      const loveRequest = await LoveRequest.findOne({ sender: senderId, receiver: userId, status: "pending" });
  
      if (!loveRequest) {
        return res.status(404).json({ message: "No pending love request found." });
      }
  
      const sender = await User.findById(senderId).select("email firstName lastName");
      if (!sender) {
        return res.status(404).json({ message: "Sender not found." });
      }
  
      const recipient = await User.findById(userId).select("email firstName lastName");
      if (!recipient) {
        return res.status(404).json({ message: "Recipient not found." });
      }
  
      loveRequest.status = action ? "accepted" : "rejected";
      await loveRequest.save();
  
      const decisionMessage = action
        ? `Congratulations! ${recipient.firstName} has accepted your love request.`
        : `Sorry, ${recipient.firstName} has rejected your love request.`;
  
      await sendEmail(sender.email, "Love Request Response", decisionMessage);
  
      return res.status(200).json({ message: `Love request ${action ? "accepted" : "rejected"} successfully.` });
  
    } catch (error) {
      console.error("Error responding to love request:", error);
      return res.status(500).json({ message: "Unable to process love request response.", error: error.message });
    }
  };