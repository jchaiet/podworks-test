const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { createTeam, readTeam, readUserTeams, readTeamByField, updateTeam, deleteTeam } = require('../controllers/team');

router.get('/all', auth, readUserTeams)
router.post('/create', auth, createTeam);
router.get('/:id', auth, readTeam);
router.post('/update/:id', auth, updateTeam);
router.delete('/delete/:id', auth, deleteTeam);
router.get('/', auth, readTeamByField)

module.exports = router;