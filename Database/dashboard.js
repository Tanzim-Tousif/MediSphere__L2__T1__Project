const { use } = require('../Routes/landing');


oracledb = require('oracledb')

// function to get id from email
const dbConfig = {
   user: 'c##bookstore',
   password: 'bookstore',
   connectString: 'localhost:1521/ORCL'
 };




async function getprofile(){
   connection = await oracledb.getConnection(dbConfig);

   const sql = `
   SELECT  T.PATIENTID,T.FIRSTNAME,T.LASTNAME,(T.FIRSTNAME||' '||T.LASTNAME) AS FULLNAME,TO_CHAR(T.DATEOFBIRTH, 'DD-MON-YYYY') AS FORMATTED_DATEOFBIRTH,T.GENDER,T.CONTACTNUMBER,T.ADDRESS,T.EMAILADDRESS,T.BLOODGROUP,T.PASSWORD,H.WEIGHT,H.HEIGHT,H.VACCINATIONHISTORY,H.BLOODPRESSURE,H.BMI,H.HEARTRATE 
   FROM PATIENT T JOIN HEALTHRECORDS H ON (T.PATIENTID=H.PATIENTID)`;
  const binds = {};
  const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
   const result = await connection.execute(sql, binds,options);
   return result;
}



async function getallappointments(id){
  connection = await oracledb.getConnection(dbConfig);

  const sql = `
  SELECT * from PATIENT T JOIN HEALTHRECORDS H on (T.PATIENTID=H.PATIENTID)`;
 const binds = {};
 const options = {
  outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
  autoCommit: true, // Automatically commit the transaction
};
  // Execute the query with binds and options
  const result = await connection.execute(sql, binds, options);
  return result;
}
module.exports = {getprofile,getallappointments}