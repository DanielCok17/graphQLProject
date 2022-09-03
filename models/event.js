const mongoose = require("mongoose");

const Scehma = mongoose.Schema;

const eventSchema = new Scehma({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    } 
}); 

module.exports  = mongoose.model('Event',eventSchema);