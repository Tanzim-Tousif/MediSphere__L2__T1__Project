const { use } = require('../Routes/landing');


oracledb = require('oracledb')

// function to get id from email
const dbConfig = {
   user: 'c##bookstore',
   password: 'bookstore',
   connectString: 'localhost:1521/ORCL'
 };




async function setdoctorschedule(arr){
   connection = await oracledb.getConnection(dbConfig);
try{
for(let i in arr){
    console.log("from db capcity " + typeof(arr[i].dt))
    console.log("from db id " + (arr[i].id))
    console.log("from db start " + (arr[i].starttimeam))
    console.log("from db end " + (arr[i].endtimeam))

    const procedureName = 'insert_doctor_schedule'; // Adjust this with your procedure name
    const binds = {
       p_id: parseInt(arr[i].id),
       p_dt: arr[i].dt,
       p_starttimeam: arr[i].starttimeam,
       p_endtimeam: arr[i].endtimeam,
       p_capacity: parseInt(arr[i].capacity),
    };

    const options = {
       outFormat: oracledb.OUT_FORMAT_OBJECT,
       autoCommit: true,
    };

    await connection.execute(`BEGIN ${procedureName}(:p_id, :p_dt, :p_starttimeam, :p_endtimeam, :p_capacity); END;`, binds, options);
 }

 await connection.commit();
} catch (error) {
 console.error('Error:', error);
} finally {
 if (connection) {
    try {
       await connection.close();
    } catch (err) {
       console.error('Error closing connection:', err);
    }
 }
}

}

module.exports = {setdoctorschedule}