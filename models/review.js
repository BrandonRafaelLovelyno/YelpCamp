const mongoose=require('mongoose')
const Schema=mongoose.Schema

const reviewSchema=new Schema({
    text:{
        type:String,
    },
    rating:{
        type:Number,
    }
})

module.exports=mongoose.model('Review',reviewSchema)