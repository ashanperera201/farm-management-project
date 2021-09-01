const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const feedBrandManager = require('../business/feed-brand/feed-brand-manager');

exports.validateHeaders = () => {
    return [
        header('x-user', 'Header\'s required.').notEmpty(),
        header('x-client', 'Header\'s required.').notEmpty(),
        header('x-country', 'Header\'s required.').notEmpty()
    ]
}

exports.validate = (method) => {
    switch (method) {
        case 'saveFeedBrandDetail': {
            return [
                body('brandName', 'Brand name is required.').notEmpty(),
                body('grades', 'Grades is required.').notEmpty(),
                body('shrimpWeight', 'Shrimp is required.').notEmpty(),
                body('price', 'Pond count is required.').notEmpty(),
            ]
        }
        case 'updateFeedBrandDetail':
            return [
                body('brandName', 'Brand name is required.').notEmpty(),
                body('grades', 'Grades is required.').notEmpty(),
                body('shrimpWeight', 'Shrimp is required.').notEmpty(),
                body('price', 'Pond count is required.').notEmpty(),
            ]
    }
}

exports.getAllFeedBrandDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const feedBrandDetails = await feedBrandManager.getFeedBrandDetails();
            if (feedBrandDetails) {
                res.status(200).json(feedBrandDetails);
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

exports.getFeedBrandDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const feedBrandId = req.params.feedBrandId;
            const feedBrandDetail = await feedBrandManager.getFeedBrandDetail(feedBrandId);
            if (feedBrandDetail) {
                res.status(201).json(feedBrandDetail);
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

exports.saveFeedBrandDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const payload = req.body;

            const feedBrand = {
                brandName: payload.brandName,
                grades: payload.grades,
                shrimpWeight: payload.shrimpWeight,
                price: payload.price
            }

            const savedResult = await feedBrandManager.saveFeedBrandDetails(feedBrand);
            if (savedResult) {
                res.status(201).json(savedResult)
            } else {
                res.status(500).json({ error: 'Failed to save feed brand details', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}

exports.updateFeedBrandDetail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            const payload = req.body;
            const feedBrand = {
                _id: payload._id,
                feedBrandUniqueId: payload.feedBrandUniqueId,
                brandName: payload.brandName,
                grades: payload.grades,
                shrimpWeight: payload.shrimpWeight,
                price: payload.price,
                createdBy: payload.createdBy,
                createdOn: payload.createdOn,
                modifiedBy: payload.modifiedBy,
                modifiedOn: payload.modifiedOn,
                isActive: payload.isActive,
                clientTenentId: payload.clientTenentId,
                countryCode: payload.countryCode
            }

            const updatedResult = await feedBrandManager.updateFeedBrandDetail(feedBrand);
            if (updatedResult) {
                res.status(201).json(updatedResult)
            } else {
                res.status(500).json({ error: 'Failed to udpate feed brand details', success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}


exports.deleteFeedBrand = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const feedBrandIds = JSON.parse(req.body.feedBrandIds);
            if (feedBrandIds) {
                const deleted = await feedBrandManager.deleteDetails(feedBrandIds);
                if (deleted) {
                    res.status(200).json(deleted)
                } else {
                    res.status(204).json()
                }
            } else {
                res.status(400).json({ error: "Failed to delete farm details.", success: false })
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}