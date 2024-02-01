class ErrorHandler extends Error{
  statusCode: Number;
  constructor(message,statusCode){
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this,this.constructor)
  }
}
module.exports = ErrorHandler