

import express from 'express'
import { ragister,Login,updateProfile,alluser,adminlist,Myprofile } from '../controllers/Usercontrol.js'
import upload from '../middlewares/Multer.js'
import { isAuthenticated } from '../middlewares/isAdmin.js'
import { blogstart,updateBlog,allBlog,getSingleBlogs,blogimageCange,deleteBlog,Myblogs} from '../controllers/Blogcrate.js'
const router=express.Router()

router.post('/register',ragister)
router.post('/login',Login)
router.post("/update1/:id",upload.single("img"),updateProfile)
router.get('/users',alluser)
router.get('/admin',adminlist)
router.get('/profile',isAuthenticated,Myprofile)
//Blog router
router.post('/Blog',isAuthenticated,blogstart)
router.post('/update/:id',updateBlog)
router.get('/get/:id',getSingleBlogs)
router.put('/cange/:id',blogimageCange)
router.delete('/delete/:id',deleteBlog)
router.get('/allBlog',allBlog)
router.get('/myblogs',isAuthenticated,Myblogs)
export default router


