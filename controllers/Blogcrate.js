
import mongoose, { mongo } from "mongoose";

import { Blog } from "../models/BlogScema.js";
import dotenv from 'dotenv'
import { v2 as cloudinary } from "cloudinary";
 dotenv.config()

export const blogstart=async(req,res)=>{

    try {
  const {blogImage} = req.files;
       
      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedFormats.includes(blogImage.mimetype)) {
        return res.status(400).json({
          message: "Invalid photo format. Only jpg and png are allowed",
        });
      }

      
      const { title, category, about } = req.body;
      if (!title || !category || !about) {
        return res
          .status(400)
          .json({ message: "title, category & about are required fields" });
      }

          const cloudinaryResponse = await cloudinary.uploader.upload(
            blogImage.tempFilePath
          );
          if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.log(cloudinaryResponse.error);
          }


          const adminName = req.user.username;
          const adminPhoto = req.user.photo;
          const createdBy = req.user._id;

          const blogData = {
            title,
            about,
            category,
            adminName,
            adminPhoto,
             createdby:createdBy,
            blogImage:cloudinaryResponse.secure_url, 
            
            
          }
        console.log(blogData)
          const blog = await Blog.create(blogData);
      
          res.status(201).json({
            message: "Blog created successfully",
            blog,
          });
        } catch (error) {
          console.log(error);
          return res.status(500).json({ error: "Internal Server error" });
        }}

export const getSingleBlogs = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Blog id" });
  }
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.status(200).json(blog);
};

//




export const updateBlog=async(req,res)=>{
 
   
  
 try {
    const{title,category,about}=req.body

    const updateId=req.params.id
    const update=await Blog.findById(updateId)
 //  const uploder=await cloudinary.uploader.upload(Blogimage.path)



if(!update){
    return res.status(400).json({msg:"user not found"})
}

if(title){
update.title=title
}

if(category){
    update.category=category
}
if(about){
    update.about=about
}

await update.save()
return res.status(200).json({msg:"post update",update})

} catch (error) {
    console.log(error)
}


}

export const blogimageCange=async(req,res)=>{

try {
  const updateId=req.params.id
 const update=await Blog.findById(updateId)
 const { blogImage } = req.files;
const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
if (!allowedFormats.includes(blogImage.mimetype)) {
  return res.status(400).json({
    message: "Invalid photo format. Only jpg and png are allowed",
  });
}
const cloudinaryResponse = await cloudinary.uploader.upload(
  blogImage.tempFilePath
);

if(blogImage){
  update.blogImage=cloudinaryResponse.url
  
 }
await update.save()
return res.status(200).json({msg:"post image update",update})

} catch (error) {
  console.log(error)
}
}


//My blogs
export const Myblogs=async(req,res)=>{

  const userId = req.user._id;
const myBlogs=await Blog.find({createdby:userId})
 // console.log(createdBy)
 res.status(200).json(myBlogs);




}



export const allBlog=async(req,res)=>{

    try {
        const AllBlogfind=await Blog.find()
        return res.status(200).json({AllBlogfind})
        
    } catch (error) {
        console.log(error)
    }

}



export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  await blog.deleteOne();
  res.status(200).json({ message: "Blog deleted successfully" });
};


