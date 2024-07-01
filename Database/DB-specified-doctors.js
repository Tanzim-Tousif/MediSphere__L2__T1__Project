

oracledb = require('oracledb')

// function to get id from email
const dbConfig = {
   user: 'c##bookstore',
   password: 'bookstore',
   connectString: 'localhost:1521/ORCL'
 };

 const options = {
  outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
  autoCommit: true, // Automatically commit the transaction
};
async function getdoctorsbyspecialiy(speciality){
   connection = await oracledb.getConnection(dbConfig
   );
   const sql = `
   SELECT 
      D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
      E.NAME,
      D.CHAMBERADDRESS,
      D.CONSULTATIONFEE,
      D.HOSPITALNAME
  FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
  WHERE UPPER(E.NAME) = UPPER(:speciality)`;
  const binds = {
   speciality:speciality
}
const options = {
   outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format (can be ARRAY, OBJECT, etc.)
   autoCommit: true, // Automatically commit the transaction
 };
   // Execute the query with binds and options
   const result = await connection.execute(sql, binds, options);
   return result;
}


async function getdoctorsbyid(id){
  connection = await oracledb.getConnection(dbConfig
  );
  const sql = `
  SELECT 
  D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
  E.NAME AS NAME,
  D.CHAMBERADDRESS,
  D.CONSULTATIONFEE,
  D.HOSPITALNAME,
  D.RATING
FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
WHERE D.DOCTORID = :id`;
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


async function searchbyspecialitymcqmxfeerating(id,speciality,sorting,mxfee,rating){
  connection = await oracledb.getConnection(dbConfig);
  console.log(sorting + ' ' + mxfee);
  if(sorting == 'feeshigh'){
      
          const sql = `

          SELECT 
          D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
          E.NAME AS NAME,
          D.CHAMBERADDRESS,
          D.CONSULTATIONFEE,
          D.HOSPITALNAME          FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
          WHERE E.NAME = :id and d.gender  = :speciality
          and d.consultationfee <= :mxfee
          and d.rating  <= :rating
          ORDER BY d.consultationfee asc `;
            const binds = {
                    id:id,
                    speciality:speciality,
                    mxfee:mxfee,
                    rating:rating
                  }
  
    // Execute the query with binds and options
    const result = await connection.execute(sql, binds, options);
    return result;
  }
  else if(sorting == 'feeslow'){
    const sql = `
    SELECT 
    D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
    E.NAME AS NAME,
    D.CHAMBERADDRESS,
    D.CONSULTATIONFEE,
    D.HOSPITALNAME
    FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
    WHERE E.NAME = :id and d.gender  = :speciality
    and d.consultationfee <= :mxfee
    and d.rating  <= :rating
    ORDER BY d.consultationfee desc
       `;
      const binds = {
              id:id,
              speciality:speciality,
              mxfee:mxfee,
              rating:rating
            }

// Execute the query with binds and options
const result = await connection.execute(sql, binds, options);
return result;
  }
  else{
    const sql = `
    SELECT COUNT(a.appointmentid),D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
    dspe.NAME AS NAME,
    D.CHAMBERADDRESS,
    D.CONSULTATIONFEE,
    D.HOSPITALNAME
    from doctor d left join doctorspecialty dspe on (d.doctorid = dspe.DOCTORID)
    left join doctorschedule ds on(d.DOCTORID = ds.DOCTORID)
    left join appointment a on(a.scheduleid = ds.scheduleid)
    where dspe.NAME = :id
    GROUP BY D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME),
    dspe.NAME,
    D.CHAMBERADDRESS,
    D.CONSULTATIONFEE,
    D.HOSPITALNAME
    ORDER BY COUNT(a.appointmentid) desc
    
       `;
      const binds = {
              id:id
                }

// Execute the query with binds and options
const result = await connection.execute(sql, binds, options);
return result;
  }

}


async function searchbyspecialitymcqmxfee(id,speciality,sorting,mxfee){

  connection = await oracledb.getConnection(dbConfig);
  console.log(sorting + ' ' + mxfee);
  if(sorting == 'feeshigh'){
      
          const sql = `
          SELECT 
          D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
          E.NAME AS NAME,
          D.CHAMBERADDRESS,
          D.CONSULTATIONFEE,
          D.HOSPITALNAME
          FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
          WHERE E.NAME = :id and d.gender  = :speciality
          and d.consultationfee <= :mxfee
          ORDER BY d.consultationfee asc
             `;
            const binds = {
                    id:id,
                    speciality:speciality,
                    mxfee:mxfee,
                  }
  
    // Execute the query with binds and options
    const result = await connection.execute(sql, binds, options);
    return result;
  }
  else if(sorting == 'feeslow'){
    const sql = `
    SELECT 
    D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
    E.NAME AS NAME,
    D.CHAMBERADDRESS,
    D.CONSULTATIONFEE,
    D.HOSPITALNAME
    FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
    WHERE E.NAME = :id and d.gender  = :speciality
    and d.consultationfee <= :mxfee
    ORDER BY d.consultationfee desc
       `;
      const binds = {
              id:id,
              speciality:speciality,
              mxfee:mxfee,
            }

// Execute the query with binds and options
const result = await connection.execute(sql, binds, options);
return result;
  }
  else{
    const sql = `
    SELECT COUNT(a.appointmentid),D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
    dspe.NAME AS NAME,
    D.CHAMBERADDRESS,
    D.CONSULTATIONFEE,
    D.HOSPITALNAME
    from doctor d left join doctorspecialty dspe on (d.doctorid = dspe.DOCTORID)
    left join doctorschedule ds on(d.DOCTORID = ds.DOCTORID)
    left join appointment a on(a.scheduleid = ds.scheduleid)
    where dspe.NAME = :id
    GROUP BY D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME),
    dspe.NAME,
    D.CHAMBERADDRESS,
    D.CONSULTATIONFEE,
    D.HOSPITALNAME
    ORDER BY COUNT(a.appointmentid) desc`;
      const binds = {
              id:id,
            }

// Execute the query with binds and options
const result = await connection.execute(sql, binds, options);
return result;

          }
}

async function searchbyspecialitymxfeerating(id,speciality,mxfee,rating){
  connection = await oracledb.getConnection(dbConfig);
  
      console.log(speciality + ' ' + mxfee + ' ' + rating)
          const sql = `
          SELECT 
          D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
          E.NAME AS NAME,
          D.CHAMBERADDRESS,
          D.CONSULTATIONFEE,
          D.HOSPITALNAME
          FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
          WHERE E.NAME = :id and d.gender  = :speciality
          and d.consultationfee <= :mxfee
          and d.rating  <= :rating
             `;
            const binds = {
                    id:id,
                    speciality:speciality,
                    mxfee:mxfee,
                    rating:rating
                  }
  
    // Execute the query with binds and options
    const result = await connection.execute(sql, binds, options);
    return result;
  
  
}

async function searchbyspecialitymxfee(id,speciality,mxfee){
  connection = await oracledb.getConnection(dbConfig);

      
          const sql = `
          SELECT 
          D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
          E.NAME AS NAME,
          D.CHAMBERADDRESS,
          D.CONSULTATIONFEE,
          D.HOSPITALNAME
          FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
          WHERE E.NAME = :id and d.gender  = :speciality
          and d.consultationfee <= :mxfee
      
             `;
            const binds = {
                    id:id,
                    speciality:speciality,
                    mxfee:mxfee,
                  }
  
    // Execute the query with binds and options
    const result = await connection.execute(sql, binds, options);
    return result;
  
}

async function searchbymcqmxfeerating(id,sorting,mxfee,rating){
  connection = await oracledb.getConnection(dbConfig);

      
  if(sorting == 'feeshigh'){
      
    const sql = `
    SELECT 
    D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
    E.NAME AS NAME,
    D.CHAMBERADDRESS,
    D.CONSULTATIONFEE,
    D.HOSPITALNAME
    FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
    WHERE E.NAME = :id
    and d.consultationfee <= :mxfee
    and d.rating  <= :rating
    ORDER BY d.consultationfee asc
       `;
      const binds = {
              id:id,
              mxfee:mxfee,
              rating:rating
            }

// Execute the query with binds and options
const result = await connection.execute(sql, binds, options);
return result;
}
else if(sorting == 'feeslow'){
const sql = `
SELECT 
D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
E.NAME AS NAME,
D.CHAMBERADDRESS,
D.CONSULTATIONFEE,
D.HOSPITALNAME
FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
WHERE E.NAME = :id 
and d.consultationfee <= :mxfee
and d.rating  <= :rating
ORDER BY d.consultationfee desc
 `;
const binds = {
        id:id,
        mxfee:mxfee,
        rating:rating
      }

// Execute the query with binds and options
const result = await connection.execute(sql, binds, options);
return result;
}
else{
  const sql = `
  SELECT COUNT(a.appointmentid),D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
  dspe.NAME AS NAME,
  D.CHAMBERADDRESS,
  D.CONSULTATIONFEE,
  D.HOSPITALNAME
  from doctor d left join doctorspecialty dspe on (d.doctorid = dspe.DOCTORID)
  left join doctorschedule ds on(d.DOCTORID = ds.DOCTORID)
  left join appointment a on(a.scheduleid = ds.scheduleid)
	where dspe.NAME = :id
  GROUP BY D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME),
  dspe.NAME,
  D.CHAMBERADDRESS,
  D.CONSULTATIONFEE,
  D.HOSPITALNAME
  ORDER BY COUNT(a.appointmentid) desc`;
    const binds = {
            id:id,
          }

// Execute the query with binds and options
const result = await connection.execute(sql, binds, options);
return result;
}
}


async function searchbymcqmxfee(id,sorting,mxfee){
  connection = await oracledb.getConnection(dbConfig);

      
  if(sorting == 'feeshigh'){
      
    const sql = `
    SELECT 
    D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
    E.NAME AS NAME,
    D.CHAMBERADDRESS,
    D.CONSULTATIONFEE,
    D.HOSPITALNAME
    FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
    WHERE E.NAME = :id 
    and d.consultationfee <= :mxfee
    ORDER BY d.consultationfee asc
       `;
      const binds = {
              id:id,
              mxfee:mxfee,
            }

// Execute the query with binds and options
const result = await connection.execute(sql, binds, options);
return result;
}
else if(sorting == 'feeslow'){
const sql = `
SELECT 
D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
E.NAME AS NAME,
D.CHAMBERADDRESS,
D.CONSULTATIONFEE,
D.HOSPITALNAME
FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
WHERE E.NAME = :id 
and d.consultationfee <= :mxfee
ORDER BY d.consultationfee desc
 `;
const binds = {
        id:id,
        mxfee:mxfee,
      }

// Execute the query with binds and options
const result = await connection.execute(sql, binds, options);
return result;
}
else{
  const sql = `
  SELECT COUNT(a.appointmentid),D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
  dspe.NAME AS NAME,
  D.CHAMBERADDRESS,
  D.CONSULTATIONFEE,
  D.HOSPITALNAME
  from doctor d left join doctorspecialty dspe on (d.doctorid = dspe.DOCTORID)
  left join doctorschedule ds on(d.DOCTORID = ds.DOCTORID)
  left join appointment a on(a.scheduleid = ds.scheduleid)
	where dspe.NAME = :id
  GROUP BY D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME),
  dspe.NAME,
  D.CHAMBERADDRESS,
  D.CONSULTATIONFEE,
  D.HOSPITALNAME
  ORDER BY COUNT(a.appointmentid) desc`;
    const binds = {
            id:id,
          }

// Execute the query with binds and options
const result = await connection.execute(sql, binds, options);
return result;
}
}


async function searchbymcqrating(id,sorting,rating){
  connection = await oracledb.getConnection(dbConfig);

      
  if(sorting == 'feeshigh'){
      
    const sql = `
    SELECT 
    D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
    E.NAME AS NAME,
    D.CHAMBERADDRESS,
    D.CONSULTATIONFEE,
    D.HOSPITALNAME    FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
    WHERE E.NAME = :id 
    and d.rating <= :rating
    ORDER BY d.consultationfee asc
       `;
      const binds = {
              id:id,
              rating:rating,
            }

// Execute the query with binds and options
const result = await connection.execute(sql, binds, options);
return result;
}
else if(sorting == 'feeslow'){
const sql = `
SELECT 
D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
E.NAME AS NAME,
D.CHAMBERADDRESS,
D.CONSULTATIONFEE,
D.HOSPITALNAME
FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
WHERE E.NAME = :id 
and d.rating <= :rating
ORDER BY d.consultationfee desc
 `;
const binds = {
        id:id,
        rating:rating,
      }

// Execute the query with binds and options
const result = await connection.execute(sql, binds, options);
return result;
}
else{
  const sql = `
  SELECT COUNT(a.appointmentid),D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
  dspe.NAME AS NAME,
  D.CHAMBERADDRESS,
  D.CONSULTATIONFEE,
  D.HOSPITALNAME
  from doctor d left join doctorspecialty dspe on (d.doctorid = dspe.DOCTORID)
  left join doctorschedule ds on(d.DOCTORID = ds.DOCTORID)
  left join appointment a on(a.scheduleid = ds.scheduleid)
	where dspe.NAME = :id
  GROUP BY D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME),
  dspe.NAME,
  D.CHAMBERADDRESS,
  D.CONSULTATIONFEE,
  D.HOSPITALNAME
  ORDER BY COUNT(a.appointmentid) desc`;
    const binds = {
            id:id          }

// Execute the query with binds and options
const result = await connection.execute(sql, binds, options);
return result;
}
}

async function searchbymxfeerating(id,mxfee,rating){
  connection = await oracledb.getConnection(dbConfig);

      
          const sql = `
          SELECT 
          D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
          E.NAME AS NAME,
          D.CHAMBERADDRESS,
          D.CONSULTATIONFEE,
          D.HOSPITALNAME
          FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
          WHERE E.NAME = :id and d.rating <= :rating
          and d.consultationfee <= :mxfee
    
             `;
            const binds = {
                    id:id,
                    mxfee:mxfee,
                    rating:rating
                  }
  
    // Execute the query with binds and options
    const result = await connection.execute(sql, binds, options);
    return result;
}

async function searchbymxfee(id,mxfee){
  connection = await oracledb.getConnection(dbConfig);

      
  const sql = `
  SELECT 
  D.DOCTORID,(D.FIRSTNAME || ' ' || D.LASTNAME) AS FULL_NAME,
  E.NAME AS NAME,
  D.CHAMBERADDRESS,
  D.CONSULTATIONFEE,
  D.HOSPITALNAME
  FROM DOCTOR D JOIN DOCTORSPECIALTY E ON(D.DOCTORID = E.DOCTORID)
  WHERE E.NAME = :id
  and d.consultationfee <= :mxfee

     `;
    const binds = {
            id:id,
            mxfee:mxfee
          }

// Execute the query with binds and options
const result = await connection.execute(sql, binds, options);
return result;
}
module.exports = {getdoctorsbyspecialiy,
  getdoctorsbyid,
  searchbyspecialitymcqmxfeerating,
  searchbyspecialitymcqmxfee,
  searchbyspecialitymxfeerating,
  searchbyspecialitymxfee,
  searchbymcqmxfeerating,
  searchbymcqmxfeerating,
  searchbymcqmxfee,
  searchbymcqrating,
  searchbymxfeerating,
  searchbymxfee
};