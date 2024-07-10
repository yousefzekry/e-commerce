module.exports = callback => {
	return async (req, res, next) => {
		try {
			await callback(req, res, next);
		} catch (error) {
			next(error);
		}
	};
};

// module.exports = callback =>{
// 	return(req,res,next)=>{
// 		callback(req,res,next).catch(next);
// 	};
// };
/* asyncWrapper functions takes a callback function
    then returns async function with parameters of req, res and next
    it waits for the req, res and it moves to the next middlesware 
    and if there is an error it catches it  */
