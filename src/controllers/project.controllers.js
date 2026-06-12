import {User} from "../models/user.models.js";
import {Project} from "../models/project.models.js";
import {ProjectMember} from "../models/projectmember.models.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handlers.js";
import ApiError from "../utils/api-error.js";
import { sendEmail, emailVerificationMailgenContent } from "../utils/mail.js";
import mongoose from "mongoose";
import { UserRolesEnum } from "../utils/constants.js";

const getProjects = asyncHandler( async (req,res) => {

});


const getProjectById = asyncHandler( async (req,res) => {

});

const createProject = asyncHandler( async (req,res) => {
      const {name,description}=req.body;

      const project=await Project.create({
        name,
        description,
        createdBy:  new mongoose.Types.ObjectId(req.user._id)
      });

      await ProjectMember.create({
        user: new mongoose.Types.ObjectId(req.user_id),
        project: new mongoose.Types.ObjectId(project._id),
        role: UserRolesEnum.ADMIN,
      }
    )
     return res
         .status(201)
         .json(
            new ApiResponse(
                200,
                project,
                "Project created Successfully"
        ));
});

const updateProject = asyncHandler( async (req,res) => {
       const {name,description}=req.body;
       const {projectId} = req.params;

       const project = await Project.findByIdAndUpdate(
        projectId,
        {   
            name,
           description,
        },
        {new:true}
    )
     
    if(!project){
        throw new ApiError(404,"Project not found");
    }

      
     return res
         .status(200)
         .json(
            new ApiResponse(
                200,
                project,
                "Project updated Successfully"
        ));
});

const deleteProject = asyncHandler( async (req,res) => {
     const {projectId} = req.params;

       const project = await Project.findByIdAndDelete(projectId)
     
    if(!project){
        throw new ApiError(404,"Project not found");
    }

      
     return res
         .status(200)
         .json(
            new ApiResponse(
                200,
                project,
                "Project deleted Successfully"
        ));
});


const addProjectMembers = asyncHandler( async (req,res) => {

});

const getProjectMembers = asyncHandler( async (req,res) => {

});

const updateMembersRole = asyncHandler( async (req,res) => {

});

const deleteMembers = asyncHandler( async (req,res) => {

});

export {
    addProjectMembers,
    getProjectById,
    getProjects,
    deleteMembers,
    addProjectMembers,
    updateMembersRole,
    updateProject,
    deleteProject,
    createProject,
    getProjectMembers

}