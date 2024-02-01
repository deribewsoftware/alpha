import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware=(err:any,req:Request,res:Response,next:NextFunction)=>{
  err.statusCode=err.statusCode||500
  err.message=err.message || 'Internal server Error'
  
  //wrong mongdb error
  if(err.name==='CastError'){
    const message=`resources not found invalid ${err.path}`;
    err= new ErrorHandler(message,400)
  }
  
  // duplicate key error
  if(err.code===11000){
    const message=`Dublicate ${Object.keys(err.keyValue)} entered`;
    err= new ErrorHandler(message,400)
  }
  
  
  // jwt error
  
  if(err.name==='JsonWebTokenError'){
    const message=`JsonWebToken is invalid try again`;
    err= new ErrorHandler(message,400)
  }
  
  // jwt token expired
  if(err.name==='TokenExpiredError'){
    const message=`JWT token expired try again`;
    err= new ErrorHandler(message,400)
  }
  res.status(err.statusCode).json({success:false,message:err.message})
  }