const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    flightNumber: { type: String, required: true },
    passengerName: { type: String, required: true },
    departureDate: { type: Date, required: true },
    seatNumber: { type: String, required: true },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
