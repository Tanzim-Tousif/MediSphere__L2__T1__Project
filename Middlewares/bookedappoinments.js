const appoinments = require('../Database/appointmenttime');
const oracledb = require('oracledb');

// function to get id from email
const dbConfig = {
   user: 'c##bookstore',
   password: 'bookstore',
   connectString: 'localhost:1521/ORCL'
};

const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
    autoCommit: true, // Automatically commit the transaction
};

const bookedappoinment = async (req, res, next) => {
    console.log("here we are");
    await appoinments.updatebookedslot(req.body.id, req.body.starttime, req.body.endtime, req.body.status, req.body.day);
    await appoinments.insertinappointmenttable(req.body.schedule, req.body.patientid, req.body.patient);
    console.log(req.body);
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        var sql = `
        SELECT (FIRSTNAME || ' ' || LASTNAME) AS NAME, CONTACTNUMBER FROM PATIENT where patientid = :id
        `;
        var binds = {
            id: req.body.patientid
        };
        const patient = await connection.execute(sql, binds, options);
        sql = `
        SELECT (FIRSTNAME || ' ' || LASTNAME) AS NAME, consultationfee as fee,chamberaddress FROM doctor		 
        where doctorid = :id
        `;
        binds = {
            id: req.body.id
        }
        const doctor = await connection.execute(sql, binds, options);
       // await connection.close();
        const appoinment = {
            date: req.body.day,
            starttime: req.body.starttime,
            endtime: req.body.endtime,
            serial: req.body.patient
        }

       res.redirect(`/appointments/confirmation?patient=${JSON.stringify(patient.rows[0])}&doctor=${JSON.stringify(doctor.rows[0])}&appointment=${JSON.stringify(appoinment)}`)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

module.exports = bookedappoinment;
