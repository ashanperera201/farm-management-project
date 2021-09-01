const weeklyApplicationRepository = require('../../repository/weekly-application-repository');

exports.saveDetails = async (weeklyApps) => {
    try {
        const savedResult = await weeklyApplicationRepository.saveDetails(weeklyApps);
        if (savedResult) {
            return {
                validity: true,
                result: savedResult
            }
        } else {
            return {
                validity: false,
                result: null
            }
        }
    } catch (error) {
        throw error;
    }
}

exports.saveDetail = async (weeklyApp) => {
    try {
        const savedResult = await weeklyApplicationRepository.saveDetail(weeklyApp);
        if (savedResult) {
            return {
                validity: true,
                result: savedResult
            }
        } else {
            return {
                validity: false,
                result: null
            }
        }
    } catch (error) {
        throw error;
    }
}

exports.updateDetail = async (weeklyApp) => {
    try {
        const updatedResult = await weeklyApplicationRepository.udpateDetails(weeklyApp);
        if (updatedResult) {
            return {
                validity: true,
                result: updatedResult
            }
        } else {
            return {
                validity: false,
                result: null
            }
        }
    } catch (error) {
        throw error;
    }
}

exports.getAllDetails = async () => {
    try {
        const weeklyApps = await weeklyApplicationRepository.getAllDetails();
        return {
            validity: true,
            result: weeklyApps
        }
    } catch (error) {
        throw error;
    }
}

exports.getDetail = async (weeklyAppId) => {
    try {
        const weeklyApp = await weeklyApplicationRepository.getDetail(weeklyAppId);
        return weeklyApp;
    } catch (error) {
        throw error;
    }
}

exports.deleteDetails = async (weeklyAppIds) => {
    try {
        const deletedResult = await weeklyApplicationRepository.deleteDetails(weeklyAppIds);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}