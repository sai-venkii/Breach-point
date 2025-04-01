const mongoose = require('mongoose');
require('dotenv').config();

const conn = mongoose.createConnection(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.khcbk.mongodb.net/round_2?retryWrites=true&w=majority&appName=Cluster0`
        );
const logger = require('./DB_logger');
conn.on('connected', () => {
    logger.info("Database Round 2 connected successfully")
});
conn.on('disconnected', () =>{
    logger.error("Database Round 2 disconnected")
});
conn.on('reconnected', () => {
    logger.info("Database Round 2 reconnected successfully")
});

module.exports = conn;
