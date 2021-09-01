const clubMemberRepository = require('../../repository/club-member-repository');
const emailProvider = require('../../external-services/email-service');

exports.saveClubMember = async (clubMember) => {
    try {
        const savedResult = await clubMemberRepository.saveClubMember(clubMember);
        if (savedResult) {
            if (savedResult.user) {
                const userDetails = savedResult.user;

                const userEmailDetails = {
                    email: userDetails.userEmail,
                    name: `${userDetails.firstName} ${userDetails.lastName}`,
                    userName: userDetails.userName,
                    otherUserName: userDetails.userEmail,
                    subject: 'Club Member Registration'
                }

                await emailProvider.sendEmail(userEmailDetails, clubMember.password);
            }
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

exports.udpateClubMember = async (clubMember) => {
    try {
        const updatedResult = await clubMemberRepository.updateClubMember(clubMember);
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

exports.getAllClubMembers = async () => {
    try {
        const clubMemberDetails = await clubMemberRepository.getClubMemberDetails();
        return {
            validity: true,
            result: clubMemberDetails
        }
    } catch (error) {
        throw error;
    }
}

exports.getClubMember = async (clubMemberId) => {
    try {
        const clubMemberResult = await clubMemberRepository.getClubMemberDetail(clubMemberId);
        return clubMemberResult;
    } catch (error) {
        throw error;
    }
}

exports.deleteClubMembers = async (clubMemberIds) => {
    try {
        const deletedResult = await clubMemberRepository.deleteClubMembers(clubMemberIds);
        return deletedResult;
    } catch (error) {
        throw error;
    }
}