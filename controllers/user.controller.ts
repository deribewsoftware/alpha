import {Request,Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import userModel, { IUser } from "../models/user.model";
import jwt, { Secret } from 'jsonwebtoken'
import ejs from 'ejs'
import path from "path";
import sendEmail from "../utils/sendmail";
require("dotenv").config();

interface IUserRegistration{
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const userRegistration=CatchAsyncError(async(req:Request, res:Response,next:NextFunction)=>{
 try{
  const {name,email,password}= req.body;
  const isEmailExist = await userModel.findOne({email});
  if(isEmailExist){
    return next(new ErrorHandler("email already exists",400))
  }
const user: IUserRegistration={
  name,
  email,
  password
}

const activation=createActivationToken(user)
const activationCode=activation.activationCode
const data={user:{name:user.name},activationCode}
const html=await ejs.renderFile(path.join(__dirname,"../mails/activation-mail.ejs"),data)

try{
  await sendEmail({
    email:user.email,
    subject:"Activate Your Account",
    template:"activation-mail.ejs",
    data
  })
  res.status(201).json({
    success:true,
    message:`please check your email ${user.email} to activate your account`,
    activationToken:activation.token
  });
}
catch(error){}


 }
 catch(error:any){
  return next(new ErrorHandler(error.message,400))
 }

})

interface IActivationToken{
  token:string;
  activationCode:string;
}
const createActivationToken = (user:any):IActivationToken=>{
  const activationCode = Math.floor(1000+Math.random()*9000).toString();
  const token=jwt.sign({
    user,activationCode},
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn:"5m"
    }
    )
  return {activationCode,token};

};