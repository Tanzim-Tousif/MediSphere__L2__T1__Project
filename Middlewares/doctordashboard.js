const { options } = require('pdfkit');
const Schedule = require('../Database/SetSchedule')
oracledb = require('oracledb')

// function to get id from email
const dbConfig = {
   user: 'c##bookstore',
   password: 'bookstore',
   connectString: 'localhost:1521/ORCL'
 };
const dashboardloading = async (req, res) => {
    console.log("here in dashboard");
    try {
      const connection = await oracledb.getConnection(dbConfig);
      const options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      };
  
      // Query upcoming appointments where status is 0 (not booked)
      const result = await connection.execute(
        `SELECT * FROM DOCTOR WHERE DOCTORID = 1`,
        {},
        options
      );
      console.log(result.rows);
      connection.close(); // Close connection
  
      // Render the page and pass the fetched appointments data to it
      res.render('docdashboard', { patient: result.rows });
    } catch (err) {
      console.error('ERROR ', err);
      res.status(500).send('Error fetching DOCTORS');
    }
  };

const upcoming_appointmentcontroller =  async (req, res) => {
    try {
      const connection = await oracledb.getConnection(dbConfig);
  
      // Define options with outFormat set to OBJECT
      const options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      };
      console.log("doctor id is")
      console.log(req.session.user.id)
     const binds = {
        id:req.session.user.id
     }
      // Query upcoming appointments where status is 0 (not booked)
      const result = await connection.execute(
        `SELECT 
        A.AppointmentID,
        A.Status,
        DS.ScheduleID,
        DS.DoctorID,
        TO_CHAR(DS.DAY, 'DD-MON-YYYY') AS ScheduleDate,
        DS.STARTTIME AS ScheduleSTARTTime,
        DS.ENDTIME AS ScheduleENDTime,
        P.PatientID,
        (P.FirstName ||' '||P.LASTNAME) AS FULLNAME
    FROM Appointment A JOIN DoctorSchedule DS ON A.ScheduleID = DS.ScheduleID JOIN Patient P ON A.PatientID = P.PatientID
    WHERE A.Status = 0 AND DS.DOCTORID = :id
    GROUP BY 
        A.AppointmentID,A.Status,DS.ScheduleID,DS.DoctorID,DS.DAY,DS.STARTTIME,DS.ENDTIME,P.PatientID,(P.FirstName ||' '||P.LASTNAME)`,
        // Empty array for bind parameters
         // Options object with outFotrmat se
         binds,
        options
      );
  
      console.log(result.rows);
      connection.close(); // Close connection
        res.render('upcomingappointments', { appointments: result.rows });
    } catch (err) {
      console.error('Error fetching upcoming appointments: ', err);
      res.status(500).send('Error fetching upcoming appointments');
    }
  }


  const SetSchedule = async(req,res) => {
    res.render('UpdateSchedule',{
      id:req.session.user.id
    })
  }

  const setnextschedule = (req,res) => {
    const scheduleData = req.body;
    console.log(scheduleData)
    Schedule.setdoctorschedule(scheduleData)
    
  }


  const scheduleappointments = async(req,res) => {
          
   connection = await oracledb.getConnection(dbConfig);
   const sql = `
   SELECT DISTINCT(to_char(day,'yyyy-mm-dd'))as dt
   from doctorschedule
   where day > sysdate and doctorid = :id
`;
  const binds = {
   id:req.session.user.id

}
const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
   const result = await connection.execute(sql, binds, options);
   res.render('Scheduleappointment',{
    schedules:result.rows,
    user:req.session.user.id
   })
  }
  const past_appointments = async(req,res) => {
    try {
      const connection = await oracledb.getConnection(dbConfig);
  
      // Define options with outFormat set to OBJECT
      const options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      };
      console.log("doctor id is")
      console.log(req.session.user.id)
     const binds = {
        id:req.session.user.id
     }
      // Query upcoming appointments where status is 0 (not booked)
      const result = await connection.execute(
        `SELECT 
        A.AppointmentID,
        A.Status,
        DS.ScheduleID,
        DS.DoctorID,
        TO_CHAR(DS.DAY, 'DD-MON-YYYY') AS ScheduleDate,
        DS.STARTTIME AS ScheduleSTARTTime,
        DS.ENDTIME AS ScheduleENDTime,
        P.PatientID,
        (P.FirstName ||' '||P.LASTNAME) AS FULLNAME
    FROM Appointment A JOIN DoctorSchedule DS ON A.ScheduleID = DS.ScheduleID JOIN Patient P ON A.PatientID = P.PatientID
    WHERE A.Status = 1 AND DS.DOCTORID = :id
    GROUP BY 
        A.AppointmentID,A.Status,DS.ScheduleID,DS.DoctorID,DS.DAY,DS.STARTTIME,DS.ENDTIME,P.PatientID,(P.FirstName ||' '||P.LASTNAME)`,
        // Empty array for bind parameters
         // Options object with outFotrmat se
         binds,
        options
      );
  
      console.log(result.rows);
      connection.close(); // Close connection
        res.render('pastappointments', { appointments: result.rows });
    } catch (err) {
      console.error('Error fetching upcoming appointments: ', err);
      res.status(500).send('Error fetching upcoming appointments');
    }
  }


  const upschedules = async(req,res) => {
          
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
    SELECT DISTINCT(to_char(day,'yyyy-mm-dd'))as dt
    from doctorschedule
    where day > sysdate and doctorid = :id
 `;
   const binds = {
    id:req.session.user.id
 
 }
 const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
    autoCommit: true, // Automatically commit the transaction
  };
    // Execute the query with binds and options
    const result = await connection.execute(sql, binds, options);
    res.render('upschedules',{
     schedules:result.rows,
     user:req.session.user.id
    })
   }




// Define the function for fetching the patient profile
const fetchdocProfile = async(req, res)=> {
  try {
    //const patientId = req.params.patientid;
    const doctorId = req.session.user.id;

    // SQL query to fetch patient profile data with health records
    const query = `
    SELECT a.*,b.*,c.* from DOCTOR a JOIN DoctorsExperience b on(a.DOCTORID=b.DOCTORID) JOIN QUALIFICATION c on (a.DOCTORID=c.DOCTORID) WHERE a.DOCTORID=:doctorId`;

    const options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true
    };

    // Establish a connection to the database
    const connection = await oracledb.getConnection(dbConfig);

    // Execute the query
    const result = await connection.execute(query, { doctorId }, options);
    const doctor = result.rows[0]; // Assuming only one patient is returned
//console.log(doctor);
    // Render the template with patient data
    res.render('docprofile.ejs', { doctor,doctorId});

    // Release the connection
    await connection.close();
  } catch (error) {
    console.error('Error fetching patient data:', error);
    res.status(500).send('An error occurred while fetching patient data');
  }
}

// Export the fetchPatientProfile function and dbConfig object




module.exports = {dashboardloading,
  upcoming_appointmentcontroller,
  SetSchedule,
  setnextschedule,
  scheduleappointments,
  past_appointments,
  upschedules,
  fetchdocProfile
};