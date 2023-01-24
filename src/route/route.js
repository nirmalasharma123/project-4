const express=require("express");
const router=express.Router();
const userController=require("../controller/userController");
const bookController=require("../controller/bookController");

router.post("/register",userController.creatUser);
router.post("/login",userController.loginUser);

router.post("/books",bookController.creatBooks);
router.get("/books",bookController.getBooks);

router.put("/books/:bookId",bookController.updateBook);
router.get("/books/:bookId",bookController.getBookByparams)

router.delete("/books/:bookId",bookController.deleteParam);



module.exports=router;