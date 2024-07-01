const { use } = require('../Routes/landing');


oracledb = require('oracledb')

// function to get id from email
const dbConfig = {
   user: 'c##bookstore',
   password: 'bookstore',
   connectString: 'localhost:1521/ORCL'
 };




async function reveiwsonappointmentside(id){
   connection = await oracledb.getConnection(dbConfig);

   const sql = `
   SELECT P.FIRSTNAME || ' ' || P.LASTNAME AS NAME ,R.RATING AS RATING ,R.COMMENTTEXT AS CMNT,TO_CHAR(R.GIVENDATE,'ddth MON YYYY') AS DT
 from review R join APPOINTMENT AP ON (R.APPOINTMENTID = AP.APPOINTMENTID) JOIN DOCTORSCHEDULE DS ON (AP.SCHEDULEID = DS.SCHEDULEID) JOIN PATIENT P
ON (AP.PATIENTID = P.PATIENTID)
WHERE DS.DOCTORID = :id 
 `;
  const binds = {id:id};
  const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   const result = await connection.execute(sql, binds,options);
   return result;
}

module.exports = reveiwsonappointmentside