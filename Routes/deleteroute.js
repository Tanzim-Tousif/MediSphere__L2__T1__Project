const express = require('express');

const router = express.Router();
const deletemiddleware = require('../Middlewares/delete')
router.delete('/doctors/:id', deletemiddleware.deletedoctors);
router.delete('/patients/:id',deletemiddleware.deletepatient)
router.delete('/appointments/:id',deletemiddleware.deleteappointment)
module.exports = router;
