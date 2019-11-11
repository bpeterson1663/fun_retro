const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Retro = new Schema(
    {
        name: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        userId: {type: String, required: true},
        numberofVotes: {type: Number, required: true, default: 6},
        isActive: {type: Boolean, required: true, default: true}
    },
    { timestamps: true }
);

module.exports = mongoose.model('retros', Retro);