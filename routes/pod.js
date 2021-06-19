const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { upsertPod, readPod, readPodByField, updatePod, addUserToPod, removeUserFromPod } = require('../controllers/pod');

router.post('/upsert', auth, upsertPod);
router.get('/:id', auth, readPod);
router.post('/update/:id', auth, updatePod);
router.post('/add/:id', auth, addUserToPod);
router.post('/remove/:id', auth, removeUserFromPod);
router.get('/', auth, readPodByField)

module.exports = router;