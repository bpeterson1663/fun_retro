const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Retro = new Schema(
    {
        name: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true },
        userId: {type: String, required: true},
        numberOfVotes: {type: Number, required: true, default: 6},
        isActive: {type: Boolean, required: true, default: true}
    },
    { timestamps: true }
);

module.exports = mongoose.model('retros', Retro);