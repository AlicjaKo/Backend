//Connection to data base is managed here
const mongoose = require('mongoose');

// MongoDB Connection
const connectToDatabase = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB Atlas");
    }
    catch(error){
        console.error("Problem with connecting to the DB");
        process.exit(1);
    }
};

module.exports=connectToDatabase;

