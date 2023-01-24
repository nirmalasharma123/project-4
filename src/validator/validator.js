const isValidateName = function(name){
    const regex = /^([a-z  A-Z ]){2,50}$/
    return regex.test(name)
} ;
const isValidMobile = function (name) {
    const validName = /^[6-9]{1}[0-9]{9}$/;
    return validName.test(name);
  };

  const isValidPassword = (value) => {
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/  
    return passRegex.test(value)
};
const isbnValidator=function(ISBN){
    const isbn=/^(?:\D*\d){10}(?:(?:\D*\d){3})$/
    //const isbn=/^[0-9 ignour "-"]{10,13}$/
    return isbn.test(ISBN)
}

//const email= fuction()

module.exports={isValidateName,isValidMobile,isValidPassword,isbnValidator}