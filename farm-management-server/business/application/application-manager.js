const applicationsRepository = require('../../repository/applications-repository');

exports.saveApplications = async (applicationsDetail) => {
    try {
        const savedResult = await applicationsRepository.saveApplicationsDetails(applicationsDetail);
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

exports.udpateApplications = async (applicationDetails) => {
    try {
        const updatedResult = await applicationsRepository.updateApplciations(applicationDetails);
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

exports.getApplications = async () => {
    try {
        const applications = await applicationsRepository.getApplicationDetails();
        return {
            validity: true,
            result: applications
        }
    } catch (error) {
        throw error;
    }
}

exports.getApplication = async (applicationId) => {
    try {
        const applicationDetail = await applicationsRepository.getApplication(applicationId);
        return applicationDetail;
    } catch (error) {
        throw error;
    }
}

exports.deleteApplicationDetail = async (farmers) => {
    try {
        const deletedResult = await applicationsRepository.deleteApplications(farmers);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}