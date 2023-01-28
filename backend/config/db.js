const mongoose = require('mongoose')
const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI,{
            useUnifiedTopology:true,
            useNewUrlParser:true,
        });
        console.log("Mongodb connected");
    } catch(error){
        console.log(`Error ${error.message}`)
        process.exit();
    }
};
// imp used for connecting mongoDb
module.exports=connectDB;