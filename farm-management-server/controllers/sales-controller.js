const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const salesManager = require('../business/sales/sales-manager');

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
                body('averageBodyWeight', 'average body weight is required.').notEmpty(),
                body('salesPrice', 'sales price is required.').notEmpty()
            ]
        }
        case 'updateDetail':
            return [
                body('averageBodyWeight', 'average body weight is required.').notEmpty(),
                body('salesPrice', 'sales price is required.').notEmpty()
            ]
    }
}

exports.getAllDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const details = await salesManager.getAllDetails();
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
            const salesUniqueId = req.params.salesUniqueId;
            const saleDetail = await salesManager.getDetail(salesUniqueId);
            if (saleDetail) {
                res.status(201).json(saleDetail);
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
            const salesResult = await salesManager.saveDetails(payload);
            if (salesResult) {
                res.status(201).json(salesResult)
            } else {
                res.status(500).json({ error: 'Failed to save sale details', success: false });
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

            const salesPayload = {
                averageBodyWeight: payload.averageBodyWeight,
                salesPrice: payload.salesPrice,
            }

            const savedResult = await salesManager.saveDetail(salesPayload);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save sale details', success: false });
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
                salesUniqueId: payload.salesUniqueId,
                averageBodyWeight: payload.averageBodyWeight,
                salesPrice: payload.salesPrice,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode
            }

            const updatedResult = await salesManager.updateDetail(udpatePayload);
            if (updatedResult) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: 'Failed to save sale details', success: false });
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
            const salesIds = JSON.parse(req.body.salesIds);
            if (salesIds) {
                const deleted = await salesManager.deleteDetails(salesIds);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "Failed to save sale details.", success: false });
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}