const express = require('express')
const router=express.Router()
const campground=require('../controllers/campground')
const wrapAsync=require('../utils/wrapAsync')
const {isLoggedIn,isCurrentUserCamp,validateCampground}=require('../middleware')


router.route('/')
    .get(wrapAsync(campground.index))
    .post(isLoggedIn,validateCampground,wrapAsync(campground.createCampground))

router.get('/new',isLoggedIn,campground.renderNewForm)

router.route('/:id')
    .get(wrapAsync(campground.showDetail))
    .put(isLoggedIn,isCurrentUserCamp,validateCampground,wrapAsync(campground.editCampground))
    .delete(isLoggedIn,wrapAsync(isCurrentUserCamp),wrapAsync(campground.deleteCampground))

router.get('/:id/edit',isLoggedIn,isCurrentUserCamp,wrapAsync(campground.renderEditForm))

module.exports=router