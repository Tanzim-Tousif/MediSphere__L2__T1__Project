const db_profile = require('../Database/dashboard')
const abc = require('../Database/patientappointments');
const { all, connect } = require('../Routes/landing');

oracledb = require('oracledb')

// function to get id from email
const dbConfig = {
   user: 'c##bookstore',
   password: 'bookstore',
   connectString: 'localhost:1521/ORCL'
 };

const dashboardcontroller =   async(req, res) => {
    try {
      const result = await db_profile.getprofile();
      const patient = result.rows[0];
      console.log("hre");
      console.log(patient);
      res.render('dashboard',{ patient});
    } catch (error) {
      console.error('Error fetching patient details:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  const upcoming_appointmentcontroller = async(req,res) => {
    //console.log(req.session.user.id);
    const resul = await abc.getupcomingappointments(req.session.user.id);
    console.log(resul.rows)
   // console.log()
        res.render('ptntupcmngappoint',{
          result:resul.rows
        })
  }


  const past_appointmentcontroller = async(req,res) => {
    //console.log(req.session.user.id);
    const resul = await abc.getpastcomingappointments(req.session.user.id);
    console.log(resul)
        res.render('ptntpastappointments',{
          result:resul.rows
        })
  }


  const deleteappointment =  async (req, res) => {
    try {
        const appointmentId = parseInt(req.params.appointmentId); // Ensure appointmentId is converted to a number
        const connection = await oracledb.getConnection(dbConfig);

        // Call the stored procedure to delete the appointment
        const procedureName = 'delete_appointment';
        const procedureParams = { p_appointment_id: { dir: oracledb.BIND_IN, val: appointmentId, type: oracledb.NUMBER } };
        await connection.execute(`BEGIN ${procedureName}(:p_appointment_id); END;`, procedureParams);
console.log("delete appointment");
        await connection.close();
        res.status(200).send({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        // Send error response
        res.status(500).send({ error: 'Error deleting appointment' });
    }
};



  const prescriptionss = async(req,res) => {
     const prescriptions = await abc.allprescriptions(req.session.user.id);
     res.render('allprescriptions.ejs', { prescriptions, userId: req.session.user.id });
    }
const downloadpres = async(req,res) => {
 const connection = await oracledb.getConnection(dbConfig)
  const prescription = await abc.getprescription(req.params.appointmentid);
  const tests = await abc.gettests(req.params.appointmentid);
  console.log(tests.rows)
 // const diagnostics = await abc.getdiagnostics(tests.rows);
  const suggestedTests = tests.rows.map(row => row.TEST_NAME);

var diagnosticCenters = [];
//   const suggestedTests = tests.rows.map(row => row[0]);
if(tests.rows.length > 0){
  const centerQuery = `
  SELECT distinct(d.NAME), d.ADDRESS, d.CONTACTNUMBER,d.DIAGNOSTICCENTERID
  FROM DIAGNOSTICCENTER d
  JOIN offeredtest ot ON d.DIAGNOSTICCENTERID = ot.DIAGNOSTICCENTERID
  WHERE ot.TESTNAME IN (${suggestedTests.map((test, index) => `:test${index}`).join(', ')})
  `;
       const centerResult = await connection.execute(centerQuery, suggestedTests);
       diagnosticCenters = centerResult.rows;
      console.log(diagnosticCenters);
       await connection.close();
}

  // res.render('downloadPres',{
  //   imageUrls:prescription.rows[0],
  //   suggestedTests:tests.rows,
  //   appointmentid:req.params.appointmentid,
  //   feedback:0,
  //   diagnosticCenters:diagnosticCenters
  // });

  res.render('downloadPres',{
    image:prescription.rows,
    tests:tests.rows,
    appointmentid:req.params.appointmentid,
    feedback:0,
    diagnosticCenters:diagnosticCenters
  });

}


const feedback = async(req, res) => {
  
  const rating = req.body.rating;
  const comment = req.body.comment;
  const additionalData1 = req.body.additionalData1;
  // Do something with the feedback data (e.g., save it to a database)
  connection = await oracledb.getConnection(dbConfig);

  const sql = `
  INSERT into review(RATING,COMMENTTEXT,APPOINTMENTID,GIVENDATE) values(:rating,:cmnt,:appointmentid,SYSDATE)
`;
 const binds = {
  rating:rating,
  cmnt:comment,
  appointmentid:additionalData1
 };
 const options = {
  outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
  autoCommit: true, // Automatically commit the transaction
};
  await connection.execute(sql, binds,options);
  await connection.commit();
  const prescription = await abc.getprescription(additionalData1);
  const tests = await abc.gettests(additionalData1);


  const suggestedTests = tests.rows.map(row => row.TESTNAME);

  var diagnosticCenters = [];
  //   const suggestedTests = tests.rows.map(row => row[0]);
  if(tests.rows.length > 0){
    const centerQuery = `
    SELECT d.NAME, d.ADDRESS, d.CONTACTNUMBER,d.DIAGNOSTICCENTERID
    FROM DIAGNOSTICCENTER d
    JOIN OFFEREDTEST ot ON d.DIAGNOSTICCENTERID = ot.DIAGNOSTICCENTERID
    WHERE ot.TESTNAME IN (${suggestedTests.map((test, index) => `:test${index}`).join(', ')})
    `;
         const centerResult = await connection.execute(centerQuery, suggestedTests);
         diagnosticCenters = centerResult.rows;
        console.log(diagnosticCenters);
         await connection.close();
  }


  res.render('downloadPres',{
    image:prescription.rows,
    tests:tests.rows,
    appointmentid:additionalData1,
    feedback:1,
    diagnosticCenters:diagnosticCenters
  });

};


const diagnosis = async(req,res) => {
  console.log("here")
  try {
    const connection = await oracledb.getConnection(dbConfig);
    // Query to fetch all columns from the PRESCRIPTION, APPOINTMENT, Doctor, and DoctorSchedule tables for the given user ID
    const query = `
    SELECT st.*, ap.*, TO_CHAR(ds.DAY,'DD-MON-YYYY') as day,DS.STARTTIME,DS.ENDTIME,d.*
    FROM SUGGESTED_TESTS st
    JOIN APPOINTMENT ap ON st.APPOINTMENTID = ap.APPOINTMENTID
    JOIN DOCTORSCHEDULE ds ON ds.SCHEDULEID = ap.SCHEDULEID
    JOIN DOCTOR d ON d.DOCTORID = ds.DOCTORID
    WHERE ap.PATIENTID = :userId
    `;
    const binds = {
      userId: req.session.user.id
    };
    // Define options for query execution
    const options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
      autoCommit: true // Automatically commit the transaction
    };
//console.log(userId);
    // Execute the query with binds and options
    const result = await connection.execute(query, binds, options);
    const diagnoses = result.rows;
console.log(result.rows);
    await connection.close();

    res.render('diagnosis.ejs', { diagnoses, userId: req.session.user.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while retrieving data');
  }
}

const ptntprofile = async(req, res)=>{
  try {
    const patientId = req.session.user.id;
    console.log(patientId)

    // SQL query to fetch patient profile data with health records
    const query = `
      SELECT
        T.PATIENTID,
        T.FIRSTNAME,
        T.LASTNAME,
        (T.FIRSTNAME || ' ' || T.LASTNAME) AS FULLNAME,
        TO_CHAR(T.DATEOFBIRTH, 'DD-MON-YYYY') AS FORMATTED_DATEOFBIRTH,
        T.GENDER,
        T.CONTACTNUMBER,
        T.ADDRESS,
        T.EMAILADDRESS,
        T.BLOODGROUP,
        T.PASSWORD,
        H.WEIGHT,
        H.HEIGHT,
        H.VACCINATIONHISTORY,
        H.BLOODPRESSURE,
        H.BMI,
        H.HEARTRATE
      FROM
        PATIENT T
      JOIN
        HEALTHRECORDS H ON (T.PATIENTID = H.PATIENTID)
      WHERE
        T.PATIENTID = :patientId`;

    const options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true
    };

    // Establish a connection to the database
    const connection = await oracledb.getConnection(dbConfig);

    // Execute the query
    const result = await connection.execute(query, { patientId }, options);
    const patient = result.rows[0]; // Assuming only one patient is returned
  console.log("from profile")
    console.log(patient);
    // Render the template with patient data
    res.render('profile.ejs', { patient,patientId });

    // Release the connection
    await connection.close();
  } catch (error) {
    console.error('Error fetching patient data:', error);
    res.status(500).send('An error occurred while fetching patient data');
  }
}

const updateprofile =  async (req, res) => {
  try {
      const patientId = req.session.user.id;

      // Fetch patient details from the database
      const connection = await oracledb.getConnection(dbConfig);
      const query = `
      SELECT
      T.PATIENTID,
      T.FIRSTNAME,
      T.LASTNAME,
      (T.FIRSTNAME || ' ' || T.LASTNAME) AS FULLNAME,
      TO_CHAR(T.DATEOFBIRTH, 'DD-MON-YYYY') AS FORMATTED_DATEOFBIRTH,
      T.GENDER,
      T.CONTACTNUMBER,
      T.ADDRESS,
      T.EMAILADDRESS,
      T.BLOODGROUP,
      T.PASSWORD,
      H.WEIGHT,
      H.HEIGHT,
      H.VACCINATIONHISTORY,
      H.BLOODPRESSURE,
      H.BMI,
      H.HEARTRATE
    FROM
      PATIENT T
    JOIN
      HEALTHRECORDS H ON (T.PATIENTID = H.PATIENTID)
    WHERE
      T.PATIENTID = :patientId`;
      const result = await connection.execute(query, [patientId], { outFormat: oracledb.OUT_FORMAT_OBJECT });
      const patient = result.rows[0];

      // Render the update page with patient details
      res.render('updateProfile.ejs', { patient, patientId });
  } catch (error) {
      console.error('Error fetching patient details:', error);
      res.status(500).send('An error occurred while fetching patient details');
  }
}


const postupdate =  async (req, res) => {
  try {
      const patientId = req.session.user.id;
      const { firstname, lastname, gender, contactnumber, address, password, weight, height, vaccinationhistory, bloodpressure, bmi, heartrate } = req.body;

      // Update patient details using the stored procedure
      const connection = await oracledb.getConnection(dbConfig);
      const procedureName = 'update_patient';
      const binds = {
          p_patient_id: patientId,
          p_firstname: firstname,
          p_lastname: lastname,
          p_gender: gender,
          p_contactnumber: contactnumber,
          p_address: address,
          p_password: password,
          p_weight: weight,
          p_height: height,
          p_vaccinationhistory: vaccinationhistory,
          p_bloodpressure: bloodpressure,
          p_bmi: bmi,
          p_heartrate: heartrate
      };
      const options = {
          autoCommit: true
      };

      await connection.execute(`BEGIN ${procedureName}(:p_patient_id, :p_firstname, :p_lastname, :p_gender, :p_contactnumber, :p_address, :p_password, :p_weight, :p_height, :p_vaccinationhistory, :p_bloodpressure, :p_bmi, :p_heartrate); END;`, binds, options);
      await connection.close();

      // Redirect to the updated profile page
      res.redirect('/landing/dashboard/profile');
  } catch (error) {
      console.error('Error updating patient profile:', error);
      res.status(500).send('An error occurred while updating patient profile');
  }
};



  module.exports = 
  {dashboardcontroller,upcoming_appointmentcontroller,past_appointmentcontroller
   ,downloadpres,feedback,prescriptionss,deleteappointment,diagnosis,ptntprofile,updateprofile,postupdate
  }