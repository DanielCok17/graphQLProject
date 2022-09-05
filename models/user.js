const mongoose = require("mongoose");

const Scehma = mongoose.Schema;

const userSchema = new Scehma({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdEvents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        }
    ]
}); 

module.exports  = mongoose.model('User',userSchema);