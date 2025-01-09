
import mongoose from "mongoose";
const blogSchema = new mongoose.Schema({
  title:{
    type:String,
},

blogImage: {

    type: String,
   // required: true,
},


category: {
    type: String,
    required: true,
  },
 about: {
    type: String,
    required: true,
  
  },

  adminName: {
    type: String,
  },
  adminPhoto: {
    type: String,
  },

 createdby: {   
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
}
});
export const Blog = mongoose.model ("Blogdata", blogSchema);












