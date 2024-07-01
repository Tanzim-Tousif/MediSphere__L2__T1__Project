const db_signup = require('../Database/signup')
const oracledb = require('oracledb')
const dbConfig = {
    user: 'c##bookstore',
    password: 'bookstore',
    connectString: 'localhost:1521/ORCL', // Format: 'hostname:port/service_name'
};
const signup = async (req, res) => {
    try {
        // Connect to Oracle Database
        const connection = await oracledb.getConnection(dbConfig);
console.log("hitted");
        // Create a user
        const Newuser = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.gender,
            contactNumber: req.body.contactNumber,
            address: req.body.address,
            emailaddress: req.body.emailaddress,
            bloodgroup: req.body.bloodgroup,
            password: req.body.password
        };
console.log(Newuser);
        // Increment the patientid for the next user
     

        // Insert user data into the database
        // const result = await connection.execute(
        //     'INSERT INTO patient11 (firstname, lastname, dateOfBirth, gender, contactNumber, address, emailaddress, bloodgroup) VALUES (:firstname, :lastname, TO_DATE(:dateOfBirth, 'YYYY-MM-DD'), :gender, :contactNumber, :address, :emailaddress, :bloodgroup)',
        //     Newuser
        // );
        
        const result = await connection.execute(
            `INSERT INTO patient
            (firstname, lastname, dateOfBirth, gender, contactNumber, address, emailaddress, bloodgroup,password) 
            VALUES 
            (:firstname, :lastname, TO_DATE(:dateOfBirth, 'YYYY-MM-DD'), :gender, :contactNumber, :address, :emailaddress, :bloodgroup, :password)`,
            {
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
        );
        

        // Commit the transaction
        await connection.commit();

        // Release the connection
        await connection.close();

        //res.status(201).json({ message: 'User signed up successfully!' });
        res.redirect('/landing');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = signup;