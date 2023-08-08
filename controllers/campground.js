const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary')


module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.showDetail = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        },
    }).populate({ path: 'author' })
    if (!campground) {
        req.flash('error', 'Cannot find campground')
        return res.redirect('/campgrounds')
    }
    const locationData=await fetch(`https://nominatim.openstreetmap.org/search?q=${campground.location}&format=json`)
    const locationJson=await locationData.json() 
    const latitude=locationJson[0].lat;
    const longitude=locationJson[0].lon;
    res.render('campgrounds/show', { campground,latitude,longitude})
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find campground')
        return res.render('/')
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.createCampground = async (req, res, next) => {
    const { title, location, price, description } = req.body.campground
    const c = new Campground({ title: title, location: location, price: price, description: description })
    c.images = req.files.map(img => ({ fileName: img.filename, url: img.path }))
    c.author = req.user._id
    await c.save()
    req.flash('success', 'Successfuly made the campground')
    res.redirect(`/campgrounds/${c._id}`)
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    //Fetching and adding uploaded image from the form
    const imgs = req.files.map(img => ({ url: img.path, fileName: img.filename }))
    campground.images.push(...imgs)
    //
    //Deleting the checked image from database, not cloudinary
    console.log(req.body.deleteImage)
    await campground.updateOne({ $pull: { images: { fileName: { $in: req.body.deleteImage } } } })
    //
    //Deleteing the checked image from cloudinary
    if (req.body.deleteImage) {
        req.body.deleteImage.forEach(deleted => {
            cloudinary.uploader.destroy(deleted)
        });
    }
    //
    await campground.save()
    req.flash('success', 'Campground edited')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params
    const campground=await Campground.findById(id)
    if(campground.images.length>0){
        await campground.images.forEach((img)=>{
            cloudinary.uploader.destroy(img.fileName)
        })
    }
    await campground.deleteOne()
    req.flash('success', 'Campground deleted')
    res.redirect('/campgrounds')
}