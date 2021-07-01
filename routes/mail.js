const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { sendInvitationEmail } = require('../controllers/mail');

router.post('/invite', auth, sendInvitationEmail);

module.exports = router;