const farmRepository = require('../../repository/farm-management-repository');

exports.saveFarmDetails = async (farmDetail) => {
    try {
        const savedResult = await farmRepository.saveFarmDetails(farmDetail);
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

exports.updateFarmDetail = async (farmDetail) => {
    try {
        const updatedResult = await farmRepository.updateFarmDetail(farmDetail);
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

exports.getFarmDetails = async () => {
    try {
        const farmDetails = await farmRepository.getFarmDetails();
        return {
            validity: true,
            result: farmDetails
        }
    } catch (error) {
        throw error;
    }
}

exports.getFarmDetail = async (farmDetailId) => {
    try {
        const farmDetail = await farmRepository.getFarmDetail(farmDetailId);
        return farmDetail;
    } catch (error) {
        throw error;
    }
}

exports.deleteFarmDetail = async (farmers) => {
    try {
        const deletedResult = await farmRepository.deleteFarmDetail(farmers);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}