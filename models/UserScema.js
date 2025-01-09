
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

const userSchema = new mongoose.Schema({
    username:{type:String,
        // required:true,
        },
    role:{
      type:String,
      enum:["admin","user"],
       required:true,
    },

    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    photo: {
      
        type: String,
        required: true,
      
  
      }
    
},{timestamps:true});

userSchema.methods.generateToken=function(){

    try {
     return jwt.sign({
   
      userId:this._id.toString(),
     email:this.email,
      //isAdmin:this.isAdmin
      // nid:this.nid
     },
     
   process.env. JWT_SECRECT_KEY,
   {
     expiresIn:"30d"
   }
   
   )
    } catch (error) {
     console.log(error)
    }
   
   }


export const User = mongoose.model('User', userSchema);

