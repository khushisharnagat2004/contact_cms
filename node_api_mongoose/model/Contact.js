const mongoose=require('mongoose');

const contactSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        maxlength:[50,'Name cannot be more than 50 chars'],
        trim:true
    },
    phoneNo:{
        type:String,
        maxlength: [20, 'Phone number can not be longer than 20 characters'],
    },
    address: {
        type: String,
        required: [true, 'Please add an address'],
      },
    age:{
      type:Number,
      minlength:[1,'Age should not be less than 1'],
      maxlength:[100,'Age should not be greater than 100']  
    }  
});

module.exports=mongoose.model("Contact",contactSchema);