const express = require('express')
const Campground = require('./model/campground')
const mongoose = require('mongoose')
const methodOverride=require('method-override')
const app=express()
const ejsMate=require('ejs-mate')

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

app.get('/campgrounds',async (req,res)=>{
    const campgrounds=await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
})

app.get('/campgrounds/new',async (req,res)=>{
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id',async (req,res)=>{
    const campground= await Campground.findById(req.params.id)
    res.render('campgrounds/show',{campground})
})

app.get('/campgrounds/:id/edit',async (req,res)=>{
    const {id}=req.params
    const campground=await Campground.findById(id)
    res.render('campgrounds/edit',{campground})
})

app.post('/campgrounds',async (req,res)=>{
    console.log('post request',req.body.campground)
    const {title,location,price,description,image}=req.body.campground
    const c= new Campground({title:title,location:location,price:price,image:image,description:description})
    await c.save()
    res.redirect(`/campgrounds/${c._id}`)
})

app.put('/campgrounds/:id',async(req,res)=>{
    const {title,location,price,description,image}=req.body.campground
    const {id}=req.params
    await Campground.findByIdAndUpdate(id,{title:title,location:location,price:price,image:image,description:description})
    res.redirect(`/campgrounds/${id}`)
})

app.delete('/campgrounds/:id', async (req,res)=>{
    const {id}=req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

