const userModel=require("../model/usermodel");
const jwt=require("jsonwebtoken")

const creatUser= async function(req,res){

    let data=req.body;
    let makeUser=await userModel.create(data);

    return res.status(201).send({status:true,data:makeUser})
};


const loginUser=async function(req,res){
    const email=req.body.email;
    const password=req.body.password;

    let findUser=await userModel.findOne({email:email,password:password});

    if(!findUser) return res.status(404).send({status:false,message:"no user found"});

     let token=jwt.sign({userId:findUser._id.toString()},"group10project");

    res.setHeader["x-api-key",token];

    return res.status(200).send({status:true,data:token})

}

module.exports={creatUser,loginUser};