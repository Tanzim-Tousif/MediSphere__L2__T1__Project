const express = require('express');
const doctors = require('../Database/DB-specified-doctors')
const router = express.Router();
const consultationcontroller = require('../Middlewares/consultationcontroller');
const specificdoctorhandler = require('../Middlewares/specificdoctor');
//Home page randering
router.get('/', consultationcontroller);
router.get('/:id',specificdoctorhandler);
module.exports = router;