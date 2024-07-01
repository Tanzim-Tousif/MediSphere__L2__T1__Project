const express = require('express');
const router = express.Router();
const bookedappoinmentsss = require('../Middlewares/bookedappoinments');
const appoinmentconfirmation = require('../Middlewares/appoinmentconfirmation');
//Home page randeri
router.post('/book',bookedappoinmentsss);
router.get('/confirmation',appoinmentconfirmation.appooinmentconfirmation);
router.get('/letter',appoinmentconfirmation.appoinmentletter)
module.exports = router;