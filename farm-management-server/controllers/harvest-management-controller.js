const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const harvestManagement = require('../business/harvest-management/harvest-manager');

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
                body('harvestDate', 'Harvest date is required.').notEmpty(),
                body('harvestType', 'Harvest Type is required.').notEmpty(),
                body('harvestQuantity', 'Harvest Quantity is required.').notEmpty(),
                body('harvestAWB', 'Harvest AWB is required.').notEmpty(),
                body('harvestSalePrice', 'Harvest Sale Price is required.').notEmpty(),
            ]
        }
        case 'updateDetail':
            return [
                body('owner', 'Owner is required.').notEmpty(),
                body('farmer', 'Farmer is required.').notEmpty(),
                body('pond', 'Pond is required.').notEmpty(),
                body('harvestDate', 'Harvest date is required.').notEmpty(),
                body('harvestType', 'Harvest Type is required.').notEmpty(),
                body('harvestQuantity', 'Harvest Quantity is required.').notEmpty(),
                body('harvestAWB', 'Harvest AWB is required.').notEmpty(),
                body('harvestSalePrice', 'Harvest Sale Price is required.').notEmpty(),
            ]
    }
}
 
exports.getAllDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const details = await harvestManagement.getDetails();
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
            const harvestManagementUniqueId = req.params.harvestManagementUniqueId;
            const harvestDetail = await harvestManagement.getDetail(harvestManagementUniqueId);
            if (harvestDetail) {
                res.status(201).json(harvestDetail);
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
            const harvestDetails = req.body;
            const savedResult = await harvestManagement.saveDetails(harvestDetails);
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

            const harvestDetail = {
                owner: payload.owner,
                farmer: payload.farmer,
                pond: payload.pond,
                harvestDate: payload.harvestDate,
                harvestType: payload.harvestType,
                harvestQuantity: payload.harvestQuantity,
                harvestAWB: payload.harvestAWB,
                harvestSalePrice:payload.harvestSalePrice
            }

            const savedResult = await harvestManagement.saveDetail(harvestDetail);
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

exports.updateDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;
            const harvestDetail = {
                _id: payload._id,
                harvestManagementUniqueId: payload.harvestManagementUniqueId,
                owner: payload.owner,
                farmer: payload.farmer,
                pond: payload.pond,
                harvestDate: payload.harvestDate,
                harvestType: payload.harvestType,
                harvestQuantity: payload.harvestQuantity,
                harvestAWB: payload.harvestAWB,
                harvestSalePrice:payload.harvestSalePrice,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode
            }

            const updatedResult = await harvestManagement.updatedDetail(harvestDetail);
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
            const harvestIds = JSON.parse(req.body.harvestIds);
            if (harvestIds) {
                const deleted = await harvestManagement.deleteDetails(harvestIds);
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