const feedingPercentageRepository = require('../../repository/feeding-percentage-repository');

exports.saveDetails = async (feedingPercentages) => {
    try {
        const savedResult = await feedingPercentageRepository.saveDetails(feedingPercentages);
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

exports.saveDetail = async (feedingPercentage) => {
    try {
        const savedResult = await feedingPercentageRepository.saveDetail(feedingPercentage);
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

exports.updatedDetail = async (feedingPercentage) => {
    try {
        const updatedResult = await feedingPercentageRepository.updatefeedingPercentage(feedingPercentage);
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

exports.getDetails = async () => {
    try {
        const feedingPercentages = await feedingPercentageRepository.getfeedingPercentageDetails();
        return {
            validity: true,
            result: feedingPercentages
        }
    } catch (error) {
        throw error;
    }
}

exports.getDetail = async (feedingPercentageUniqueId) => {
    try {
        const feedingPercentageDetail = await feedingPercentageRepository.getfeedingPercentageDetail(feedingPercentageUniqueId);
        return feedingPercentageDetail;
    } catch (error) {
        throw error;
    }
}

exports.deleteDetails = async (feedingPercentageUniqueIds) => {
    try {
        const deletedResult = await feedingPercentageRepository.deleteDetails(feedingPercentageUniqueIds);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}