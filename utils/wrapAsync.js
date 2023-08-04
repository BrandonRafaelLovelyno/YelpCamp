module.exports=function (fn){
    return function (req,res,next){
        fn(req,res,next).catch(e=>{
            console.log('async error caught')
            return next(e)
        })
    }
} 