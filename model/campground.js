const mongoose=require('mongoose')
const Schema=mongoose.Schema

const campgroundSchema= new Schema({
    title:{
        type:String,
    },
    price:{
        type:Number,
        min:0,
    },
    description:{
        type:String,
    },
    location:{
        type:String,
    },
    image:{
        type:String,
    },
})

module.exports=mongoose.model('Campground',campgroundSchema)