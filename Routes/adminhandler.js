const express = require('express');

const router = express.Router();
const adminmiddleware = require('../Middlewares/admin')
router.get('/', adminmiddleware.adminpage);
router.get('/alldoctors',adminmiddleware.alldoctors)
router.get('/allpatients',adminmiddleware.allpatients)
router.get('/alldeletedappointments',adminmiddleware.deledtedappointments)
module.exports = router;
