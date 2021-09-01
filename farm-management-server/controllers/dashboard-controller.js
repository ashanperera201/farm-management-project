const { body, header } = require('express-validator')
const { validationResult } = require('express-validator');

exports.validateHeaders = () => {
    return [
        header('x-user', 'Header\'s required.').notEmpty(),
        header('x-client', 'Header\'s required.').notEmpty(),
        header('x-country', 'Header\'s required.').notEmpty()
    ]
}

exports.fetchDashboardDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors && errors.isEmpty()) {

            // 1: club members
            // 2: farms
            // 3: ponds
            // 4: daily feeds
            // 5: applications
            // 6: stocks

            // const farmDetails = await farmManagementManager.getFarmDetails();
            // if (farmDetails) {
            //     res.status(200).json(farmDetails);
            // } else {
            //     res.status(202).json(null)
            // }
        } else {
            res.status(422).json({ errors: errors.array() })
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error, success: false })
    }
}