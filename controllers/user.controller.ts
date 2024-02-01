import {Request,Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import userModel, { IUser } from "../models/user.model";
import jwt, { Secret } from 'jsonwebtoken'
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
res.send(201).json({
  success:true,
  activation
})
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