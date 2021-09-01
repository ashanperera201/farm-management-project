const clubMemberRepository = require('../../repository/club-member-repository');
const farmRepository = require('../../repository/farm-management-repository');
const pondRepository = require('../../repository/pond-management-repository');
const feedBrandRepository = require('../../repository/feed-brand-repository');
const applicationRepository = require('../../repository/applications-repository');
const percentageOfFeedingRepository = require('../../repository/feeding-percentage-repository');
const salesPriceRepository = require('../../repository/sales-repository');
const weeklySampling = require('../../repository/weekly-sampling-repository');
const weeklyApplication = require('../../repository/weekly-application-repository');
const havestManagementRepository = require('../../repository/harvest-management-repository');

exports.getClubMemberReport = async (filterParams) => {
    try {
        const clubMembers = await clubMemberRepository.filterClubMemberDetails(filterParams);
        return {
            validity: true,
            result: clubMembers
        }
    } catch (error) {
        return {
            validity: false,
            error: error
        }
    }
}


exports.getFarmDetailedReport = async (filterParams) => {
    try {
        const farmDetails = await farmRepository.filterFarmDetails(filterParams);
        return {
            validity: true,
            result: farmDetails
        }
    } catch (error) {
        return {
            validity: false,
            error: error
        }
    }
}


exports.getPondDetailReport = async (filterParam) => {
    try {
        const pondDetails = await pondRepository.filterPondDetails(filterParam);
        return {
            validity: true,
            result: pondDetails
        }
    } catch (error) {
        return {
            validity: false,
            error: error
        }
    }
}

exports.getFeedBrandDetails = async (filterParam) => {
    try {
        const feedBrandDetails = await feedBrandRepository.filterFeedBrand(filterParam);
        return {
            validity: true,
            result: feedBrandDetails
        }
    } catch (error) {
        return {
            validity: false,
            error: error
        }
    }
}

exports.getApplicationDetails = async (filterParam) => {
    try {
        const applicationReportDetails = await applicationRepository.filterDetails(filterParam);
        return {
            validity: true,
            result: applicationReportDetails
        }
    } catch (error) {
        return {
            validity: false,
            error: error
        }
    }
}

exports.getFeedingPercentageDetails = async (filterParam) => {
    try {
        const reportDetails = await percentageOfFeedingRepository.filterDetails(filterParam);
        return {
            validity: true,
            result: reportDetails
        }
    } catch (error) {
        return {
            validity: false,
            error: error
        }
    }
}

exports.getSalesReportDetails = async (filterParam) => {
    try {
        const reportDetails = await salesPriceRepository.filterDetails(filterParam);
        return {
            validity: true,
            result: reportDetails
        }
    } catch (error) {
        return {
            validity: false,
            error: error
        }
    }
}

exports.getWeeklySamplingReportDetails = async (filterParam) => {
    try {
        const reportDetails = await weeklySampling.filterDetails(filterParam);
        return {
            validity: true,
            result: reportDetails
        }
    } catch (error) {
        return {
            validity: false,
            error: error
        }
    }
}

exports.getWeeklyApplicationReportData = async (filterParam) => {
    try {
        const reportDetails = await weeklyApplication.filterDetails(filterParam);
        return {
            validity: true,
            result: reportDetails
        }
    } catch (error) {
        return {
            validity: false,
            error: error
        }
    }
}

exports.getHavestReportingDetails = async (filterParam) => {
    try {
        const reportDetails = await havestManagementRepository.filterDetails(filterParam);
        return {
            validity: true,
            result: reportDetails
        }
    } catch (error) {
        return {
            validity: false,
            error: error
        }
    }
}