const express=require('express')
const router=express.Router()
const wrapAsync=require('../utils/wrapAsync')
const passport=require('passport')
const {storeReturnTo}=require('../middleware')
const user=require('../controllers/user')

router.route('/register')
    .get(user.renderRegisterForm)
    .post(wrapAsync(user.register))

router.route('/login')
    .get(user.renderLoginForm)
    .post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),wrapAsync(user.login))

module.exports=router