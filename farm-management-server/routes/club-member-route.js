const express = require('express')
const router = express.Router()
const path = require('path');
require('dotenv-extended').load({ path: path.resolve(__dirname, '../env-default.env') });
const clubMemberController = require('../controllers/club-member-controller');

const environmentConfigs = process.env

router.get(`${environmentConfigs.getAllclubMemberDetails}`, clubMemberController.validateHeaders(), clubMemberController.getClubMemberDetails);
router.get(`${environmentConfigs.getClubMemberDetail}`, clubMemberController.validateHeaders(), clubMemberController.getClubMemberDetail);
router.post(`${environmentConfigs.createClubMember}`, clubMemberController.validateHeaders(), clubMemberController.validate('saveClubMember'), clubMemberController.saveClubMember);
router.put(`${environmentConfigs.updateClubMember}`, clubMemberController.validateHeaders(), clubMemberController.validate('updateClubMember'), clubMemberController.updateClubMember);
router.post(`${environmentConfigs.deleteClubMembers}`, clubMemberController.validateHeaders(), clubMemberController.deleteClubMemberDetails);

module.exports = router;