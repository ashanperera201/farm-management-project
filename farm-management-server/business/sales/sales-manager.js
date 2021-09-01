const salesRepository = require('../../repository/sales-repository');

exports.saveDetails = async (sales) => {
    try {
        const savedResult = await salesRepository.saveDetails(sales);
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

exports.saveDetail = async (sale) => {
    try {
        const savedResult = await salesRepository.saveDetail(sale);
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

exports.updateDetail = async (sale) => {
    try {
        const updatedResult = await salesRepository.udpateDetails(sale);
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
        const weeklyApps = await salesRepository.getAllDetails();
        return {
            validity: true,
            result: weeklyApps
        }
    } catch (error) {
        throw error;
    }
}

exports.getDetail = async (saleId) => {
    try {
        const weeklyApp = await salesRepository.getDetail(saleId);
        return weeklyApp;
    } catch (error) {
        throw error;
    }
}

exports.deleteDetails = async (salesIds) => {
    try {
        const deletedResult = await salesRepository.deleteDetails(salesIds);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}