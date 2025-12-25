export const errorHandler = (err, req, res, next) => {
    // If status is 200 (default), change to 500. Otherwise, use existing status (400, 401, 404, etc.)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    console.error(err.stack);
    
    res.status(statusCode).json({
        message: err.message || "Something went wrong!", 
    });
};