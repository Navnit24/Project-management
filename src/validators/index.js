import { body } from 'express-validator';
import ApiError from '../utils/api-error.js';
import {AvailableUserRole} from "../utils/constants.js"


const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is not valid"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLowercase()
            .withMessage("Username must be in lowercase")
            .isLength({ min: 3, max: 20 })
            .withMessage("Username must be between 3 and 20 characters"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 6, max: 20 })
            .withMessage("Password must be between 6 and 20 characters"),
        body("fullName")
            .optional()
            .trim()
            .isString()
            .withMessage("Full name must be a valid string"),
    ];
};

const userLoginValidator = () => {
    return [
        body("email")
            .optional()
            .isEmail()
            .withMessage("Email is not valid"),
        body("password")
            .notEmpty()
            .withMessage("password is required")
    ];
};

const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldPassword").notEmpty().withMessage("old password is required"),
        body("newPassword").notEmpty().withMessage("new password is required"),
    ]
}

const userForgotPasswordValidator = () => {
    return [
        body("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("Email is invalid"),
    ]
}

const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword")
        .notEmpty()
        .withMessage("password is required")
    ]
}

const createProjectValidator = () => {
     return  [
       body("name")
          .notEmpty()
          .withMessage("Name is required") ,
       body("description").optional(),
      ];
};

const addMembertoProjectValidator = () => {
     return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
        body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(AvailableUserRole)
        .withMessage("Role is invalid"),
     ]
};

const createTaskValidator = () => {
    return [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Task title is required")
            .isLength({ min: 3 })
            .withMessage("Title must be at least 3 characters long"),
        body("description")
            .optional()
            .trim()
            .isString()
            .withMessage("Description must be a string"),
        body("assignedTo")
            .optional()
            .isMongoId()
            .withMessage("Invalid assignee ID"),
        body("status")
            .optional()
            .isIn(["todo", "in_progress", "done"])
            .withMessage("Status must be one of: todo, in_progress, done"),
    ];
};

const updateTaskValidator = () => {
    return [
        body("title")
            .optional()
            .trim()
            .isLength({ min: 3 })
            .withMessage("Title must be at least 3 characters long"),
        body("description")
            .optional()
            .trim()
            .isString()
            .withMessage("Description must be a string"),
        body("assignedTo")
            .optional()
            .isMongoId()
            .withMessage("Invalid assignee ID"),
        body("status")
            .optional()
            .isIn(["todo", "in_progress", "done"])
            .withMessage("Status must be one of: todo, in_progress, done"),
    ];
};

const createSubTaskValidator = () => {
    return [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Subtask title is required")
            .isLength({ min: 3 })
            .withMessage("Title must be at least 3 characters long"),
    ];
};

const createNoteValidator = () => {
    return [
        body("content")
            .trim()
            .notEmpty()
            .withMessage("Note content is required")
            .isLength({ min: 1 })
            .withMessage("Content cannot be empty"),
    ];
};

export { userRegisterValidator, userLoginValidator, 
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    createProjectValidator,
    addMembertoProjectValidator,
    createTaskValidator,
    updateTaskValidator,
    createSubTaskValidator,
    createNoteValidator
};