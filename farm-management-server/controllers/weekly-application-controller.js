const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const weeklyApplication = require('../business/weekly-application/weekly-application-manager');

exports.validateHeaders = () => {
    return [
        header('x-user', 'Header\'s required.').notEmpty(),
        header('x-client', 'Header\'s required.').notEmpty(),
        header('x-country', 'Header\'s required.').notEmpty()
    ]
}

exports.validate = (method) => {

    switch (method) {
        case 'saveDetail': {
            return [
                body('owner', 'Owner is required.').notEmpty(),
                body('farmer', 'Farmer is required.').notEmpty(),
                body('pond', 'Pond is required.').notEmpty(),
                body('weekNumber', 'Week number is required.').notEmpty(),
                body('application', 'Application type is required.').notEmpty(),
                body('unit', 'Unit is required.').notEmpty(),
                body('numberOfUnit', 'Number of unit is required.').notEmpty(),
            ]
        }
        case 'updateDetail':
            return [
                body('owner', 'Owner is required.').notEmpty(),
                body('farmer', 'Farmer is required.').notEmpty(),
                body('pond', 'Pond is required.').notEmpty(),
                body('weekNumber', 'Week number is required.').notEmpty(),
                body('application', 'Application type is required.').notEmpty(),
                body('unit', 'Unit is required.').notEmpty(),
                body('numberOfUnit', 'Number of unit is required.').notEmpty(),
            ]
    }
}

exports.getAllDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const details = await weeklyApplication.getAllDetails();
            if (details) {
                res.status(200).json(details);
            } else {
                res.status(202).json(null)
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.getDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const weeklyApplicationId = req.params.weeklyApplicationId;
            const dailyFeed = await weeklyApplication.getDetail(weeklyApplicationId);
            if (dailyFeed) {
                res.status(201).json(dailyFeed);
            } else {
                res.status(202).json(null)
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.saveDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const payload = req.body;
            const savedResult = await weeklyApplication.saveDetails(payload);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save  weekly application details', success: false });
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}

exports.saveDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const payload = req.body;

            const weeklyAppForm = {
                owner: payload.owner,
                farmer: payload.farmer,
                pond: payload.pond,
                weekNumber: payload.weekNumber,
                application: payload.application,
                unit: payload.unit,
                numberOfUnit: payload.numberOfUnit,
            }

            const savedResult = await weeklyApplication.saveDetail(weeklyAppForm);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save weekly application details', success: false });
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}

exports.updateDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const payload = req.body;
            const udpatePayload = {
                _id: payload._id,
                weeklyApplicationUniqueId: payload.weeklyApplicationUniqueId,
                owner: payload.owner,
                farmer: payload.farmer,
                pond: payload.pond,
                weekNumber: payload.weekNumber,
                application: payload.application,
                unit: payload.unit,
                numberOfUnit: payload.numberOfUnit,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode
            }

            const updatedResult = await weeklyApplication.updateDetail(udpatePayload);
            if (updatedResult) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: 'Failed to udpate weekly application details', success: false });
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}

exports.deleteDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const weeklyApplicationIds = JSON.parse(req.body.weeklyApplicationIds);
            if (weeklyApplicationIds) {
                const deleted = await weeklyApplication.deleteDetails(weeklyApplicationIds);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "Failed to delete weekly application details.", success: false });
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}