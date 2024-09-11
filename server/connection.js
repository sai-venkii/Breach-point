const mongoose=require('mongoose');
require('dotenv').config();
mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.khcbk.mongodb.net/ctf?retryWrites=true&w=majority&appName=Cluster0`
    )
    .then(()=> {
        console.log('connected to mongodb');
    })
    .catch(error => { console.error(error) });
