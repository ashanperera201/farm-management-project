const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const feedingPercentage = require('../business/feeding-percentage/feeding-percentage-manager');

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
                body('averageBodyWeight', 'Average Body Weight is required.').notEmpty(),
                body('feedPercentage', 'Feed Percentage is required.').notEmpty(),
            ]
        }
        case 'udpateDetails':
            return [
                body('owner', 'Owner is required.').notEmpty(),
                body('farmer', 'Farmer is required.').notEmpty(),
                body('pond', 'Pond is required.').notEmpty(),
                body('averageBodyWeight', 'Average Body Weight is required.').notEmpty(),
                body('feedPercentage', 'Feed Percentage is required.').notEmpty(),
            ]
    }
}

exports.getAllDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const details = await feedingPercentage.getDetails();
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
            const feedingPercentageUniqueId = req.params.feedingPercentageUniqueId;
            const feedingPercentageDetails = await feedingPercentage.getDetail(feedingPercentageUniqueId);
            if (feedingPercentageDetails) {
                res.status(201).json(feedingPercentageDetails);
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
            const feedingPercentageReq = req.body;
            const savedResult = await feedingPercentage.saveDetails(feedingPercentageReq);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save feeding percentage details', success: false });
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

            const feedingPercentageDetails = {
                owner: payload.owner,
                farmer: payload.farmer,
                pond: payload.pond,
                samplingDate: payload.samplingDate,
                feedPercentage: payload.feedPercentage,
                feedingPercentageDate: payload.feedingPercentageDate,
                averageBodyWeight: payload.averageBodyWeight
            }

            const savedResult = await feedingPercentage.saveDetail(feedingPercentageDetails);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save feeding percentage details', success: false });
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}

exports.udpateDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;
            const sampleDetail = {
                _id: payload._id,
                owner: payload.owner,
                farmer: payload.farmer,
                pond: payload.pond,
                feedingPercentageUniqueId: payload.feedingPercentageUniqueId,
                feedPercentage: payload.feedPercentage,
                feedingPercentageDate: payload.feedingPercentageDate,
                averageBodyWeight: payload.averageBodyWeight,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode
            }

            const updatedResult = await feedingPercentage.updatedDetail(sampleDetail);
            if (updatedResult) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: 'Failed to udpate feeding percentage details', success: false });
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
            const feedingPercentageIds = JSON.parse(req.body.feedingPercentageIds);
            if (feedingPercentageIds) {
                const deleted = await feedingPercentage.deleteDetails(feedingPercentageIds);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "Failed to delete feeding percentage details.", success: false });
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}