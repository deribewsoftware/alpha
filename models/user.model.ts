require('dotenv').config();
import bycrpt from 'bcryptjs'
import mongoose, { Document, Model, Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
const emailRegex:RegExp=/^[^\s@]+@[^s@]+\.[^\s@]+$/
export interface IUser extends Document{
  name:string;
  email:string;
  password:string;
  avatar:{
    public_id:string;
    url:string;
  };

  isVerified:boolean;
  role:string;
  courses:Array<{courseId:string}>;
  comparePassword:(password:string)=>Promise<boolean>;
  SignAccessToken:()=>string;
  SignRefreshToken:()=>string;
}


const userSchema:Schema<IUser>=new mongoose.Schema({
  name:{
    type:String,
    required:[true,"please enter a name"]
  },
  email:{
    type:String,
    required:true,
    unique:true,
    validate:{
      validator:(value:string)=>{
        return emailRegex.test(value);
      },
      message:"please enter a valid email"
      
    },
    match:emailRegex
  },
  password:{
    type:String,
    
    minlength:[6,"password must be least 6 characters"],
    select:false
  },

  avatar:{
    public_id:String,
    url:String,
    
    
  },

  isVerified:{
    type:Boolean,
    default:false
  },
  role:{
    type:String,
    default:'user'
  },
  courses:[{
    courseId:String
  }],

  // comparePassword:(password:string)=>Promise<boolean>
},
{timestamps:true}
);


// hash password

userSchema.pre<IUser>('save',async function(next){
  if(!this.isModified('password')){
    next();

}


this.password=await bycrpt.hash(this.password,10)
next()

});

//sign user password
userSchema.methods.SignAccessToken=function(){
  return jwt.sign({id:this._id},process.env.ACCESS_TOKEN||"",{
    expiresIn:"5m"
  });
}
// sign refresh token
userSchema.methods.SignRefreshToken=function(){
  return jwt.sign({id:this._id},process.env.REFRESH_TOKEN||"",{
    expiresIn:"7d"
  });
}
// compare password
userSchema.methods.comparePassword= async function(enteredpassword:string):Promise<boolean> {
  const istrue=await bycrpt.compare(enteredpassword,this.password)
  console.log("istrue=",istrue);
  return istrue
}


const userModel:Model<IUser> =mongoose.model('User',userSchema);
export default userModel;