const landingcontroller = (req,res,next) => {
    req.session.user = null;
    res.render('landingpage',{
        user:req.session.user
    });
}


module.exports = landingcontroller;