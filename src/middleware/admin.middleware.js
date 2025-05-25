import { apierror } from "../utils/apierror.js";
import { asynchandler } from "../utils/asynchandler.js";

const isadmin = asynchandler(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new apierror(400,"User not authenticated");
    }
    if (user.role !== "admin") {
        throw new apierror(400,"Access denied: Admins only");
    }
    next();
});
export default isadmin;