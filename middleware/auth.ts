import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "./catchAsyncError";

import jwt,{JwtPayload} from 'jsonwebtoken'
import { redis } from "../utils/redis";
import ErrorHandler from "../utils/ErrorHandler";


// authentication user
export const IsAuthenticated=CatchAsyncError(async(req:Request, res:Response,next:NextFunction)=>{
  const accessToken = req.cookies.access_token;
  if(!accessToken){
    return next(new ErrorHandler("please login to access this resourse",400));
  }
  const decoded=jwt.verify(accessToken,process.env.ACCESS_TOKEN as string) as JwtPayload;
  if (!decoded){
    return next(new ErrorHandler("access token is not valid",400));
  }
  const user=await redis.get(decoded.id)
  if(!user){
    return next(new ErrorHandler("please login to access this resource",400));
  }
  req.user=JSON.parse(user);
  next();
})

// validate user roles
export const authorizeRoles=(...roles:string[])=>{
  return (req:Request,res:Response,next:NextFunction)=>{
    if(!roles.includes(req.user?.role || "")){
      return next(new ErrorHandler(`Role:${req.user?.role} is not allowed to access this resource`,403))

    }

    next()
  }
}