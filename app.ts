import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import userRouter from './routes/user.router'
export const app= express()


//body parser
app.use(express.json({limit:"50mb"}))

// cookies parser
app.use(cookieParser())

// cors origin
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//routes
app.use('/api/v1',userRouter)
//test api

app.get('/test',(req:Request, res:Response,next:NextFunction) =>{
  res.status(200).json({
    success: true,
    message:"test successful"
  })

})

// unknown routes
app.all('*', (req:Request, res:Response, next:NextFunction)=>{
  const err=new Error(`Route ${req.originalUrl} is not found`) as any;
  err.status = 404
  next(err)
})