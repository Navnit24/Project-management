import {User} from "../models/user.models.js";
import {ProjectMember} from "../models/projectmember.models.js"
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handlers.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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

export const validateProjectPermission = (roles = []) => {
  return asyncHandler(async(req,res,next) => {
    const {projectId} =req.params

    if(!projectId){
      throw new ApiError(400,"Project id is missing");
    }

   const project = await ProjectMember.findOne({
    project: new  mongoose.Types.ObjectId(projectId),
    user: new  mongoose.Types.ObjectId(req.user._id),
  })

  if(!project){
      throw new ApiError(400,"Project document is missing");
  }

  const givenRole = project?.role;

  if(!roles.includes(givenRole)){
         throw new ApiError(403,
          "You do not have permission to perform this action"
         )
  }

  req.user.role = givenRole;
  next();
});
};
