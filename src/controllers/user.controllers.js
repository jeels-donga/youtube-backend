import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/FileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // if user already exists:username,email
    // check for images , check for avatar
    // upload them of cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token from response
    // check for user creation
    // return response

    const { fullname, username, email, password } = req.body
    console.log(fullname, username, email, password);

    if ([fullname, username, email, password].some((fields) => fields.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }
    const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
    const coverImageUpload = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatarUpload) {
        throw new ApiError(400, "Avatar upload failed");
    }
    if (!coverImageUpload) {
        throw new ApiError(400, "Cover image upload failed");
    }
    const user = await User.create({
        fullname,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatarUpload.url,
        coverImage: coverImageUpload.url || "",
    })
    const createdUser = await User.findById(user, _id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Registration failed");
    }
    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"))
})

export { registerUser }