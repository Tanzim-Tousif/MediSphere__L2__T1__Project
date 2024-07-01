
const oracledb = require('oracledb');

// Oracle database configuration
const dbConfig = {
  user: 'c##bookstore',
  password: 'bookstore',
  connectString: 'localhost:1521/ORCL'
};

async function adminpage(req, res) {
    try {
      const query1 = `
        SELECT COUNT(*) AS TOTALDOCTORS FROM DOCTOR`;
      const query2 = `
        SELECT COUNT(*) AS TOTALPATIENTS FROM PATIENT`;
        const query3 = `
        SELECT COUNT(*) AS PENDINGAPPOINTMENTS FROM APPOINTMENT WHERE STATUS=0`;
        const query4 = `
        SELECT COUNT(*) AS DONEAPPOINTMENTS FROM APPOINTMENT WHERE STATUS=1`;
        const query5 = `
        SELECT COUNT(*) AS DIAGNOSTICCENTER FROM DIAGNOSTICCENTER`;
        const query6 = `
        SELECT LOG_ID, PROCEDURE_NAME, PROCEDURE_PARAMS, USER_ID, USER_NAME, TO_CHAR(CALL_TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS') AS FORMATTED_TIMESTAMP
FROM LOGTABLE
ORDER BY CALL_TIMESTAMP DESC
`;
const query7 = `
SELECT COUNT(*) AS DELETEDAPPOINTMENTCNT FROM DeletedAppointments`;
      const options1 = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true
      };
      // Establish a connection to the database
      const connection = await oracledb.getConnection(dbConfig);
  
      // Execute the queries
      const result1 = await connection.execute(query1,{}, options1);
      const result2 = await connection.execute(query2, {},options1);
    const result3 = await connection.execute(query3, {},options1);
    const result4 = await connection.execute(query4, {},options1);
    const result5 = await connection.execute(query5, {},options1);
    const result6 = await connection.execute(query6, {},options1);
    const result7 = await connection.execute(query7, {},options1);
    
      const DOCTORCNT = result1.rows[0]; 
      const PATIENTCNT = result2.rows[0]; 
    const PENDINGAPPOINTMENTCNT = result3.rows[0];
    const DONEAPPOINTMENTCNT = result4.rows[0];
    const DIAGNOSTICCENTERCNT = result5.rows[0];
    const LOGTABLE = result6.rows;
    const DELETEDAPPOINTMENTCNT = result7.rows[0];
  
      // Render the template with patient data
     console.log(LOGTABLE);
      res.render('admin-dashboard.ejs', { DOCTORCNT, PATIENTCNT, PENDINGAPPOINTMENTCNT, DONEAPPOINTMENTCNT, DIAGNOSTICCENTERCNT,LOGTABLE, DELETEDAPPOINTMENTCNT});
      // Release the connection
      await connection.close();
    } catch (error) {
      console.error('Error fetching patient data:', error);
      res.status(500).send('An error occurred while fetching patient data');
    }
  }

// Export the adminpanel function and dbConfig object



async function allpatients(req, res) {
    try {
      const query1 = `
        SELECT * FROM PATIENT order by PATIENTID ASC`;
      const options1 = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true
      };
      // Establish a connection to the database
      const connection = await oracledb.getConnection(dbConfig);
  
      // Execute the queries
      const result1 = await connection.execute(query1,{}, options1);
     
      const allpatient = result1.rows; 
     
      // Render the template with patient data
     //console.log(allpatient);
      res.render('delPatient.ejs', { allpatient } );
      // Release the connection
      await connection.close();
    } catch (error) {
      console.error('Error fetching patient data:', error);
      res.status(500).send('An error occurred while fetching patient data');
    }
  }


  
async function alldoctors(req, res) {
    try {
      const query1 = `
        SELECT * FROM DOCTOR ORDER BY DOCTORID ASC`;
      
      const options1 = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true
      };
      // Establish a connection to the database
      const connection = await oracledb.getConnection(dbConfig);
  
      // Execute the queries
      const result1 = await connection.execute(query1,{}, options1);
     
      const alldoctors = result1.rows; 
     
      // Render the template with patient data
    // console.log(alldoctors[0]);
      res.render('alldoctors.ejs', { alldoctors } );
      // Release the connection
      await connection.close();
    } catch (error) {
      console.error('Error fetching alldoctors data:', error);
      res.status(500).send('An error occurred while fetching alldoctors data');
    }
  }



  
const deledtedappointments = async function(req, res) {
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



module.exports = {adminpage,
    allpatients,
    alldoctors,
    deledtedappointments
}