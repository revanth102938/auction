class apierror extends Error{
    constructor(statuscode,message = "Something went wrong",errors = [],stack = ""){
        super(message);
        this.statuscode = statuscode;
        this.message = message;
        this.errors = errors;
        this.stack = stack;
        this.success = false;
    }
}
export { apierror };
// This code defines a class `apierror` that extends the built-in `Error` class to create a structured error response for API errors. It includes properties for status code, message, errors, stack trace, and a success flag.
// The class can be used to throw errors in a consistent format across an application, making it easier to handle and log errors.
// The `apierror` class can be instantiated with a status code, message, an array of errors, and a stack trace, providing a comprehensive error object that can be returned in API responses.