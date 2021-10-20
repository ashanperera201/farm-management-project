const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const stockManager = require('../business/stocking/stocking-manager');

exports.validateHeaders = () => {
    return [
        header('x-user', 'Header\'s required.').notEmpty(),
        header('x-client', 'Header\'s required.').notEmpty(),
        header('x-country', 'Header\'s required.').notEmpty()
    ]
}

exports.validate = (method) => {
    switch (method) {
        case 'saveStockDetail': {
            return [
                body('owner', 'Owner is required.').notEmpty(),
                body('farmer', 'Farmer is required.').notEmpty(),
                body('pond', 'Pond is required.').notEmpty(),
                body('plCount', 'Pl count is required.').notEmpty(),
                body('plAge', 'Pl age is required.').notEmpty(),
                body('dateOfStocking', 'Date of stocking is required.').notEmpty(),
                body('fullStocked', 'Full stock is required.').notEmpty(),
                body('plPrice', 'pl price is required.').notEmpty(),
            ]
        }
        case 'updateStockDetail':
            return [
                body('owner', 'Owner is required.').notEmpty(),
                body('farmer', 'Farmer is required.').notEmpty(),
                body('pond', 'Pond is required.').notEmpty(),
                body('plCount', 'Pl count is required.').notEmpty(),
                body('plAge', 'Pl age is required.').notEmpty(),
                body('dateOfStocking', 'Date of stocking is required.').notEmpty(),
                body('fullStocked', 'Full stock is required.').notEmpty(),
                body('plPrice', 'pl price is required.').notEmpty(),
            ]
    }
}

exports.getAllStockDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const stockDetails = await stockManager.getStockDetails();
            if (stockDetails) {
                res.status(200).json(stockDetails);
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

exports.getStockDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const stockDetailId = req.params.stockDetailId;
            const stockDetail = await stockManager.getStockDetail(stockDetailId);
            if (stockDetail) {
                res.status(201).json(stockDetail);
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

exports.saveStockDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const stockDetails = req.body;
            const savedResult = await stockManager.saveStockDetails(stockDetails);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save stock details', success: false });
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}

exports.saveStockDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const payload = req.body;
            const stockDetail = {
                owner: payload.owner,
                farmer: payload.farmer,
                pond: payload.pond,
                plCount: payload.plCount,
                plAge: payload.plAge,
                dateOfStocking: payload.dateOfStocking,
                fullStocked: payload.fullStocked,
                plPrice: payload.plPrice,
                actualPlRemains: payload.actualPlRemains,
                cycle: payload.cycle
            }
            const savedResult = await stockManager.saveStockDetail(stockDetail);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save stock details', success: false });
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}

exports.updateStockDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;
            const stockDetail = {
                _id: payload._id,
                stockingUniqueId: payload.stockingUniqueId,
                owner: payload.owner,
                farmer: payload.farmer,
                pond: payload.pond,
                plCount: payload.plCount,
                plAge: payload.plAge,
                dateOfStocking: payload.dateOfStocking,
                fullStocked: payload.fullStocked,
                plPrice: payload.plPrice,
                actualPlRemains: payload.actualPlRemains,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode,
                cycle: payload.cycle
            }

            const updatedResult = await stockManager.updateStockDetail(stockDetail);
            if (updatedResult) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: 'Failed to udpate stock details', success: false });
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}

exports.deleteStockDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const stockDetailIds = JSON.parse(req.body.stockDetailIds);
            if (stockDetailIds) {
                const deleted = await stockManager.deleteStockDetail(stockDetailIds);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "Failed to delete stock details.", success: false });
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}