const mongoose = require('mongoose');

let Item = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    available: {
        type: Number
    },
    status:{
        type: String,
        default: "Ordered"
    },
    email: {
        type: String,
        required: true
    },
    bought: {
        type: Array,
        default: []
    },
    rating: {
        type: Number,
        default: 0
    },
    ratingno: {
        type: Number,
        default: 0
    },
    crating: {
        type: Number,
        default: 0
    },
    cratingno: {
        type: Number,
        default: 0
    },
    review:{
        type: Array
    },
    productImage: {
        type:String
    }
});

module.exports = mongoose.model('Item', Item);