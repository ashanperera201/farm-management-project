const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const pondManagementManager = require('../business/pond-management/pond-management-manager');

exports.validateHeaders = () => {
    return [
        header('x-user', 'Header\'s required.').notEmpty(),
        header('x-client', 'Header\'s required.').notEmpty(),
        header('x-country', 'Header\'s required.').notEmpty()
    ]
}

exports.validate = (method) => {
    switch (method) {
        case 'savePondDetail': {
            return [
                body('owner', 'Owner is required.').notEmpty(),
                body('farmer', 'Farmer is required.').notEmpty(),
                body('pondNo', 'Pond count is required.').notEmpty(),
                body('areaOfPond', 'Area of pond is required.').notEmpty(),
                body('gradeOfPond', 'Grade of pond is required.').notEmpty(),
                body('fixedCost', 'Fixed cost is required.').notEmpty(),
            ]
        }
        case 'updatePondDetail':
            return [
                body('owner', 'Owner is required.').notEmpty(),
                body('farmer', 'Farmer is required.').notEmpty(),
                body('pondNo', 'Pond count is required.').notEmpty(),
                body('areaOfPond', 'Area of pond is required.').notEmpty(),
                body('gradeOfPond', 'Grade of pond is required.').notEmpty(),
                body('fixedCost', 'Fixed cost is required.').notEmpty(),
            ]
    }
}

exports.getAllPondDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const pondDetails = await pondManagementManager.getPondDetails();
            if (pondDetails) {
                res.status(200).json(pondDetails);
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

exports.getPondDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const pondDetailId = req.params.pondDetailId;
            const pondDetail = await pondManagementManager.getPondDetail(pondDetailId);
            if (pondDetail) {
                res.status(201).json(pondDetail);
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

exports.savePondDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const payload = req.body;
            const pondDetail = {
                owner: payload.owner,
                farmer: payload.farmer,
                pondNo: payload.pondNo,
                areaOfPond: payload.areaOfPond,
                gradeOfPond: payload.gradeOfPond,
                fixedCost: payload.fixedCost
            }

            const savedResult = await pondManagementManager.savePondDetails(pondDetail);
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

exports.updatePondDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;
            const pondDetail = {
                _id: payload._id,
                pondUniqueId: payload.pondUniqueId,
                owner: payload.owner,
                farmer: payload.farmer,
                pondNo: payload.pondNo,
                areaOfPond: payload.areaOfPond,
                gradeOfPond: payload.gradeOfPond,
                fixedCoust: payload.fixedCoust,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode
            }

            const updatedResult = await pondManagementManager.updatePondDetail(pondDetail);
            if (updatedResult) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: 'Failed to udpate pond details', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}


exports.deletePondDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const pondDetailIds = JSON.parse(req.body.pondDetailIds);
            if (pondDetailIds) {
                const deleted = await pondManagementManager.deletePondDetail(pondDetailIds);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "Failed to delete pond details.", success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}