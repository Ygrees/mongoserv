const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    postIndex: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
const consumer = new mongoose.model('Consumer', schema);
module.exports = consumer;