const bookModel=require("../model/bookmodel");
const validator=require("../validator/validator");
const userModel=require("../model/usermodel")
const mongoose=require("mongoose");
//const objectId = mongoose.Schema.Types.ObjectId;
const  {isValidObjectId}=require("mongoose");
const reviewModel=require("../model/reviewModel")

const creatBooks=async function(req,res){
try{
  let data=req.body;
  data.userId=data.userId.trim()
  let{title,excerpt,userId,ISBN,category,subcategory,reviews}=data;

  
  if( typeof (title  && excerpt && userId  && ISBN &&category && subcategory )!="string") return res.status.send({status:false,message:"details should be in string"});

  if(!title)  return res.status(404).send({status:false,message:"please provide title"});
  let findTitle=await bookModel.findOne({title:title});
  if(findTitle) return res.status(404).send({status:false,message:"please put a unique title"});

  if(!excerpt) return res.status(404).send({status:false,message:"please provide excerpt"});

  if(!userId) return res.status(404).send({status:false,message:"please provide userId"});
  
  if(!isValidObjectId(userId)) return res.status(404).send({status:false,message:"please provide valid userId"});
  const checkUser = await userModel.findById(userId)
   if(!checkUser) return res.status(404).send({status:false,message:"can't find user id"});

  if(!ISBN) return res.status(404).send({status:false,message:"please provide ISBN"});
  if(!validator.isbnValidator(ISBN)) return res.status(404).send({status:false,message:"please provide valid ISBN"});

  const checkisbnNo=await bookModel.findOne({ISBN:ISBN});
  if(checkisbnNo) return res.status(404).send({status:false,message:"ISBN already exsist"});
  
  if(!category) return res.status(400).send({ status : false , message : "Category must be present"});

  if(!subcategory) return res.status(400).send({ status : false , message : "subategory must be present"});


  if(!reviews) return res.status(400).send({ status : false , message : "review must be present"});
  if(typeof reviews!="number") return res.status(400).send({ status : false , message : "review must be in number"})

  const books=await bookModel.create(data);

  return res.status(201).send({status:true,data:books})}
  catch(error){

    return res.status(500).send({status:false,message:error.message})

 
  }
};

const getBooks = async function(req,res){
  data = req.query

  filterData ={ isDeleted:false }

  const {userId,category,subcategory} = data

  if(userId){
    filterData.userId= userId
  }
  if(category){
    filterData.category= category
  }

  if(subcategory){
    filterData.subcategory= subcategory
  }

  let getDetails = await bookModel.find(filterData).select({_id:1,title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1})

   if(getDetails.length == 0){
    return res.status(404).send({status:false,msg:"No data Found"})
   }
  return res.status(200).send({status:true,data:getDetails})


};
const getBookByparams= async function(req,res){
try{
  let bookId = req.params.bookId
  if(!bookId) return res.status(400).send({msg:"please enter bookId"});

  
  if(!mongoose.isValidObjectId(bookId)) return res.status(400).send({status:false,msg:"please enter valid bookId"})
  
  let findBook = await bookModel.findOne({_id:bookId,isDeleted:false}).lean()
  
  if(!findBook) return res.status(404).send({msg:"no book exist with this bookId"})
  
  let findReview = await reviewModel.find({bookId:bookId,isDeleted:false})
  
  findBook.reviewsData = findReview
  
  return res.status(200).send({status: true, data :findBook})
}catch(error){

  return res.status(500).send({status:false,message:error.message})
}
  

  }



const updateBook = async function(req,res){
  try{
    let bookId=req.params.bookId;
    if(!isValidObjectId(bookId)) return res.status(404).send({status:false,message:"please provide valid bookId"});
    let data=req.body;
    let {title,excerpt,releasedAt, ISBN} = data;

    if(Object.keys(data).length==0) return res.status(404).send({status:false,message:"please provide detail for updation"});

    let findBook=await bookModel.findOne({_id:bookId,isDeleted:false});
    if(findBook.isDeleted==true) return res.status(404).send({status:false,message:"book is already deleted"})
    if(!findBook) return res.status(404).send({status:false,message:"book not found"});

    if(title) { 
         if( typeof title!="string") return res.status(404).send({status:false,message:"please provide title in string"})
         let findTitle= await bookModel.findOne({title:title});
         if(findTitle) return res.status(404).send({status:false,message:"please put a unique title"})
           
         data.title=title;

          }

      if(excerpt){
        if( typeof excerpt!="string") return res.status(404).send({status:false,message:"please provide excerpt in string"});
        data.excerpt=excerpt;
      }
      if(ISBN){
        if( typeof ISBN!="string") return res.status(404).send({status:false,message:"please provide ISBN in string"});
        if(!validator.isbnValidator(ISBN)) return res.status(404).send({status:false,message:"please provide valid ISBN"});
        const checkisbnNo=await bookModel.findOne({ISBN:ISBN});
         if(checkisbnNo) return res.status(404).send({status:false,message:"ISBN already exsist"});

      };
      if(releasedAt){
        data.releasedAt=Date.now();
      }
      let newUpdatedBook=  await bookModel.findOneAndUpdate({_id:bookId},data,{new:true});

      return res.status(200).send({status:true,data:newUpdatedBook});


  }
  catch{

  }
}

const deleteParam = async function(req, res) {
  try {
      let id = req.params.bookId ;
      let findBook = await bookModel.findById(id);
      if (findBook == null) return res.status(404).send({ status: false, msg: "not found" })

      if (findBook.isDeleted == true) return res.status(404).send({status:false,message:"book is already deleted"});
      
      
      let bookToDeleate = await bookModel.findByIdAndUpdate({_id:findBook._id}, { isDeleted: true, deletedAt: Date.now() }, { new: true })
      
      return res.status(200).send({ status: true, message:"blog is sucessfully deleted" })
           

  } catch (error) {
      res.status(500).send(error.message)
}
}

module.exports={creatBooks,getBooks,updateBook,deleteParam,getBookByparams};