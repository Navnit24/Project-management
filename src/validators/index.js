import { body } from 'express-validator';
import ApiError from '../utils/api-error.js';

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

export { userRegisterValidator, userLoginValidator, 
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator
};