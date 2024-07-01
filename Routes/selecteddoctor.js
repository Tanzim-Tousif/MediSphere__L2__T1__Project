const express = require('express');
const doctors = require('../Middlewares/selecteddoctor')
const doclogin = require('../Middlewares/doctorlogin')
const docdashboard = require('../Middlewares/doctordashboard')
const appoinmens = require('../Middlewares/appoinments');
const docsignupcontroller  = require('../Middlewares/docsignupcontroller');
const { dashboardcontroller } = require('../Middlewares/dashboardcontroller');
const router = express.Router(); 
router.get('/dashboard',docdashboard.dashboardloading)
router.get('/dashboard/profile',docdashboard.fetchdocProfile)
router.get('/dashboard/schedule',docdashboard.SetSchedule)
router.post('/dashboard/schedule/set',docdashboard.setnextschedule)
router.get('/dashboard/scheduleappointments',docdashboard.scheduleappointments)
router.get('/dashboard/upcomingappointments',docdashboard.upcoming_appointmentcontroller)
router.get('/dashboard/pastappointments',docdashboard.past_appointments)
router.get('/dashboard/upschedules',docdashboard.upschedules)
router.post('/login/logincheck',doclogin.docauth);
router.get('/:id',doctors);
router.get('/appoinments/:id',appoinmens);

module.exports = router;