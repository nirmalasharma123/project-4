const express=require("express");
const router=express.Router();
const userController=require("../controller/userController");
const bookController=require("../controller/bookController");

router.post("/register",userController.creatUser);
router.post("/login",userController.loginUser);

router.post("/books",bookController.creatBooks);

module.exports=router;