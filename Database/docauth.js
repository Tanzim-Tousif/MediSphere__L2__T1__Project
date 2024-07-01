const { use } = require('../Routes/landing');


oracledb = require('oracledb')

// function to get id from email
const dbConfig = {
   user: 'c##bookstore',
   password: 'bookstore',
   connectString: 'localhost:1521/ORCL'
 };


async function docuserauthenticate(email){
   connection = await oracledb.getConnection(dbConfig
   );
   const sql = `
   SELECT FIRSTNAME,DOCTORID AS ID
    FROM DOCTOR
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

module.exports = docuserauthenticate