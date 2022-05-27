const mongoose = require("mongoose");
const config = require("../config/db.config");
const db = config.url;

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;