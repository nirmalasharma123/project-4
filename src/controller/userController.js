const userModel=require("../model/usermodel");
const jwt=require("jsonwebtoken");
const validator=require("../validator/validator");
const valid=require("validator");

const creatUser= async function(req,res){

    try {let data=req.body;
        
    let {title,name,phone,email,password,address}=data;

    if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"Please provide details"});
    
    if(!title) return res.status(404).send({status:false,message:"please provide title"});

    if(!(["Mr", "Mrs", "Miss"].includes(title))) return res.status(404).send({status:false,message:"please provide valid title  like Mr,Miss,Mrs"});

    if(!name || !validator.isValid(name)) return res.status(404).send({status:false,message:"please provide Proper name"});
    if(!validator.isValidateName(name) )return res.status(404).send({status:false,message:"please provide a valid name" });
      
    if(!phone || !validator.isValid(phone)) return res.status(404).send({status:false,message:"please provide phone no"});
    if(!validator.isValidMobile(phone)) return res.status(404).send({status:false,message:"please provide Proper phone no must be 10 digit"});
    
    if(!email) return res.status(404).send({status:false,message:"please provide email "});
    if(!valid.isEmail(email))  return res.status(404).send({status:false,message:"please provide Valid email no"});
    
    let findNumber= await userModel.findOne({phone:phone});
    if(findNumber) return res.status(404).send({status:false,message:"phone no already present"});

    let findEmail=await userModel.findOne({email:email})
    if(findEmail) return res.status(404).send({status:false,message:"email no already present"});

    if(!password) return res.status(404).send({status:false,message:"password is mendatory"});
    if(!validator.isValidPassword(password)) return res.status(404).send({status:false,message:"password should be minimum 8 letters and max 15 letter and should conatin one special character"});
     
    if(!address) return  res.status(400).send({msg:"address is mendatory"})
    
    
    if(!address.street || !validator.isValid(address.street))return res.status(404).send({status:false,message:"addresss must have street no in it"});
    if(typeof address.street!="string") return res.status(404).send({status:false,message:"addresss must have street  in  string form "});

    if(!address.city || !validator.isValid(address.city) ) return res.status(404).send({status:false,message:"address must have city name in it "});
    if(typeof address.city!="string") return res.status(404).send({status:false,message:"addresss must have city in  string form "});


    if(!address.pincode || !validator.isValid(address.pincode)) return res.status(404).send({status:false,message:"address  must have pincode in it "});
    if(typeof address.pincode!="string") return res.status(404).send({status:false,message:"addresss must have pincode  in  string form "});
     
    let makeUser=await userModel.create(data);

    return res.status(201).send({status:true,data:makeUser})
    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
};



// user LOGIN

const loginUser=async function(req,res){
   try{ 

    let email=req.body.email;
    let password=req.body.password;

    if(!email || !validator.isValid(email)) return res.status(404).send({status:false,message:"email must be present"});
   
    if(!password) return res.status(404).send({status:false,message:"password must be present"});

    let findUser=await userModel.findOne({email:email,password:password});

    if(!findUser) return res.status(404).send({status:false,message:"email or password may be incorrect"});

    let token=jwt.sign({userId:findUser._id.toString() },"group10project",{ expiresIn: '30m' });

    res.setHeader("x-api-key",token);

    return res.status(200).send({status:true,data:token})

   }
   catch(error){
    return res.status(500).send({status:false,message:error.message})

   }

}



module.exports={creatUser,loginUser};


 