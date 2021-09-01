const weeklyPerformanceRepository = require('../../repository/weekly-performance-repository');

exports.saveDetails = async (weeklyPerformance) => {
    try {
        const savedResult = await weeklyPerformanceRepository.saveDetails(weeklyPerformance);
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

exports.saveDetail = async (weeklyPerformance) => {
    try {
        const savedResult = await weeklyPerformanceRepository.saveDetail(weeklyPerformance);
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

exports.updateDetail = async (weeklyPerformance) => {
    try {
        const updatedResult = await weeklyPerformanceRepository.udpateDetails(weeklyPerformance);
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
        const weeklyApps = await weeklyPerformanceRepository.getDetails();
        return {
            validity: true,
            result: weeklyApps
        }
    } catch (error) {
        throw error;
    }
}

exports.getDetail = async (weeklyPerformanceId) => {
    try {
        const weeklyApp = await weeklyPerformanceRepository.getDetail(weeklyPerformanceId);
        return weeklyApp;
    } catch (error) {
        throw error;
    }
}

exports.deleteDetails = async (weeklyPerfIds) => {
    try {
        const deletedResult = await weeklyPerformanceRepository.deleteDetails(weeklyPerfIds);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}