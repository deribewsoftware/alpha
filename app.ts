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
app.use(cors({
  origin:'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // enable credentials (cookies, Authorization headers, etc.)
  optionsSuccessStatus: 204,
}))

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