import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
export const app= express()


//body parser
app.use(express.json({limit:"50mb"}))

// cookies parser
app.use(cookieParser())

// cors origin
app.use(cors({
  origin:['http://localhost:3000']
}))

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