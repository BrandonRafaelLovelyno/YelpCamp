const {campgroundSchema,reviewSchema}=require('./validationSchema')
const ExpressError = require('./utils/ExpressError')

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

module.exports.isCurrentUserCamp=(req,res,next)=>{
    if(!req.user._id.equals(req.params.id)){
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

module.exports.isCurrentUserReview=(req,res,next)=>{
    if(!req.user||!req.user._id.equals(req.params.reviewId)){
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