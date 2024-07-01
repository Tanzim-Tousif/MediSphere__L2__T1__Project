const oracledb = require('oracledb');

// Oracle database configuration
const dbConfig = {
  user: 'c##bookstore',
  password: 'bookstore',
  connectString: 'localhost:1521/ORCL'
};

async function DeletedAppointments(req, res) {
    try {
      const query1 = `
      SELECT 
    a.APPOINTMENTID, 
    a.SCHEDULEID, 
    a.PATIENTID, 
    TO_CHAR(a.DELETEDAT, 'DD-MON-YYYY HH24:MI:SS') AS DELETEDAT, 
    b.FIRSTNAME || ' ' || b.LASTNAME AS PATIENT_NAME, 
    d.FIRSTNAME AS DOCTOR_FIRSTNAME, 
    TO_CHAR(c.DAY, 'DD-MON-YYYY') AS DAY, 
    c.STARTTIME,
    c.ENDTIME
FROM 
    DeletedAppointments a 
LEFT JOIN 
    PATIENT b ON a.PATIENTID = b.PATIENTID 
JOIN 
    DOCTORSCHEDULE c ON a.SCHEDULEID = c.SCHEDULEID
JOIN 
    DOCTOR d ON c.DOCTORID = d.DOCTORID
ORDER BY DELETEDAT DESC
  `;
      const options1 = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true
      };
      // Establish a connection to the database
      const connection = await oracledb.getConnection(dbConfig);
  
      // Execute the queries
      const result1 = await connection.execute(query1,{}, options1);
     
      const DeletedAppointments = result1.rows; 
     
      // Render the template with patient data
    console.log(DeletedAppointments);
      res.render('DeletedAppointments.ejs', { DeletedAppointments } );
      // Release the connection
      await connection.close();
    } catch (error) {
      console.error('Error fetching alldoctors data:', error);
      res.status(500).send('An error occurred while fetching alldoctors data');
    }
  }

// Export the allpatients function and dbConfig object
module.exports = {
    DeletedAppointments,
  dbConfig
};
