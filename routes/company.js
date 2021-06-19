const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { createCompany, readCompany, updateCompany, deleteCompany } = require('../controllers/company');

router.post('/create', auth, createCompany);
router.get('/:id', auth, readCompany);
router.post('/update/:id', auth, updateCompany);
router.delete('/delete/:id', auth, deleteCompany);

module.exports = router;