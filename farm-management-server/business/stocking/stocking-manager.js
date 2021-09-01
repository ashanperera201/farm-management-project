const stockRepository = require('../../repository/stocking-repository');

exports.saveStockDetails = async (stockDetails) => {
    try {
        const savedResult = await stockRepository.saveStockingDetails(stockDetails);
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

exports.saveStockDetail = async (stockDetail) => {
    try {
        const savedResult = await stockRepository.saveStockingDetail(stockDetail);
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

exports.updateStockDetail = async (stockDetail) => {
    try {
        const updatedResult = await stockRepository.updateStockDetail(stockDetail);
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

exports.getStockDetails = async () => {
    try {
        const stockDetails = await stockRepository.getStockDetails();
        return {
            validity: true,
            result: stockDetails
        }
    } catch (error) {
        throw error;
    }
}

exports.getStockDetail = async (stockDetailId) => {
    try {
        const stockDetail = await stockRepository.getStockDetail(stockDetailId);
        return stockDetail;
    } catch (error) {
        throw error;
    }
}

exports.deleteStockDetail = async (stockDetailIds) => {
    try {
        const deletedResult = await stockRepository.deleteDetails(stockDetailIds);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}