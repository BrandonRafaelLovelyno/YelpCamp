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