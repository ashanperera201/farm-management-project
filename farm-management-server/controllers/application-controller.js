const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const applicationsManager = require('../business/application/application-manager');

exports.validateHeaders = () => {
    return [
        header('x-user', 'Header\'s required.').notEmpty(),
        header('x-client', 'Header\'s required.').notEmpty(),
        header('x-country', 'Header\'s required.').notEmpty()
    ]
}

exports.validate = (method) => {
    switch (method) {
        case 'saveApplication': {
            return [
                body('applicationType', 'Application type is required.').notEmpty(),
                body('applicantName', 'Application naem is required.').notEmpty(),
            ]
        }
        case 'updateApplication':
            return [
                body('applicationType', 'Application type is required.').notEmpty(),
                body('applicantName', 'Application naem is required.').notEmpty(),
            ]
    }
}

exports.getAplicationDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const details = await applicationsManager.getApplications();
            if (details) {
                res.status(201).json(details);
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

exports.getApplication = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const applicationId = req.params.applicationId;
            const application = await applicationsManager.getApplication(applicationId);
            if (application) {
                res.status(201).json(application);
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

exports.saveApplication = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const payload = req.body;
            const applicationDetails = {
                applicationType: payload.applicationType,
                applicantName: payload.applicantName,
                unit: payload.unit,
                costPerUnit: payload.costPerUnit
            }
            const savedResult = await applicationsManager.saveApplications(applicationDetails);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save applications', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.updateApplication = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;

            const applicationDetail = {
                _id: payload._id,
                applicationUniqueId: payload.applicationUniqueId,
                applicationType: payload.applicationType,
                applicantName: payload.applicantName,
                unit: payload.unit,
                costPerUnit: payload.costPerUnit,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode
            }

            const updatedResult = await applicationsManager.udpateApplications(applicationDetail);
            if (updatedResult) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: 'Failed to save applications', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}


exports.deleteApplications = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const applicationIds = JSON.parse(req.body.applicationIds);
            if (applicationIds) {
                const deleted = await applicationsManager.deleteApplicationDetail(applicationIds);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "Application id's required.", success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}