const oracledb = require('oracledb');

const dbConfig = {
    user: 'c##bookstore',
    password: 'bookstore',
    connectString: 'localhost:1521/ORCL' // Format: 'hostname:port/service_name'
};

const savedatatodatabase = async (req, res) => {
    try {
        let connection;

        // Connect to Oracle Database
        connection = await oracledb.getConnection(dbConfig);
        console.log("New doctor hit");

        // Create a user
        const newDoc = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.gender,
            contactNumber: req.body.contactNumber,
            address: req.body.address,
            emailAddress: req.body.emailAddress,
            chamberAddress: req.body.chamberAddress,
            hospitalName: req.body.hospitalName,
            consultationFee: req.body.consultationFee,
            followupFee: req.body.followupFee,
            password: req.body.password
        };

        // Insert doctor data into the Doctor table
        const result = await connection.execute(
            `INSERT INTO DOCTOR
            (firstname, lastname, dateOfBirth, gender, contactNumber, address, emailAddress,chamberAddress,hospitalName,consultationFee,followupFee,password) 
            VALUES 
            (:firstname, :lastname, TO_DATE(:dateOfBirth, 'YYYY-MM-DD'), :gender, :contactNumber, :address, :emailAddress, :chamberAddress,:hospitalName,:consultationFee, :followupFee, ora_hash(:password))`,
            newDoc
        );
        // Commit the transaction
        // Retrieve the DoctorID using the PL/SQL function
        const email = newDoc.emailAddress;
        const doctorIdResult = await connection.execute(
            `BEGIN
                 :doctorId := get_doctor_id(:email);
             END;`,
            {
                doctorId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
                email: email
            }
        );

        const doctorId = doctorIdResult.outBinds.doctorId;

        if (doctorId === null) {
            // Handle case where email address is not found (valid case)
            console.log("Email address is unique.");
        } else if (doctorId === -1) {
            // Handle case where email address is not unique (constraint violation)
            console.log("Email address is not unique. Please choose another.");
            // Optionally, you can redirect the user back to the signup page
            res.redirect('/doclog/docsignup');
            return; // Stop further execution
        } else {
            // Insert into DoctorSpecialty using the retrieved DoctorID and specialty from req.body
            const specialty = req.body.specialty; // Assuming specialty is obtained from the form
            const specialtyResult = await connection.execute(
                `INSERT INTO DoctorSpecialty (DoctorID, NAME) VALUES (:doctorId, :specialty)`,
                {
                    doctorId: doctorId,
                    specialty: specialty
                }
            );
            console.log("Doctor specialty inserted:", specialtyResult.rowsAffected);

            // Insert into DoctorSchedule using the retrieved DoctorID and other schedule details
            // const scheduleResult = await connection.execute(
            //     `INSERT INTO DoctorSchedule
            //     (DoctorID, Day, StartTime, EndTime, Capacity, Patient)
            //     VALUES
            //     (:doctorId, TO_DATE(:day, 'YYYY-MM-DD'), :starttime, :endtime, :capacity, :patient)`,
            //     {
            //         doctorId: doctorId,
            //         day: req.body.day,
            //         starttime: req.body.starttime,
            //         endtime: req.body.endtime,
            //         capacity: req.body.capacity,
            //         patient: req.body.patient,            
            //         //status: req.body.status
            //     }
            // );
            // console.log("Doctor schedule inserted:", scheduleResult.rowsAffected);
        }
        await connection.commit();
        await connection.close();

        // Redirect to a landing page after successful signup
        res.redirect('/doclog/login');
    } catch (error) {
        console.error(error);
        //res.status(500).json({ error: 'Internal Server Error' });
        res.redirect('/doclog/signup');
    }
};


const loadsignuppage = (req,res) => {
    //res.render('docsignup');
    //console.log("hello");
  //  res.render('signup');
  res.render('docsignup');
}

module.exports = {
    loadsignuppage,
    savedatatodatabase

}