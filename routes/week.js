const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { createWeek, readWeek, readWeekByDate, updateWeek } = require('../controllers/week');

router.get('/', auth, readWeekByDate)
router.post('/create', auth, createWeek);
router.get('/:id', auth, readWeek);
router.post('/update/:id', auth, updateWeek);

module.exports = router;