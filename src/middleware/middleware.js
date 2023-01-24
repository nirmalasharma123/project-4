const jwt=require("jsonwebtoken");

const auth=async function(req,res,next){
   try{ let token =req.headars["x-api-key"];
    if(!token) return res.status(404).send({status:false,message:"token must be present"});

   let verifyToken= jwt.verify(token,"group10project");
   if(!verifyToken) return res.status(404).send({status:false,message:"invalid token"});

   req.token=verifyToken._id}
   catch(error){
    return res.status(500).send({status:false,message:error.message})

   }

   next();
    

};

const authrize=async function(req,res,next){
   try{ 
    let userId=req.prams.userId;
    if(userId!==req.token) return res.status(403).send({statustus:false,message:"you are not autherize for this"})
}
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    };
  next()

};

module.exports={auth,authrize};