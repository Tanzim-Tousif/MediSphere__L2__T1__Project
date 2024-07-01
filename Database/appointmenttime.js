

oracledb = require('oracledb')

// function to get id from email
const dbConfig = {
   user: 'c##bookstore',
   password: 'bookstore',
   connectString: 'localhost:1521/ORCL'
 };

 async function getalldate (id){
   connection = await oracledb.getConnection(dbConfig
   );
   const sql = `
   SELECT D.DOCTORID AS ID,(D.FIRSTNAME || D.LASTNAME) AS FULLNAME,(SELECT E.NAME FROM DOCTORSPECIALTY E WHERE E.DOCTORID = D.DOCTORID) AS SPECIALITY,(F.STARTTIME) AS STARTTIME,F.ENDTIME AS ENDTIME,F.CAPACITY AS CAPACITY,F.PATIENT,F.STATUS
   FROM DOCTOR D JOIN DOCTORSCHEDULE F ON (D.DOCTORID = F.DOCTORID)
   WHERE D.DOCTORID = :id`;
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



async function getalltime(id,da){
   connection = await oracledb.getConnection(dbConfig
   );
   const sql = `
   SELECT D.DOCTORID AS ID,(D.FIRSTNAME || D.LASTNAME) AS FULLNAME,(SELECT E.NAME FROM DOCTORSPECIALTY E WHERE E.DOCTORID = D.DOCTORID) AS SPECIALITY,(F.STARTTIME) AS STARTTIME,F.ENDTIME AS ENDTIME,F.CAPACITY AS CAPACITY,F.PATIENT,F.STATUS, TO_CHAR(DAY,'DD-MM-YYYY') AS DAY,F.PATIENT as PATIENT,F.SCHEDULEID AS SCHID
   FROM DOCTOR D JOIN DOCTORSCHEDULE F ON (D.DOCTORID = F.DOCTORID)
   WHERE D.DOCTORID = :id and TO_char(DAY,'yyyy-mm-dd')  = :da`;
  const binds = {
   id:id,
   da:da


}
const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
   const result = await connection.execute(sql, binds, options);
   return result;
}


async function updatebookedslot(id,starttime,endtime,status,dt){
    connection = await oracledb.getConnection(dbConfig);
    const sql = 
    `UPDATE DOCTORSCHEDULE
    SET PATIENT = PATIENT + 1
    WHERE STARTTIME = :starttime AND ENDTIME = :endtime and doctorid = :id and 
    to_char(day,'yyyy-mm-dd') = :dt
    `;
   const binds = {
    starttime:starttime,
    endtime:endtime,
    id:id,
    dt:dt
 }
 const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
    autoCommit: true, // Automatically commit the transaction
  };
    // Execute the query with binds and options
     await connection.execute(sql, binds, options);
     await connection.commit();
     const sql2 = 
     `UPDATE DOCTORSCHEDULE
     SET CAPACITY = CAPACITY - 1
     WHERE STARTTIME = :starttime AND ENDTIME = :endtime and doctorid = :id and 
     to_char(day,'yyyy-mm-dd') = :dt`;
     await connection.execute(sql2, binds, options);
     await connection.commit();
 console.log("status is ",status);
     if(status){
      const sql3 = 
      `UPDATE DOCTORSCHEDULE
      SET STATUS = 1
      WHERE STARTTIME = :starttime AND ENDTIME = :endtime and doctorid = :id and 
      to_char(day,'yyyy-mm-dd') = :dt`;
      await connection.execute(sql3, binds, options);
      await connection.commit();
     }
     // Release the connection
     await connection.close();
 }


// async function insertinappointmenttable(SCHEDULEID,PATIENTID,SERIALNO){
//    connection = await oracledb.getConnection(dbConfig);
//    const sql = 
//    `insert into appointment(STATUS,SCHEDULEID,PATIENTID,SERIALNO) VALUES(:status,:id,:paid,:no)`;
//   const binds = {
//    status:0,
//    id : SCHEDULEID,
//    paid:PATIENTID,
//    no:SERIALNO
// }
// const options = {
//    outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
//    autoCommit: true, // Automatically commit the transaction
//  };
//    // Execute the query with binds and options
//     await connection.execute(sql, binds, options);
//     await connection.commit();
// }

async function insertinappointmenttable(SCHEDULEID, PATIENTID, SERIALNO) {
   connection = await oracledb.getConnection(dbConfig);
   console.log("in appointment booking")
   const procedureName = 'insert_in_appointment_table';
   const binds = {
       p_schedule_id: SCHEDULEID,
       p_patient_id: PATIENTID,
       p_serial_no: SERIALNO
   };
   
   const options = {
       outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
       autoCommit: true, // Automatically commit the transaction
   };

   try {
       await connection.execute(`BEGIN ${procedureName}(:p_schedule_id, :p_patient_id, :p_serial_no); END;`, binds, options);
   } catch (err) {
       console.error('Error executing procedure:', err);
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

async function getminimumappointmentdate(id){
   connection = await oracledb.getConnection(dbConfig);
   const sql = `
 
SELECT min(to_char(day,'yyyy-mm-dd')) as mday from doctorschedule
where TO_char(day,'yyyy-mm-dd')  > TO_char(SYSDATE,'yyyy-mm-dd') and  doctorid = :id

`;
  const binds = {
   id:id,

}
const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
   const result = await connection.execute(sql, binds, options);
   return result;
}




async function getalldateth(id){
   connection = await oracledb.getConnection(dbConfig);
   const sql = `
   SELECT DISTINCT TO_CHAR(day,'ddth Mon YYYY') as dy ,DAY from doctorschedule
   where TO_char(day,'yyyy-mm-dd')  > TO_char(SYSDATE,'yyyy-mm-dd') and  doctorid = :id
   ORDER BY DAY
`;
  const binds = {
   id:id,

}
const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
   const result = await connection.execute(sql, binds, options);
   return result;
}




async function getalldate(id){
   connection = await oracledb.getConnection(dbConfig);
   const sql = `
   SELECT DISTINCT TO_CHAR(day,'yyyy-mm-dd') AS dy,DAY from doctorschedule
   where TO_char(day,'yyyy-mm-dd')  > TO_char(SYSDATE,'yyyy-mm-dd') and  doctorid = :id
   order by DAY ASC
`;
  const binds = {
   id:id,

}
const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
   const result = await connection.execute(sql, binds, options);
   return result;
}
module.exports ={getalltime,
   updatebookedslot,
   insertinappointmenttable,
   getminimumappointmentdate,
   getalldate,
   getalldateth
}