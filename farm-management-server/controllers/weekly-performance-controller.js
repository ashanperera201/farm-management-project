const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const weeklyPerformanceManager = require('../business/weekly-performance/weekly-performance-manager');

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
                body('weekNumber', 'Week number is required.').notEmpty()
            ]
        }
        case 'updateDetail':
            return [
                body('owner', 'Owner is required.').notEmpty(),
                body('farmer', 'Farmer is required.').notEmpty(),
                body('pond', 'Pond is required.').notEmpty(),
                body('weekNumber', 'Week number is required.').notEmpty()
            ]
    }
}

exports.getAllDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const details = await weeklyPerformanceManager.getAllDetails();
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
            const weeklyPerformanceId = req.params.weeklyPerformanceId;
            const dailyFeed = await weeklyPerformanceManager.getDetail(weeklyPerformanceId);
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
            const savedResult = await weeklyPerformanceManager.saveDetails(payload);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save  weekly performance details', success: false });
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
                weekNumber: payload.weekNumber
            }

            const savedResult = await weeklyPerformanceManager.saveDetail(weeklyAppForm);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save weekly performance details', success: false });
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
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode
            }

            const updatedResult = await weeklyPerformanceManager.updateDetail(udpatePayload);
            if (updatedResult) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: 'Failed to udpate weekly performance details', success: false });
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
                const deleted = await weeklyPerformanceManager.deleteDetails(weeklyApplicationIds);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "Failed to delete weekly performance details.", success: false });
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}