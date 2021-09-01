const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');
const reportingManager = require('../business/reporting/reporting-manager');


exports.validateHeaders = () => {
    return [
        header('x-user', 'Header\'s required.').notEmpty(),
        header('x-client', 'Header\'s required.').notEmpty(),
        header('x-country', 'Header\'s required.').notEmpty()
    ]
}


exports.getClubMemberReport = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const filterParam = req.body;
            const clubMemberReport = await reportingManager.getClubMemberReport(filterParam);
            if (clubMemberReport) {
                res.status(200).json(clubMemberReport);
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

exports.getFarmDetailReport = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const filterParam = req.body;
            const farmDetailedReport = await reportingManager.getFarmDetailedReport(filterParam);
            if (farmDetailedReport) {
                res.status(200).json(farmDetailedReport);
            } else {
                res.status(202).json(null)
            }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}

exports.getPondDetailReport = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const filterParam = req.body;
            const pondDetails = await reportingManager.getPondDetailReport(filterParam);
            if (pondDetails) {
                res.status(200).json(pondDetails);
            } else {
                res.status(202).json(null);
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}

exports.getFeedBrandDetailReport = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const filterParam = req.body;
            const feedBrandDetails = await reportingManager.getFeedBrandDetails(filterParam);
            if (feedBrandDetails) {
                res.status(200).json(feedBrandDetails);
            } else {
                res.status(202).json(null);
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}

exports.getApplicationReport = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const filterParam = req.body;
            const reportDetails = await reportingManager.getApplicationDetails(filterParam);
            if (reportDetails) {
                res.status(200).json(reportDetails);
            } else {
                res.status(202).json(null);
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}

exports.getFeedingPercentageReport = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const filterParam = req.body;
            const reportDetails = await reportingManager.getFeedingPercentageDetails(filterParam);
            if (reportDetails) {
                res.status(200).json(reportDetails);
            } else {
                res.status(202).json(null);
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}

exports.getSalesReport = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const filterParam = req.body;
            const reportDetails = await reportingManager.getSalesReportDetails(filterParam);
            if (reportDetails) {
                res.status(200).json(reportDetails);
            } else {
                res.status(202).json(null);
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}

exports.getWeeklySampleReport = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const filterParam = req.body;
            const reportDetails = await reportingManager.getWeeklySamplingReportDetails(filterParam);
            if (reportDetails) {
                res.status(200).json(reportDetails);
            } else {
                res.status(202).json(null);
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}


exports.getWeeklyApplicationReport = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const filterParam = req.body;
            const reportDetails = await reportingManager.getWeeklyApplicationReportData(filterParam);
            if (reportDetails) {
                res.status(200).json(reportDetails);
            } else {
                res.status(202).json(null);
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}

exports.getHavestReportingDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {
            const filterParam = req.body;
            const reportDetails = await reportingManager.getHavestReportingDetails(filterParam);
            if (reportDetails) {
                res.status(200).json(reportDetails);
            } else {
                res.status(202).json(null);
            }
        } else {
            res.status(422).json({ errors: errors.array() });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false });
    }
}