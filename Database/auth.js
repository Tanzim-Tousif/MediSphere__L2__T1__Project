const { use } = require('../Routes/landing');


oracledb = require('oracledb')

// function to get id from email
const dbConfig = {
   user: 'c##bookstore',
   password: 'bookstore',
   connectString: 'localhost:1521/ORCL'
 };


async function userauthenticate(email){
   connection = await oracledb.getConnection(dbConfig
   );
   const sql = `
   SELECT (FIRSTNAME || ' ' || LASTNAME) AS NAME,PATIENTID AS ID
    FROM PATIENT
    WHERE UPPER(EMAILADDRESS) = UPPER(:email)`;
  const binds = {
   email:email
}
const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
   const result = await connection.execute(sql, binds, options);
   return result;
}

module.exports = userauthenticate