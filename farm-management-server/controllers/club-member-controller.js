const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const clubMemberManager = require('../business/club-member/club-member-manager');

exports.validateHeaders = () => {
    return [
        header('x-user', 'Header\'s required.').notEmpty(),
        header('x-client', 'Header\'s required.').notEmpty(),
        header('x-country', 'Header\'s required.').notEmpty()
    ]
}

exports.validate = (method) => {
    switch (method) {
        case 'saveClubMember': {
            return [
                body('firstName', 'First name is required.').notEmpty(),
                body('lastName', 'Last naem is required.').notEmpty(),
                body('address', 'Address is required.').notEmpty(),
                body('city', 'City is required.').notEmpty(),
                body('nic', 'National identity card is required.').notEmpty(),
            ]
        }
        case 'updateClubMember':
            return [
                body('firstName', 'First name is required.').notEmpty(),
                body('lastName', 'Last naem is required.').notEmpty(),
                body('address', 'Address is required.').notEmpty(),
                body('city', 'City is required.').notEmpty(),
                body('nic', 'National identity card is required.').notEmpty(),
            ]
    }
}

exports.getClubMemberDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const clubMemberDetails = await clubMemberManager.getAllClubMembers();
            if (clubMemberDetails) {
                res.status(201).json(clubMemberDetails);
            } else {
                res.status(202).json(null)
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.getClubMemberDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const clubMemberId = req.params.clubMemberId;
            const clubMemberDetails = await clubMemberManager.getClubMember(clubMemberId);
            if (clubMemberDetails) {
                res.status(201).json(clubMemberDetails);
            } else {
                res.status(202).json(null)
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.saveClubMember = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;

            const clubMember = {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                contactNumber: payload.contactNumber,
                address: payload.address,
                city: payload.city,
                nic: payload.nic,
                userName: payload.userName,
                password: payload.password
            }
            const savedResult = await clubMemberManager.saveClubMember(clubMember);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save clube member', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.updateClubMember = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;

            const clubMember = {
                _id: payload._id,
                clubMemberId: payload.clubMemberId,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                contactNumber: payload.contactNumber,
                address: payload.address,
                city: payload.city,
                nic: payload.nic,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode
            }

            const updatedResult = await clubMemberManager.udpateClubMember(clubMember);
            if (updatedResult) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: 'Failed to save clube member', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}


exports.deleteClubMemberDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const clubMemberIds = JSON.parse(req.body.clubMemberIds);
            if (clubMemberIds) {
                const deleted = await clubMemberManager.deleteClubMembers(clubMemberIds);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "Club member id's required.", success: false })
            }
        } else { 
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}