// route.js
const express = require('express');
const router = express.Router();
const signupcontroller = require('../Middlewares/signupcontroller')
const signup = require('../Middlewares/signup')
//Home page randering
router.get('/', signupcontroller);
router.post('/',signup)
module.exports = router;