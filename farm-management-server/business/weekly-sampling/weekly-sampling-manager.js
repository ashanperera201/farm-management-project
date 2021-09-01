const weeklySamplingRepository = require('../../repository/weekly-sampling-repository');

exports.saveDetails = async (weeklySamplings) => {
    try {
        const savedResult = await weeklySamplingRepository.saveDetails(weeklySamplings);
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

exports.saveDetail = async (weeklySample) => {
    try {
        const savedResult = await weeklySamplingRepository.saveDetail(weeklySample);
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

exports.updatedDetail = async (weeklySample) => {
    try {
        const updatedResult = await weeklySamplingRepository.updateWeeklySampling(weeklySample);
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
        const weeklySamplings = await weeklySamplingRepository.getWeeklySamplingDetails();
        return {
            validity: true,
            result: weeklySamplings
        }
    } catch (error) {
        throw error;
    }
}

exports.getWeeklySampling = async (samplingId) => {
    try {
        const samplingDetail = await weeklySamplingRepository.getWeeklySamplingDetail(samplingId);
        return samplingDetail;
    } catch (error) {
        throw error;
    }
}

exports.deleteDetails = async (weeklySampleDetailIds) => {
    try {
        const deletedResult = await weeklySamplingRepository.deleteDetails(weeklySampleDetailIds);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}