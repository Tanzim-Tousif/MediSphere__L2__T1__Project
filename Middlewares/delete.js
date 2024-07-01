const express = require('express');
const router = express.Router();
//const { dbConfig } = require('./dbConfig'); // Assuming you have your database configuration in a separate file

const dbConfig = {
    user: 'c##bookstore',
    password: 'bookstore',
    connectString: 'localhost:1521/ORCL'
  };

// Route to delete a doctor by ID
  const deletedoctors =  async (req, res) => {
    const doctorId = req.params.id;
    try {
        const connection = await oracledb.getConnection(dbConfig);
        await connection.execute(`DELETE FROM DOCTOR WHERE DOCTORID = :id`, { id: doctorId }, { autoCommit: true });
        await connection.close();
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).send('An error occurred while deleting doctor');
    }
};

// Route to delete a patient by ID
const deletepatient =  async (req, res) => {
    console.log("in delete patient ")
    const patientId = req.params.id;
    try {
        const connection = await oracledb.getConnection(dbConfig);
        await connection.execute(`DELETE FROM APPOINTMENT WHERE PATIENTID = :id`, { id: patientId }, { autoCommit: true });
        // Delete patient from PATIENT table
        await connection.execute(`DELETE FROM PATIENT WHERE PATIENTID = :id`, { id: patientId }, { autoCommit: true });
        await connection.close();
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).send('An error occurred while deleting patient');
    }
};


// Route to delete an appointment by ID
const deleteappointment =  async (req, res) => {
    const appointmentId = req.params.id;
    try {
        const connection = await oracledb.getConnection(dbConfig);
        await connection.execute(`DELETE FROM APPOINTMENT WHERE APPOINTMENTID = :id`, { id: appointmentId }, { autoCommit: true });
        await connection.close();
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).send('An error occurred while deleting appointment');
    }
};

module.exports = {
    deleteappointment,
    deletedoctors,
    deletepatient
};
