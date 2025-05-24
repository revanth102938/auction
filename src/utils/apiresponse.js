class apiresponse{
    constructor(
        statuscode, 
        data, 
        message = "Success"
    ){
        this.statuscode = statuscode;
        this.data = data;
        this.message = message;
        this.success = statuscode < 400;
    }
}
export { apiresponse };
// This code defines a class `apiresponse` that is used to structure API responses in a consistent format.