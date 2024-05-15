class errorHandler extends Error {
	constructor(message, statusCode) {
		super(message);
		//The statusCode of the error
		this.statusCode = statusCode;
		//handles The status of the error
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		//to check if the operation can already be done or out of the scope of the app
		this.isOperational = true;
		//stack trace shows a log about the error and where in the code exactly it happened.
		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = errorHandler;
