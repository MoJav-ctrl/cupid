const mongoose = require('mongoose');

const loveRequestSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true, },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    },
    { timestamps: true}
)

module.exports = mongoose.model('LoveRequest', loveRequestSchema);