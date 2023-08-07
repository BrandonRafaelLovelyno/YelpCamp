const {campgroundSchema,reviewSchema}=require('./validationSchema')
const ExpressError = require('./utils/ExpressError')
const Campground=require('./models/campground')
const Review=require('./models/review')

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.user){
        req.flash('error','You have to be signed in')
        req.session.returnTo=req.originalUrl
        console.log(req.session.returnTo,'isLoggedin done')
        return res.redirect('/login')
    }else{
        next()
    }
}

module.exports.storeReturnTo=(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo=req.session.returnTo
        console.log(res.locals.return,'store function done')
    }
    next()
}

module.exports.isCurrentUserCamp=async (req,res,next)=>{
    const {id}=req.params
    const campground=await Campground.findById(id)
    if(!req.user._id.equals(campground.author._id)){
        req.flash('error','Do not have the permission')
        res.redirect(`/campgrounds/${req.params.id}`)
    }else{
        next()
    }
}

module.exports.validateCampground=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body)
    if(error){
        const msg=error.details.map(obj=>obj.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

module.exports.isCurrentUserReview=async(req,res,next)=>{
    const {reviewId}=req.params
    const review=await Review.findById(reviewId)
    if(!req.user||!req.user._id.equals(review.author._id)){
        req.flash('error','Do not have the permission')
        res.redirect(`/campgrounds/${req.params.id}`)
    }else{
        next()
    }
}

module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body)
    if(error){
        const msg=error.details.map(obj=>obj.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}