const express = require('express')
const Campground = require('./models/campground')
const Review=require('./models/review')
const mongoose = require('mongoose')
const methodOverride=require('method-override')
const app=express()
const ejsMate=require('ejs-mate')
const wrapAsync=require('./utils/wrapAsync')
const ExpressError = require('./utils/ExpressError')
const {campgroundSchema,reviewSchema}=require('./validationSchema')

const validateCampground=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body)
    if(error){
        const msg=error.details.map(obj=>obj.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body)
    if(error){
        const msg=error.details.map(obj=>obj.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

const db=mongoose.connection
db.on('error',console.error.bind(console,'connection error:'))
db.once('open',()=>{
    console.log('connected to mongosh')
})

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views','views')

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

app.listen(3000,()=>{
    console.log('Listening to port 3000')
})

app.get('/campgrounds',wrapAsync(async (req,res,next)=>{
    const campgrounds=await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}))

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id',wrapAsync(async (req,res,next)=>{
    const campground= await Campground.findById(req.params.id).populate('reviews')
    console.log(campground)
    res.render('campgrounds/show',{campground})
}))

app.get('/campgrounds/:id/edit',wrapAsync(async (req,res,next)=>{
    const {id}=req.params
    const campground=await Campground.findById(id)
    res.render('campgrounds/edit',{campground})
}))

app.post('/campgrounds',validateCampground,wrapAsync(async (req,res,next)=>{
    const {title,location,price,description,image}=req.body.campground
    const c= new Campground({title:title,location:location,price:price,image:image,description:description})
    await c.save()
    res.redirect(`/campgrounds/${c._id}`)
}))

app.post('/campgrounds/:id/reviews',validateReview,wrapAsync(async (req,res)=>{
    const campground=await Campground.findById(req.params.id)
    const review=new Review(req.body.review)
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    res.redirect( `/campgrounds/${campground._id}`)
}))

app.put('/campgrounds/:id',validateCampground,wrapAsync(async(req,res)=>{
    const {title,location,price,description,image}=req.body.campground
    const {id}=req.params
    await Campground.findByIdAndUpdate(id,{title:title,location:location,price:price,image:image,description:description})
    res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id', wrapAsync(async (req,res,next)=>{
    const {id}=req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

app.delete('/campgrounds/:campId/reviews/:reviewId',wrapAsync(async (req,res)=>{
    const {campId,reviewId}=req.params
    await Campground.findByIdAndUpdate(campId,{$pull:{reviews:reviewId}})
    await Review.findByIdAndRemove(reviewId)
    res.redirect(`/campgrounds/${campId}`)
}))

app.use((res,req,next)=>{
    next(new ExpressError('Page not found',404))
})

app.use((err,req,res,next)=>{
    res.render('error',{err})
})
