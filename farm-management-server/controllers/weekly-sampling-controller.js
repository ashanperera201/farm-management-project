const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const weeklySampling = require('../business/weekly-sampling/weekly-sampling-manager');

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
                body('samplingDate', 'Date is required.').notEmpty(),
                body('dateOfCulture', 'date culture is required.').notEmpty(),
                body('totalWeight', 'Total weight is required.').notEmpty(),
                body('totalShrimp', 'Total shrimp is required.').notEmpty(),
                body('expectedSurvivalPercentage', 'Servival percentage is required.').notEmpty(),
            ]
        }
        case 'udpateWeeklySample':
            return [
                body('owner', 'Owner is required.').notEmpty(),
                body('farmer', 'Farmer is required.').notEmpty(),
                body('pond', 'Pond is required.').notEmpty(),
                body('samplingDate', 'Date is required.').notEmpty(),
                body('dateOfCulture', 'date culture is required.').notEmpty(),
                body('totalWeight', 'Total weight is required.').notEmpty(),
                body('totalShrimp', 'Total shrimp is required.').notEmpty(),
                body('expectedSurvivalPercentage', 'Servival percentage is required.').notEmpty(),
            ]
    }
}

exports.getAllDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const details = await weeklySampling.getDetails();
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
            const weeklySamplingId = req.params.weeklySamplingId;
            const weeklySapmle = await weeklySampling.getWeeklySampling(weeklySamplingId);
            if (weeklySapmle) {
                res.status(201).json(weeklySapmle);
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
            const weeklySamples = req.body;
            const savedResult = await weeklySampling.saveDetails(weeklySamples);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save weekly sample details', success: false });
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

            const weeklySampleDetail = {
                owner: payload.owner,
                farmer: payload.farmer,
                pond: payload.pond,
                samplingDate: payload.samplingDate,
                dateOfCulture: payload.dateOfCulture,
                totalWeight: payload.totalWeight,
                previousAwbAfterHarvesting: payload.previousAwbAfterHarvesting,
                totalShrimp: payload.totalShrimp,
                averageBodyWeight: payload.averageBodyWeight,
                previousAwb: payload.previousAwb,
                gainInWeight: payload.gainInWeight,
                expectedSurvivalPercentage: payload.expectedSurvivalPercentage
            }

            const savedResult = await weeklySampling.saveDetail(weeklySampleDetail);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save weekly sample details', success: false });
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}

exports.udpateWeeklySample = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;
            const sampleDetail = {
                _id: payload._id,
                samplingUniqueId: payload.samplingUniqueId,
                owner: payload.owner,
                farmer: payload.farmer,
                pond: payload.pond,
                samplingDate: payload.samplingDate,
                dateOfCulture: payload.dateOfCulture,
                totalWeight: payload.totalWeight,
                totalShrimp: payload.totalShrimp,
                averageBodyWeight: payload.averageBodyWeight,
                previousAwb: payload.previousAwb,
                gainInWeight: payload.gainInWeight,
                previousAwbAfterHarvesting: payload.previousAwbAfterHarvesting,
                expectedSurvivalPercentage: payload.expectedSurvivalPercentage,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode
            }

            const updatedResult = await weeklySampling.updatedDetail(sampleDetail);
            if (updatedResult) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: 'Failed to udpate weekly sample details', success: false });
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
            const weeklySampleIds = JSON.parse(req.body.weeklySampleIds);
            if (weeklySampleIds) {
                const deleted = await weeklySampling.deleteDetails(weeklySampleIds);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "Failed to delete weekly sample details.", success: false });
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}