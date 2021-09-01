const feedBrandRepository = require('../../repository/feed-brand-repository');

exports.saveFeedBrandDetails = async (feedBrandDetails) => {
    try {
        const savedResult = await feedBrandRepository.saveFeedBrand(feedBrandDetails);
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

exports.updateFeedBrandDetail = async (feedBrandDetails) => {
    try {
        const updatedResult = await feedBrandRepository.udpateFeedBrand(feedBrandDetails);
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

exports.getFeedBrandDetails = async () => {
    try {
        const feedBrandDetails = await feedBrandRepository.getFeedBrandDetails();
        return {
            validity: true,
            result: feedBrandDetails
        }
    } catch (error) {
        throw error;
    }
}

exports.getFeedBrandDetail = async (feedBrandDetailId) => {
    try {
        const feedBrandDetail = await feedBrandRepository.getFeedBrand(feedBrandDetailId);
        return feedBrandDetail;
    } catch (error) {
        throw error;
    }
}

exports.deleteDetails = async (ponds) => {
    try {
        const deletedResult = await feedBrandRepository.deleteFeedBrand(ponds);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}