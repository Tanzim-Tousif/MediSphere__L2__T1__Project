// routes/diagnosticCenters.js

const express = require('express');
const router = express.Router();
oracledb = require('oracledb')

const dbConfig = {
    user: 'c##bookstore',
    password: 'bookstore',
    connectString: 'localhost:1521/ORCL'
  };
router.get('/diagnostics', async (req, res, next) => {
    try {
        connection = await oracledb.getConnection(dbConfig);  
            const query = `SELECT * FROM DiagnosticCenter`;
      
      // Set options for execute method
      const options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT, // Output format as OBJECT
        autoCommit: true // Automatically commit the transaction
      };
  
      // Execute the query with options
      const result = await connection.execute(query, [], options);
      await connection.close();
     // console.log(result.rows);
      
      // Set outbound to true
      res.render('diagnostics.ejs', { diagnosticCenters: result.rows,
        user:req.session.user.id,
        outbound: true });
    } catch (error) {
      next(error);
    }
  });

  router.get('/diagnostics/:id', async (req, res, next) => {
    try {
        connection = await oracledb.getConnection(dbConfig);  
      const diagnosticCenterId = req.params.id;
      const query = `
        SELECT d.*, ot.TestName, ot.Price 
        FROM DiagnosticCenter d 
        JOIN OfferedTest ot ON d.DiagnosticCenterID = ot.DiagnosticCenterID 
        WHERE d.DiagnosticCenterID = :id
      `;
      const result = await connection.execute(query, [diagnosticCenterId], { outFormat: oracledb.OUT_FORMAT_OBJECT });
      await connection.close();
  
      // Extract diagnostic center details, offered tests, and prices
      const diagnosticCenter = result.rows[0]; // Assuming the diagnostic center details are in the first row
      const offeredTests = result.rows.map(row => ({ testName: row.TESTNAME, price: row.PRICE }));
  
      // Render details template with diagnostic center data, offered tests, and prices
      res.render('diagnostic_details.ejs', { diagnosticCenter, offeredTests,user:req.session.user.id });
    } catch (error) {
      next(error);
    }
});

module.exports = router;
