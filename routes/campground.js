const express = require('express')
const routes=express.Router()
const Campground = require('../models/campground')
const ExpressError = require('../utils/ExpressError')
const {campgroundSchema}=require('../validationSchema')
const wrapAsync=require('../utils/wrapAsync')
const {isLoggedIn}=require('../middleware')

const validateCampground=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body)
    if(error){
        const msg=error.details.map(obj=>obj.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

routes.get('/',wrapAsync(async (req,res,next)=>{
    const campgrounds=await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}))

routes.get('/new',isLoggedIn,(req,res)=>{
    res.render('campgrounds/new')
})

routes.get('/:id',wrapAsync(async (req,res,next)=>{
    const campground= await Campground.findById(req.params.id).populate('reviews')
    console.log(campground)
    if(!campground){
        req.flash('error','Cannot find campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}))

routes.get('/:id/edit',isLoggedIn,wrapAsync(async (req,res,next)=>{
    const {id}=req.params
    const campground=await Campground.findById(id)
    if(!campground){
        req.flash('error','Cannot find campground')
        return res.render('/')
    }
    res.render('campgrounds/edit',{campground})
}))

routes.post('/',isLoggedIn,validateCampground,wrapAsync(async (req,res,next)=>{
    const {title,location,price,description,image}=req.body.campground
    const c= new Campground({title:title,location:location,price:price,image:image,description:description})
    await c.save()
    req.flash('success','Successfuly made the campground')
    res.redirect(`/campgrounds/${c._id}`)
}))

routes.put('/:id',isLoggedIn,validateCampground,wrapAsync(async(req,res)=>{
    const {title,location,price,description,image}=req.body.campground
    const {id}=req.params
    await Campground.findByIdAndUpdate(id,{title:title,location:location,price:price,image:image,description:description})
    req.flash('success','Campground edited')
    res.redirect(`/campgrounds/${id}`)
}))

routes.delete('/:id',isLoggedIn,wrapAsync(async (req,res,next)=>{
    const {id}=req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Campground deleted')
    res.redirect('/campgrounds')
}))

module.exports=routes