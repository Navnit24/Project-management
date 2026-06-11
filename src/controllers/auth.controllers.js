import {User} from "../models/user.model.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handlers.js";
import ApiError from "../utils/api-error.js";
import { sendEmail, emailVerificationMailgenContent } from "../utils/mail.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error while generating access and refresh token", [error.message]);
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { email,username, password , role} = req.body;
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists",[]);
    }

    const user = await User.create({
        email,
        username,
        password,
        isEmailVerified: false
    });
     
    const {unHashedToken , hashedToken, tokenExpiry} = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgenContent(user.username,
            `${req.protocol}://${req.get("host")}/api/v1/auth/users/verify-email/${unHashedToken}`
        )
      });
      const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry"
      );

      if(!createdUser){
        throw new ApiError(500, "something went wrong while creating user")
      }

      return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                {
                    user: createdUser,
                },
                "User registered successfully, Please verify your email to proceed further"

            ),
        );
});

const login = asyncHandler(async (req,res) => {
    const {email,password,username} = req.body;

    if(!username && !email){
        throw new ApiError(400,"Username or email is required");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(400,"User does not exist");
    }

    const isPasswordValid = await user.isPasswordValid(password);

    if(!isPasswordValid){
        throw new ApiError(400,"Invalid Credentials");
    }

    const {accessToken, refreshToken}=await 
    generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry"
      );

      const options = {
          httpOnly: true,
          secure: true
      };

      return res
         .status(200)
         .cookie("accessToken".accessToken,options)
         .cookie("refreshToken", refreshToken ,options)
         .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successsfully"
            )
         )
});
    
const logoutUser = asyncHandler(async(req,res) =>{
     
});

export { registerUser,login,logoutUser };