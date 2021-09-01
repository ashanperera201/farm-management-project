const harvestManagementRepository = require('../../repository/harvest-management-repository');

exports.saveDetails = async (harvestDetails) => {
    try {
        const savedResult = await harvestManagementRepository.saveDetails(harvestDetails);
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

exports.saveDetail = async (harvestDetails) => {
    try {
        const savedResult = await harvestManagementRepository.saveDetail(harvestDetails);
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

exports.updatedDetail = async (harvestDetails) => {
    try {
        const updatedResult = await harvestManagementRepository.updateDetail(harvestDetails);
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
        const harvestDetails = await harvestManagementRepository.getDetails();
        return {
            validity: true,
            result: harvestDetails
        }
    } catch (error) {
        throw error;
    }
}

exports.getDetail = async (samplingId) => {
    try {
        const harvestDetail = await harvestManagementRepository.getDetail(samplingId);
        return harvestDetail;
    } catch (error) {
        throw error;
    }
}

exports.deleteDetails = async (weeklySampleDetailIds) => {
    try {
        const deletedResult = await harvestManagementRepository.deleteDetails(weeklySampleDetailIds);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}