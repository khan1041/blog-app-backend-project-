


import { User } from "../models/UserScema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

 dotenv.config()
 import { v2 as cloudinary } from "cloudinary";

export const ragister=async(req,res)=>{


try {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "User photo is required" });
      }
      const { photo } = req.files;
      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedFormats.includes(photo.mimetype)) {
        return res.status(400).json({
          message: "Invalid photo format. Only jpg and png are allowed",
        });
      }
      const { email, username, password,role } = req.body;
      if (
        !email ||
        !username ||
        !password ||       
        !photo
      ) {
        return res.status(400).json({ message: "Please fill required fields" });
      }
      const user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ message: "User already exists with this email" });
      }






      const cloudinaryResponse = await cloudinary.uploader.upload(
        photo.tempFilePath
      );
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.log(cloudinaryResponse.error);
      }
      const hashedPassword = await bcrypt.hash(password, 10);


      const newUser = new User({
        email,
        username,
        password: hashedPassword,
        role,
        photo:cloudinaryResponse.url,
        
      });
     const userreg= await newUser.save();
     return res.status(201).json({msg:"completed"})
     
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server error" });
    }
      
    
}


//Myprofile

export const Myprofile=async(req,res)=>{

  try {
    const user=req.user
    console.log(user)
    res.status(200).json({user})
  } catch (error) {
    console.log(error)
  }


}


//get user
export const alluser=async(req,res)=>{

    try {
        const alldatafind=await User.find()
        
        return res.status(200).json({alldatafind})
    } catch (error) {
        console.log(error)
    }
    
    }



//Login--//

export const Login=async(req,res)=>{

try {
    const { email, password } = req.body;
        
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
       // check role is correct or not
        return res.status(200).json({msg:"login done",token:await user.generateToken(),
      userId:user._id
 })
     
   
 
} catch (error) {
    console.log(error)
}}




//UPDATE USER image profie
export const updateProfile = async (req, res) => {
    try {
        const{profile}=req.file
        const userId = req.params.id;
        const update=await User.findById(userId)
        const uploder=await cloudinary.uploader.upload(req.file.path)

        update.profile=uploder.url
        
        await update.save()
        return res.status(200).json({msg:"user updated"})
    } catch (error) {
        console.log(error);
    }
}

//all admin users

export const adminlist=async(req,res)=>{

try {
  const adminget=await User.find({role:'admin'})
  return res.status(200).json({msg:"list admin",adminget})
} catch (error) {
  
}

}










