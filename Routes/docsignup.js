const express = require('express');
const router = express.Router();
const docsignupcontroller = require('../Middlewares/docsignupcontroller')
//Home page randering
router.get('/', docsignupcontroller.loadsignuppage);
router.post('/',docsignupcontroller.savedatatodatabase)
module.exports = router;