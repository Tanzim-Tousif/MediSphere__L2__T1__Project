const express = require('express');
const doclogin = require('../Middlewares/doctorlogin')
const docsignupcontroller  = require('../Middlewares/docsignupcontroller');
const router = express.Router(); 
router.get('/login',doclogin.doclogincontroller)
router.get('/signup',docsignupcontroller.loadsignuppage)
router.post('/docsignup',docsignupcontroller.savedatatodatabase)

module.exports = router;