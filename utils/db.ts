import mongoose from 'mongoose';
require("dotenv").config()

const db_url=process.env.DB_URL|| ''

const connectDB=async ()=>{
  try{
    await mongoose.connect(db_url).then((data:any)=>{
      console.log(` Database connected with: ${data.connection.host}`);

    })
  }
  catch(error:any){
console.log(` Database connection error: ${error}`);
setTimeout(connectDB, 5000);
  }
}
export default connectDB;