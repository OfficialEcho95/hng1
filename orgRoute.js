const express = require('express');
const { getOrganisations, getOrganisation, createOrganisation, addUserToOrganisation } = require('./organizationController');
const { authenticateToken } = require('./authMiddleware');


const router = express.Router();

router.use(authenticateToken);

router.get('/', getOrganisations);
router.get('/:orgId', getOrganisation);
router.post('/', createOrganisation);
router.post('/:orgId/users', addUserToOrganisation);

module.exports = router;
