const { min } = require('lodash');
const appoinmenttime = require('../Database/appointmenttime')
const appoinments = async(req,res,next) => {
    //console.log(req.params.id);
    //console.log(req.query.date)
    const alldateth = await appoinmenttime.getalldateth(req.params.id);
    const alldate = await appoinmenttime.getalldate(req.params.id)
    //console.log(alldate.rows);
    var mindate;
    if(req.query.date == ''){
        console.log("her")
         mindate = await appoinmenttime.getminimumappointmentdate(req.params.id);
        console.log((mindate.rows[0].MDAY));
        const result = await appoinmenttime.getalltime(req.params.id,mindate.rows[0].MDAY);
       // console.log(alldate.rows);

        res.render('appoinments',{
            name:result.rows,
            user:req.session.user,
            days:alldateth.rows,
            days1:alldate.rows,
            appointmentrenderdate:mindate.rows[0].MDAY
        });
    }
    else{
        console.log("here i am")
        mindate = req.query.date;
        console.log(mindate)
        const result = await appoinmenttime.getalltime(req.params.id,mindate);
        console.log(alldate.rows);

        res.render('appoinments',{
            name:result.rows,
            user:req.session.user,
            days:alldateth.rows,
            days1:alldate.rows,
            appointmentrenderdate:mindate
        });
    }
          
    

}

module.exports = appoinments;