const pondRepository = require('../../repository/pond-management-repository');

exports.savePondDetails = async (pondDetails) => {
    try {
        const savedResult = await pondRepository.savePondDetails(pondDetails);
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

exports.updatePondDetail = async (pondDetail) => {
    try {
        const updatedResult = await pondRepository.updatePondDetail(pondDetail);
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

exports.getPondDetails = async () => {
    try {
        const pondDetails = await pondRepository.getPondDetails();
        return {
            validity: true,
            result: pondDetails
        }
    } catch (error) {
        throw error;
    }
}

exports.getPondDetail = async (pondDetailId) => {
    try {
        const pondDetail = await pondRepository.getPondDetail(pondDetailId);
        return pondDetail;
    } catch (error) {
        throw error;
    }
}

exports.deletePondDetail = async (pondIds) => {
    try {
        const deletedResult = await pondRepository.deletePondDetail(pondIds);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}