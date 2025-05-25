import { jwt } from 'jsonwebtoken';

import { User } from '../models/user.models.js';
import { apierror } from '../utils/apierror.js';
import { asynchandler } from '../utils/asynchandler.js';

export const verifyjwt = asynchandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accesstoken || req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new apierror(401, 'Access token is required');
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?._id).select('-password -refreshtoken');
        if (!user) {
            throw new apierror(404, 'User not found');
        }
        req.user = user;
        next();
    } catch (error) {
        throw new apierror(401,error?.message || "Invalid access token");
    }
})