const express = require('express');
oracledb = require('oracledb')

const router = express.Router();
const landingcontroller = require('../Middlewares/landingcontroller')
const dashboardcontroller = require('../Middlewares/dashboardcontroller')
router.get('/', landingcontroller);
router.get('/dashboard',dashboardcontroller.dashboardcontroller);
router.get('/dashboard/upappointment',dashboardcontroller.upcoming_appointmentcontroller)
router.get('/dashboard/pastappointment',dashboardcontroller.past_appointmentcontroller)
router.get('/dashboard/prescriptions',dashboardcontroller.prescriptionss)
router.get('/dashboard/diagnosis',dashboardcontroller.diagnosis)
router.get('/dashboard/pastappointment/:appointmentid',dashboardcontroller.downloadpres)
router.delete('/dashboard/deleteAppointment/:appointmentId',dashboardcontroller.deleteappointment)
router.post('/dashboard/feedback',dashboardcontroller.feedback)
router.get('/dashboard/profile',dashboardcontroller.ptntprofile)
router.get('/dashboard/profileupdate',dashboardcontroller.updateprofile)
router.post('/dashboard/profileupdate',dashboardcontroller.postupdate)
module.exports = router;