const express=require('express')
const routes=express.Router({mergeParams:true})
const Campground = require('../models/campground')
const Review=require('../models/review')
const wrapAsync=require('../utils/wrapAsync')
const ExpressError = require('../utils/ExpressError')
const {reviewSchema}=require('../validationSchema')


const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body)
    if(error){
        const msg=error.details.map(obj=>obj.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

routes.post('/',validateReview,wrapAsync(async (req,res)=>{
    const campground=await Campground.findById(req.params.id)
    const review=new Review(req.body.review)
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    req.flash('success','Review created')
    res.redirect( `/campgrounds/${campground._id}`)
}))

routes.delete('/:reviewId',wrapAsync(async (req,res)=>{
    const {id,reviewId}=req.params
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndRemove(reviewId)
    req.flash('success','Review deleted')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports=routes