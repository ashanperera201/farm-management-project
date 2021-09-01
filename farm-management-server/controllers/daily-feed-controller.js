const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const dailyFeedManager = require('../business/daily-feed/daily-feed-manager');

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
                body('dailyFeedDate', 'Date is required.').notEmpty(),
                body('calculatedDailyFeed', 'date culture is required.').notEmpty(),
                body('actualNumberOfKilos', 'Total weight is required.').notEmpty(),
            ]
        }
        case 'updateDetail':
            return [
                body('owner', 'Owner is required.').notEmpty(),
                body('farmer', 'Farmer is required.').notEmpty(),
                body('pond', 'Pond is required.').notEmpty(),
                body('dailyFeedDate', 'Date is required.').notEmpty(),
                body('calculatedDailyFeed', 'date culture is required.').notEmpty(),
                body('actualNumberOfKilos', 'Total weight is required.').notEmpty(),
            ]
    }
}

exports.getAllDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const details = await dailyFeedManager.getAllDetails();
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
            const dailyFeedId = req.params.dailyFeedId;
            const dailyFeed = await dailyFeedManager.getDetail(dailyFeedId);
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
            const dailFeed = req.body;
            const savedResult = await dailyFeedManager.saveDetails(dailFeed);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save  daily feed details', success: false });
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

            const dailyFeed = {
                owner: payload.owner,
                farmer: payload.farmer,
                pond: payload.pond,
                dailyFeedDate: payload.dailyFeedDate,
                calculatedDailyFeed: payload.calculatedDailyFeed,
                actualNumberOfKilos: payload.actualNumberOfKilos,
                remark: payload.remark
            }

            const savedResult = await dailyFeedManager.saveDetail(dailyFeed);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save daily feed details', success: false });
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
            const dailyFeed = {
                _id: payload._id,
                dailyFeedUniqueId: payload.dailyFeedUniqueId,
                owner: payload.owner,
                farmer: payload.farmer,
                pond: payload.pond,
                dailyFeedDate: payload.dailyFeedDate,
                calculatedDailyFeed: payload.calculatedDailyFeed,
                actualNumberOfKilos: payload.actualNumberOfKilos,
                remark: payload.remark,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode
            }

            const updatedResult = await dailyFeedManager.updateDetail(dailyFeed);
            if (updatedResult) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: 'Failed to udpate daily feed details', success: false });
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
            const dailyFeedIds = JSON.parse(req.body.dailyFeedIds);
            if (dailyFeedIds) {
                const deleted = await dailyFeedManager.deleteDetails(dailyFeedIds);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "Failed to delete daily feed details.", success: false });
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}