const consultation = (req,res,next) => {
    res.render('rename',{
        user:req.session.user
    });
}

module.exports = consultation;