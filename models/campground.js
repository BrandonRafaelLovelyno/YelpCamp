const mongoose=require('mongoose')
const Schema=mongoose.Schema
const Review=require('./review')

const imageSchema=new Schema({
    url:String,
    fileName:String,    
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

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
    location:String,
    images:[imageSchema],
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }],
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
})


campgroundSchema.post('findOneAndDelete', async (campground)=>{
    if(campground){
        const deleted=await Review.deleteMany({_id:{$in:campground.reviews}})
    }
})

module.exports=mongoose.model('Campground',campgroundSchema)