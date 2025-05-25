import User from "../models/user.models.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse";
import { asynchandler } from "../utils/asynchandler.js";


const generateaccessandrefreshtokens = async(userId)=>{
    const user = await User.findbyId(userId);
    if (!user) {
        throw new apierror(404, "User not found");
    }
    const accessToken = user.createaccesstoken();
    const refreshToken = user.createrefreshtoken();
    return { accessToken, refreshToken };
}
const registeruser = asynchandler(async(req , res) =>{
    const { username, email, fullname, avatar, password } = req.body;

    if (!username || !email || !fullname || !password) {
        throw new apierror(400, "All fields are required");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new apierror(400, "User already exists with this email");
    }
    const avatarlocalpath = req.file?.path;
    if (avatarlocalpath) {
        const avatarobj = await uploadToCloudinary(avatarlocalpath);
        if (!avatarobj) {
            throw new apierror(500, "Failed to upload avatar to Cloudinary");
        }
        avatar = avatarobj.url;
    } else {
        avatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    }
    if (!avatar) {
        throw new apierror(400, "Avatar is required");
    }
    const newUser = await User.create({
        username,
        email,
        fullname,
        avatar,
        password
    });
    if (!newUser) {
        throw new apierror(500, "Failed to create user");
    }
    const { accessToken, refreshToken } = await generateaccessandrefreshtokens(newUser._id);
    newUser.refreshtoken = refreshToken;

    const saveduser = await User.findbyId(newUser._id).select("-password -refreshtoken");
    if (!saveduser) {
        throw new apierror(500, "Failed to retrieve saved user");
    }

    return res
    .status(200)
    .json(
        new apiresponse(200, {
            user: saveduser,
            accessToken,
            refreshToken
        }, "User registered successfully")
    );
})

const Loginuser = asynchandler(async(req, res) => {
    const { username , email, password } = req.body;

    if (!email && !username) {
        throw new apierror(400, "Email or username is required");
    }

    const user = await User.findOne(
        {
        $or:[{ username }, { email }]
        }
    );

    if (!user) {
        throw new apierror(404, "User not found");
    }

    const isPasswordCorrect = await user.ispasswordcorrect(password);
    if (!isPasswordCorrect) {
        throw new apierror(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateaccessandrefreshtokens(user._id);
    user.refreshtoken = refreshToken;
    await user.save();
    // const options = {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "strict",
    //     maxAge: 24 * 60 * 60 * 1000 // 1 day
    // };
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("accesstoken", accessToken, options)
        .cookie("refreshtoken", refreshToken, options)
        .json(
            new apiresponse(200, {
                user: user,
                accessToken,
                refreshToken
            }, "User logged in successfully")
        );
});
const Logoutuser = asynchandler(async(req, res) => {
    const user = req.user; 
    await User.findByIdAndUpdate(user._id,{
        $set:{
            refreshtoken: null,
        }
    });
    if (!user) {
        throw new apierror(404, "User not found");
    }

    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .clearCookie("accesstoken",  options)
        .clearCookie("refreshtoken",  options)
        .json(
            new apiresponse(200, null, "User logged out successfully")
        );
});