const userModel=require("../model/usermodel");
const jwt=require("jsonwebtoken");
const validator=require("../validator/validator");
const valid=require("validator");

const creatUser= async function(req,res){

    try {let data=req.body;
        
    let {title,name,phone,email,password,address}=data;
        if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"Please provide details"});
    if(typeof(title && name && phone && email  && password ) !=="string") return res.status(404).send({status:false,message:"please provide details in string"});

    if(!title) return res.status(404).send({status:false,message:"please provide title"});

    if(!(["Mr", "Mrs", "Miss"].includes(title))) return res.status(404).send({status:false,message:"please provide valid title  like Mr,Miss,Mrs"});

    if(!name) return res.status(404).send({status:false,message:"please provide name"});
    if(!validator.isValidateName(name))return res.status(404).send({status:false,message:"please provide a valid name" });
      
    if(!phone) return res.status(404).send({status:false,message:"please provide phone no"});
    if(!validator.isValidMobile(phone)) return res.status(404).send({status:false,message:"please provide phone no must be 10 digit"});
    
    if(!email) return res.status(404).send({status:false,message:"please provide email no"});
    if(!valid.isEmail(email))  return res.status(404).send({status:false,message:"please provide email no"});
    
    let findNumber= await userModel.findOne({phone:phone});
    if(findNumber) return res.status(404).send({status:false,message:"phone no already present"});

    let findEmail=await userModel.findOne({email:email})
    if(findEmail) return res.status(404).send({status:false,message:"email no already present"});

    if(!password) return res.status(404).send({status:false,message:"password is mendatory"});
    if(!validator.isValidPassword(password)) return res.status(404).send({status:false,message:"password should be minimum 8 letters and max 18 letter and should conatin one special character"});
     
    
    if(!address.street)return res.status(404).send({status:false,message:"addresss must have street no in it"});
    if(typeof address.street!="string") return res.status(404).send({status:false,message:"addresss must have street  in  string form "});

    if(!address.city) return res.status(404).send({status:false,message:"address must have city name in it "});
    if(typeof address.city!="string") return res.status(404).send({status:false,message:"addresss must have city in  string form "});


    if(!address.pincode) return res.status(404).send({status:false,message:"address  must have pincode in it "});
    if(typeof address.pincode!="string") return res.status(404).send({status:false,message:"addresss must have pincode  in  string form "});
     
    let makeUser=await userModel.create(data);

    return res.status(201).send({status:true,data:makeUser})
    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
};


const loginUser=async function(req,res){
   try{ 
    const email=req.body.email;
    const password=req.body.password;
    if(!email) return res.status(404).send({status:false,message:"email must be present"});
    if(!password) return res.status(404).send({status:false,message:"password must be present"});
  

    let findUser=await userModel.findOne({email:email,password:password});

    if(!findUser) return res.status(404).send({status:false,message:"no user found"});

    let token=jwt.sign({userId:findUser._id.toString()},"group10project",{ expiresIn: '30s' });

    res.setHeader("x-api-key",token);

    return res.status(200).send({status:true,data:token})
   }
   catch(error){
    
    return res.status(500).send({status:false,message:error.message})

   }

}

module.exports={creatUser,loginUser};


// event loop ,settimeout,node js arcetecture,closer,promise,core modules in node and main module,even emmiter,mongo transition