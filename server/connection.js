const mongoose=require('mongoose');
require('dotenv').config();
const logger=require('./DB_logger');
const Db_connect=async ()=>{
    await mongoose.connect(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.khcbk.mongodb.net/ctf?retryWrites=true&w=majority&appName=Cluster0`
        )
        .then(()=> {
            logger.info("Database Round 1 connected successfully")
        })
        .catch(error => { console.error(error) });
}

module.exports = Db_connect;

