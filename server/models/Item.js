const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Item = new Schema(
    {
        columnName: { type: String, required: true },
        value: { type: String, required: true }, 
        retroId: { type: String, required: true },
        userId: { type: String, required: true },
        votes: { type: Number, required: true, default: 0 },
    },
    { timestamps: true}
);

module.exports = mongoose.model('items', Item);