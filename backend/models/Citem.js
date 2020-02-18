const mongoose = require('mongoose');

let Citem = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cemail: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Item', Citem);