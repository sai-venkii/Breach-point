const mongoose = require('mongoose');
require('dotenv').config();

const conn = mongoose.createConnection(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.khcbk.mongodb.net/round_2?retryWrites=true&w=majority&appName=Cluster0`
        );

conn.on('connected', () => console.log('Mongo Round 2 connected'));
conn.on('open', () => console.log('Mongo Round 2  open'));
conn.on('disconnected', () => console.log('Mongo Round 2 disconnected'));
conn.on('reconnected', () => console.log('Mongo Round 2 reconnected'));
conn.on('disconnecting', () => console.log('Mongo Round 2 disconnecting'));
conn.on('close', () => console.log('Mongo Round 2 close'));

module.exports = conn;
