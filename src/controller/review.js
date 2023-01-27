const review = require("../model/reviewModel");
const bookModel=require("../model/bookmodel")
const validator = require("../validator/validator");
const mongoose=require("mongoose");
const  {isValidObjectId}=require("mongoose");
const { updateBook } = require("./bookController");
const reviewModel = require("../model/reviewModel");
const bookmodel = require("../model/bookmodel");

const creatReview=async function(req,res){
   try{

    if(!req.body.bookId) {req.body.bookId=req.params.bookId}
    if(!req.body.reviewedAt) {req.body.reviewedAt= Date.now()}
   
    let bookID=req.params.bookId;
    if(!isValidObjectId(bookID)) return res.status(400).send({status:false,message:"please provide valid userId"});


    let findId=await bookModel.findOne({_id:bookID});
    if(findId.isDeleted==true) return res.status(400).send({status:false,message:"book already deleted"});

    if(!findId) return res.status(400).send({status:false,message:"book not found"})

     let data=req.body
    
    let {review, rating, reviewedBy}=data;
  
    if(reviewedBy){
         if( typeof reviewedBy!="string" || reviewedBy == "")  return res.status(400).send({status:false,message:"please provide proper reviwed by"});
         if(!validator.isValidateName(reviewedBy) )return res.status(400).send({status:false,message:"please provide a valid name" })
    };
 
    if(!rating||typeof rating!="number")  return res.status(400).send({status:false,message:"please provide proper rating"});
    if(rating<1|| rating>5) return res.status(400).send({status:false,message:"please provide rating between 1 to 5"});
    
    

    if(review){
        if(typeof review !="string"|| review=="") return res.status(400).send({status:false,message:"please provide proper review"})

    }; 

    
    let updateReviews=await bookModel.findOneAndUpdate({_id:bookID,isDeleted:false},{$inc:{reviews:1}},{new:true}).lean();
    let reviewDetails= await reviewModel.create(data);

      //let findReviews= await reviewModel.find({bookId:bookID});///ask about if we nneed to add duplicacy for one user can give reviews one time only;
    updateReviews.reviewDetails=reviewDetails;

    return res.send({status:true,data:updateReviews})}
    catch{
        res.status(500).send(error.message)
      }

};

const updateReviews=async function (req,res){
   try{ let bookId=req.params.bookId;
    let reviewId=req.params.reviewId;

    bookId=bookId.trim();
    reviewId=reviewId.trim()
    if(!isValidObjectId(bookId)) return res.status(400).send({status:false,message:"please provide valid userId"});
    if(!isValidObjectId(reviewId)) return res.status(400).send({status:false,message:"please provide valid review id"});
     
    
    let data=req.body
    let {review, rating,reviewedBy } = data;
    
    if(review){
        if(typeof review !="string"|| review=="") return res.status(400).send({status:false,message:"please provide proper review"});
        
        
   }
   if(rating){
    if(!rating||typeof rating!="number")  return res.status(400).send({status:false,message:"please provide proper rating"});
    if(rating<1|| rating>5) return res.status(400).send({status:false,message:"please provide rating between 1 to 5"});
    
   }
  if(reviewedBy){
    if( typeof reviewedBy!="string" || reviewedBy == "")  return res.status(400).send({status:false,message:"please provide proper reviwed by"});
    if(!validator.isValidateName(reviewedBy) )return res.status(400).send({status:false,message:"please provide a valid name" });
    
  }
  let findBook=await bookModel.findOne({_id:bookId,isDeleted:false}).lean();
    if(findBook.isDeleted==true) return res.status(400).send({status:false,message:"book is already deleted"});
    if(!findBook)  return res.status(400).send({status:false,message:"book didn' exsist"})

    let findReview= await reviewModel.findOneAndUpdate({_id:reviewId,isDeleted:false},data,{new:true});
    if(findReview.isDeleted==true) return res.status(400).send({status:false,message:"book is already deleted"});
    if(!findReview)return res.status(404).send({status:false,message:"review not found not found"});

    let reviewedData=await reviewModel.find({bookId:bookId})


  findBook.reviewData=reviewedData
  return res.status(200).send({status:true,data:findBook})}
  catch{
    res.status(500).send(error.message)
  }


};
const deleteReview = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        const reviewId = req.params.reviewId

        if(!isValidObjectId(bookId)) return res.status(400).send({status:false,message:"please provide valid book Id"});
        if(!isValidObjectId(reviewId)) return res.status(400).send({status:false,message:"please provide valid review Id"});

        const searchBook = await bookModel.findById({ _id: bookId, isDeleted: false })

        if (!searchBook) return res.status(400).send({ status: false, message: `Book does not exist by this ${bookId}.` })
        
        
        const searchReview = await reviewModel.findById({ _id:reviewId})
        if (!searchReview)  return res.status(400).send({ status: false, message: `Review does not exist by this ${reviewId}.` })
        
      const deleteReviewDetails = await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true, deletedAt: Date.now() }, {new: true })
            await bookModel.findOneAndUpdate({ _id: bookId },{$inc:{ reviews: -1 }})
                
            return res.status(200).send({ status: true, message: "Review deleted successfully."})

                   }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}

module.exports={creatReview,updateReviews,deleteReview}
// bookId: {ObjectId, mandatory, refs to book model},
// reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
// reviewedAt: {Date, mandatory},
// rating: {number, min 1, max 5, mandatory},
// review: {string, optional}
// isDeleted: {boolean, default: false},
