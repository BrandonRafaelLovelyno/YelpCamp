const Campground = require('../models/campground')


module.exports.index=async (req,res,next)=>{
    const campgrounds=await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/new')
}

module.exports.showDetail=async (req,res,next)=>{
    const campground= await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        },
    }).populate({path:'author'})
    if(!campground){
        req.flash('error','Cannot find campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}

module.exports.renderEditForm=async (req,res,next)=>{
    const {id}=req.params
    const campground=await Campground.findById(id)
    if(!campground){
        req.flash('error','Cannot find campground')
        return res.render('/')
    }
    res.render('campgrounds/edit',{campground})
}

module.exports.createCampground=async (req,res,next)=>{
    const {title,location,price,description,image,}=req.body.campground
    const c= new Campground({title:title,location:location,price:price,image:image,description:description})
    c.author=req.user._id
    await c.save()
    req.flash('success','Successfuly made the campground')
    res.redirect(`/campgrounds/${c._id}`)
}

module.exports.editCampground=async(req,res)=>{
    const {title,location,price,description,image}=req.body.campground
    const {id}=req.params
    await Campground.findByIdAndUpdate(id,{title:title,location:location,price:price,image:image,description:description})
    req.flash('success','Campground edited')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground=async (req,res,next)=>{
    const {id}=req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Campground deleted')
    res.redirect('/campgrounds')
}