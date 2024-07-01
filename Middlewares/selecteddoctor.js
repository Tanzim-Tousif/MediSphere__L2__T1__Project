const query = require('../Database/DB-specified-doctors');
const selecteddoctor = async(req,res,next) => {
    console.log(req.params.id);
    
    const result = await query.getdoctorsbyid(req.params.id);
    console.log(result.rows)
    res.render('DoctorDetails',{
        name:result.rows,
        user:req.session.user
    })
}

module.exports = selecteddoctor;