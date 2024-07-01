


oracledb = require('oracledb')

// function to get id from email
const dbConfig = {
   user: 'c##bookstore',
   password: 'bookstore',
   connectString: 'localhost:1521/ORCL'
 };


async function usersignup(Newuser){
   connection = await oracledb.getConnection(dbConfig
   );
   const sql = `
       INSERT INTO patient
   (firstname, lastname, dateOfBirth, gender, contactNumber, address, emailaddress, bloodgroup,password) 
   VALUES 
   (:firstname, :lastname, TO_DATE(:dateOfBirth, 'YYYY-MM-DD'), :gender, :contactNumber, :address, :emailaddress, :bloodgroup, :password)`;
  const binds = {
    firstname: Newuser.firstname,
    lastname: Newuser.lastname,
    dateOfBirth: Newuser.dateOfBirth,
    gender: Newuser.gender,
    contactNumber: Newuser.contactNumber,
    address: Newuser.address,
    emailaddress: Newuser.emailaddress,
    bloodgroup: Newuser.bloodgroup,
    password: Newuser.password
}
const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
    await connection.execute(sql, binds, options);
   await connection.commit();

   // Release the connection
   await connection.close();

   //res.status(201).json({ message: 'User signed up successfully!' });
   
   
}

module.exports = usersignup