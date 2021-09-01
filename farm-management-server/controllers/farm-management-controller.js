const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const farmManagementManager = require('../business/farm-management/farm-management-manager');

exports.validateHeaders = () => {
    return [
        header('x-user', 'Header\'s required.').notEmpty(),
        header('x-client', 'Header\'s required.').notEmpty(),
        header('x-country', 'Header\'s required.').notEmpty()
    ]
}

exports.validate = (method) => {
    switch (method) {
        case 'saveFarmDetail': {
            return [
                body('farmName', 'Farm name is required.').notEmpty(),
                body('address', 'Address is required.').notEmpty(),
                body('pondCount', 'Pond count is required.').notEmpty(),
            ]
        }
        case 'udpateFarmDetail':
            return [
                body('farmName', 'Farm name is required.').notEmpty(),
                body('address', 'Address is required.').notEmpty(),
                body('pondCount', 'Pond count is required.').notEmpty(),
            ]
    }
}

exports.getAllFarmDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const farmDetails = await farmManagementManager.getFarmDetails();
            if (farmDetails) {
                res.status(200).json(farmDetails);
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

exports.getFarmDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const farmDetailId = req.params.farmDetailId;
            const farmDetail = await farmManagementManager.getFarmDetail(farmDetailId);
            if (farmDetail) {
                res.status(201).json(farmDetail);
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

exports.saveFarmDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const payload = req.body;
            const clubMember = {
                owner: payload.owner,
                farmName: payload.farmName,
                contactNo: payload.contactNo,
                address: payload.address,
                pondCount: payload.pondCount
            }
            const savedResult = await farmManagementManager.saveFarmDetails(clubMember);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save farm details', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.udpateFarmDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const payload = req.body;
            const clubMember = {
                _id: payload._id,
                farmUniqueId: payload.farmUniqueId,
                owner: payload.owner,
                farmName: payload.farmName,
                contactNo: payload.contactNo,
                address: payload.address,
                pondCount: payload.pondCount,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode
            }
            const updatedResult = await farmManagementManager.updateFarmDetail(clubMember);
            if (updatedResult) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: 'Failed to udpate farm details', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}


exports.deleteFarmDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const farmDetailIds = JSON.parse(req.body.farmDetailIds);
            if (farmDetailIds) {
                const deleted = await farmManagementManager.deleteFarmDetail(farmDetailIds);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "Failed to delete farm details.", success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}