import {User} from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handlers.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace(/^Bearer\s+/i, "");

    if (!token) {
        throw new ApiError(401, "Unauthorized Access");
    }

    try{
       const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
       const user=await User.findById(decodedToken?._id).select(
         "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry"
       );

       if(!user){
         throw new ApiError(401,"Invalid Access Token");
       }

       req.user=user;
       next();
       
    } catch(error){
          if (error instanceof ApiError) {
            throw error;
          }

          throw new ApiError(401,"Invalid Access Token");
    }
});

