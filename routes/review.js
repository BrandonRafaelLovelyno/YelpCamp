const express=require('express')
const router=express.Router({mergeParams:true})
const review=require('../controllers/review')
const wrapAsync=require('../utils/wrapAsync')
const {validateReview,isLoggedIn, isCurrentUserReview}=require('../middleware')

router.post('/',isLoggedIn,validateReview,wrapAsync(review.createReview))

router.delete('/:reviewId',isLoggedIn,isCurrentUserReview,wrapAsync(review.deleteReview))

module.exports=router