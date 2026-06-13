import {User} from "../models/user.models.js";
import {Project} from "../models/project.models.js";
import {ProjectMember} from "../models/projectmember.models.js";
import {Tasks} from "../models/task.model.js";
import {Subtask} from "../models/subtask.models.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handlers.js";
import ApiError from "../utils/api-error.js";
import { sendEmail, emailVerificationMailgenContent } from "../utils/mail.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const getTasks = asyncHandler(async(req,res) => {
      const { projectId } = req.params;
      const project = await Project.findById(projectId)
      if(!project){
        throw new ApiError(404,"Project not found")
      }

     const tasks = await Tasks.find({
        project: new mongoose.Types.ObjectId(projectId),
     }).populate("assignedTo","avatar username fullName");

     return res
     .status(200)
     .json(
        new ApiResponse(200,tasks,"Task fetched successfully")
     )
});

const createTask = asyncHandler(async(req,res) => {
      const {title,description,assignedTo,status}=req.body 
      const { projectId } = req.params;
      const project = await Project.findById(projectId)
      if(!project){
        throw new ApiError(404,"Project not found")
      }

      const files = req.files || []

      const attachments = files.map((file) => {
         return {
            url: `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size:file.size
         }
      })

      const task = await Tasks.create({
        title,
        description,
        project: new mongoose.Types.ObjectId(projectId),
        assignedTo : assignedTo ? new mongoose.Types.ObjectId(assignedTo):undefined,
        status,
        assignedBy: new mongoose.Types.ObjectId(req.user._id),
        attachment: attachments
     });

     return res
     .status(201)
     .json(
        new ApiResponse(201,task,"Task created successfully")
     )
});

const getTaskById = asyncHandler(async(req,res) => {
       const { projectId, taskId } = req.params;
      const task = await Tasks.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(taskId)
            }
        },
        {
            $lookup: {
                from:"users",
                localField:"assignedTo",
                foreignField:"_id",
                as: "assignedTo",
                pipeline:[
                    {
                        $project:{
                            _id:1,
                            username:1,
                            fullName:1,
                            avatar:1
                        }
                    }
                ]
            },
        },
        {
            $lookup: {
                from:"subtasks",
                localField:"_id",
                foreignField:"task",
                as: "subtasks",
                pipeline:[
                    {
                        $lookup: {
                            from:"users",
                            localField:"createdBy",
                            foreignField:"_id",
                            as: "createdBy",
                            pipeline :[
                                {
                                    $project:{
                                        _id:1,
                                        username:1,
                                        fullName:1,
                                        avatar:1
                                    }
                                }
                            ]
                       },
                   },
                   {
                     $addFields:{
                        createdBy: {
                            $arrayElemAt: ["$createdBy",0]
                        }
                     }
                   }
                ],
            }, 
        },
        {
          $addFields:{
          assignedTo:{
                  $arrayElemAt: ["$assignedTo",0]
                }
            }
        }
      ]);

      if(!task || task.length === 0){
        throw new ApiError(404,"Task not found")
      }

     return res
     .status(200)
     .json(
        new ApiResponse(200,task[0],"Task fetched successfully")
     )
});

const updateTask = asyncHandler(async(req,res) => {
       const { projectId, taskId } = req.params;
       const { title, description, assignedTo, status } = req.body;

       const task = await Tasks.findById(taskId);
       if(!task){
           throw new ApiError(404, "Task not found");
       }

       if(title) task.title = title;
       if(description) task.description = description;
       if(assignedTo) task.assignedTo = new mongoose.Types.ObjectId(assignedTo);
       if(status) task.status = status;

       await task.save();

       return res
       .status(200)
       .json(
           new ApiResponse(200, task, "Task updated successfully")
       )
});

const deleteTask = asyncHandler(async(req,res) => {
       const { projectId, taskId } = req.params;

       const task = await Tasks.findByIdAndDelete(taskId);
       if(!task){
           throw new ApiError(404, "Task not found");
       }

       // Delete associated subtasks
       await Subtask.deleteMany({ task: new mongoose.Types.ObjectId(taskId) });

       return res
       .status(200)
       .json(
           new ApiResponse(200, {}, "Task deleted successfully")
       )
});

const createSubTask = asyncHandler(async(req,res) => {
       const { projectId, taskId } = req.params;
       const { title } = req.body;

       const task = await Tasks.findById(taskId);
       if(!task){
           throw new ApiError(404, "Task not found");
       }

       const subTask = await Subtask.create({
           title,
           task: new mongoose.Types.ObjectId(taskId),
           createdBy: new mongoose.Types.ObjectId(req.user._id)
       });

       return res
       .status(201)
       .json(
           new ApiResponse(201, subTask, "Subtask created successfully")
       )
});

const updateSubTask = asyncHandler(async(req,res) => {
       const { projectId, subTaskId } = req.params;
       const { title, isCompleted } = req.body;

       const subTask = await Subtask.findById(subTaskId);
       if(!subTask){
           throw new ApiError(404, "Subtask not found");
       }

       if(title) subTask.title = title;
       if(isCompleted !== undefined) subTask.isCompleted = isCompleted;

       await subTask.save();

       return res
       .status(200)
       .json(
           new ApiResponse(200, subTask, "Subtask updated successfully")
       )
});

const deleteSubTask = asyncHandler(async(req,res) => {
       const { projectId, subTaskId } = req.params;

       const subTask = await Subtask.findByIdAndDelete(subTaskId);
       if(!subTask){
           throw new ApiError(404, "Subtask not found");
       }

       return res
       .status(200)
       .json(
           new ApiResponse(200, {}, "Subtask deleted successfully")
       )
});

export { getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask,
    createTask
};
