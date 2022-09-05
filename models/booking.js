const mongoose = require("mongoose");

const Scehma = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
    event: {
        type: Scehma.Types.ObjectId,
        ref: 'Event'
    },
    user: {
        type: Scehma.Types.ObjectId,
        ref: 'User'
    },
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Booking',bookingSchema);