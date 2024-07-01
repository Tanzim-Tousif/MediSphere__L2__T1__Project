// route.js
const express = require('express');
const router = express.Router();
const logincontroller = require('../Middlewares/logincontroller')
const auth = require('../Middlewares/auth')
//Home page randering
router.get('/', logincontroller);
router.post('/logincheck',auth);
module.exports = router;