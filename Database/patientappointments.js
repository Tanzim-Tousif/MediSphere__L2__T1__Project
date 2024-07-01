

oracledb = require('oracledb')

// function to get id from email
const dbConfig = {
   user: 'c##bookstore',
   password: 'bookstore',
   connectString: 'localhost:1521/ORCL'
 };





async function getupcomingappointments(id){
   connection = await oracledb.getConnection(dbConfig);
   const sql = `
 
SELECT 
(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULLNAME,
DSPE.NAME AS SPECIALITY,
TO_CHAR(DS.DAY,'DD-MM-YYYY') AS APPOINTMENT_DATE, -- Changed alias name from DATE to APPOINTMENT_DATE
DS.STARTTIME AS STARTTIME,
DS.ENDTIME AS ENDTIME,
A.SERIALNO AS SERIALNO, -- Assuming DS.PATIENT is the correct reference, otherwise replace DS with the appropriate table alias
D.CONSULTATIONFEE,
A.APPOINTMENTID,
TRUNC((SYSDATE - TO_DATE(ds.DAY || ' ' || ds.STARTTIME, 'dd-mm-yy HH:MI AM')) * 24 ,0) as td

FROM 
APPOINTMENT A 
JOIN DOCTORSCHEDULE DS ON A.SCHEDULEID = DS.SCHEDULEID 
JOIN DOCTOR D ON D.DOCTORID = DS.DOCTORID 
JOIN DOCTORSPECIALTY DSPE ON DSPE.DOCTORID = D.DOCTORID
WHERE 
A.PATIENTID = :id AND A.STATUS = 0
ORDER BY SERIALNO ASC
`;
  const binds = {
   id:id

}
const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
   const result = await connection.execute(sql, binds, options);
   return result;
}

async function getpastcomingappointments(id){
   connection = await oracledb.getConnection(dbConfig);
   const sql = `
 
SELECT 
(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULLNAME,
DSPE.NAME AS SPECIALITY,
TO_CHAR(DS.DAY,'DD-MM-YYYY') AS APPOINTMENT_DATE, -- Changed alias name from DATE to APPOINTMENT_DATE
DS.STARTTIME AS STARTTIME,
DS.ENDTIME AS ENDTIME,
A.SERIALNO AS SERIALNO, -- Assuming DS.PATIENT is the correct reference, otherwise replace DS with the appropriate table alias
D.CONSULTATIONFEE,
A.APPOINTMENTID
FROM 
APPOINTMENT A 
JOIN DOCTORSCHEDULE DS ON A.SCHEDULEID = DS.SCHEDULEID 
JOIN DOCTOR D ON D.DOCTORID = DS.DOCTORID 
JOIN DOCTORSPECIALTY DSPE ON DSPE.DOCTORID = D.DOCTORID
WHERE 
A.PATIENTID = :id AND A.STATUS = 1
ORDER BY SERIALNO ASC
`;
  const binds = {
   id:id

}
const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
   const result = await connection.execute(sql, binds, options);
   return result;
}


async function getprescription(id){
   connection = await oracledb.getConnection(dbConfig);
   const sql = `
   SELECT url from prescription where appointmentid = :id

`;
  const binds = {
   id:id

}
const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
   const result = await connection.execute(sql, binds, options);
   return result;
}





async function gettests(id){
   connection = await oracledb.getConnection(dbConfig);
   const sql = `
   SELECT test_name from suggested_tests where appointmentid = :id

`;
  const binds = {
   id:id

}
const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
   const result = await connection.execute(sql, binds, options);
   return result;
}


async function getdiagnostics(){

   
   connection = await oracledb.getConnection(dbConfig);
   const sql = `
   SELECT test_name from suggested_tests where appointmentid = :id

`;
  const binds = {
   id:id

}
const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
   const result = await connection.execute(sql, binds, options);
   return result;
}

async function allprescriptions(id){
   
    try {
      const connection = await oracledb.getConnection(dbConfig);
      const userId = id;
      // Query to fetch all columns from the PRESCRIPTION, APPOINTMENT, Doctor, and DoctorSchedule tables for the given user ID
      const query = `
        SELECT p.*, a.*, d.*, ds.*
        FROM PRESCRIPTION p
        JOIN APPOINTMENT a ON p.APPOINTMENTID = a.APPOINTMENTID
        JOIN DoctorSchedule ds ON a.ScheduleID = ds.ScheduleID
        JOIN Doctor d ON ds.DoctorID = d.DoctorID
        WHERE a.PATIENTID = :userId
      `;
      const binds = {
        userId: userId
      };
      // Define options for query execution
      const options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
        autoCommit: true // Automatically commit the transaction
      };
  //console.log(userId);
      // Execute the query with binds and options
      const result = await connection.execute(query, binds, options);
      const prescriptions = result.rows;
      
  //console.log(result.rows);
      await connection.close();
      return prescriptions;
  
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while retrieving data');
    }
}
module.exports = {
   getupcomingappointments,getpastcomingappointments,
   getprescription,
   gettests,getdiagnostics,allprescriptions
}