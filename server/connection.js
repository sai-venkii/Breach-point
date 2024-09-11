const mongoose=require('mongoose');
require('dotenv').config();
const Db_connect=async ()=>{
    await mongoose.connect(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.khcbk.mongodb.net/ctf?retryWrites=true&w=majority&appName=Cluster0`
        )
        .then(()=> {
            console.log('Connected to Mongodb');
        })
        .catch(error => { console.error(error) });
}

module.exports = Db_connect;

