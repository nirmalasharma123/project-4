const bookModel=require("../model/bookmodel");
const creatBooks=async function(req,res){

  let data=req.body;
  const books=await bookModel.create(data);
  return res.status(201).send({status:true,data:books})
};

module.exports={creatBooks}