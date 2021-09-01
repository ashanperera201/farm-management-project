const headReader = require('./header-reader')

module.exports = function applicationHeaders(req, res, next) {

    const user = req.header('x-user');
    const clientId = req.header('x-client');
    const countryCode = req.header('x-country');
    headReader.setHeaderDetails({ user: user, clientId: clientId, countryCode: countryCode });
    next();
};

