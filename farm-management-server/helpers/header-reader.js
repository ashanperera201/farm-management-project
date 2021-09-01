let header = null;

exports.setHeaderDetails = (details) => {
    header = {}
    header.user = details && details.user ? details.user : 0;
    header.clientId = details.clientId  ? details.clientId : 0;
    header.countryCode = details.countryCode ? details.countryCode : 0
}

exports.getHeaderDetails = () => {
    return header
}