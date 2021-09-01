const dailyFeedRepository = require('../../repository/daily-feed-repository');

exports.saveDetails = async (dailyFeedings) => {
    try {
        const savedResult = await dailyFeedRepository.saveDetails(dailyFeedings);
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

exports.saveDetail = async (dailyFeed) => {
    try {
        const savedResult = await dailyFeedRepository.saveDetail(dailyFeed);
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

exports.updateDetail = async (dailyFeed) => {
    try {
        const updatedResult = await dailyFeedRepository.udpateDetails(dailyFeed);
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
        const dailyFeedings = await dailyFeedRepository.getAllDetails();
        return {
            validity: true,
            result: dailyFeedings
        }
    } catch (error) {
        throw error;
    }
}

exports.getDetail = async (dailyFeedId) => {
    try {
        const dailyFeedDetail = await dailyFeedRepository.getDetail(dailyFeedId);
        return dailyFeedDetail;
    } catch (error) {
        throw error;
    }
}

exports.deleteDetails = async (dailyFeedingIds) => {
    try {
        const deletedResult = await dailyFeedRepository.deleteDetails(dailyFeedingIds);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}