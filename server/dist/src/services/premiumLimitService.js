import UserModel from "../models/User.js";
import TravelListModel from "../models/TravelList.js";
import JournalEntryModel from "../models/JournalEntry.js";
import DestinationModel from "../models/Destination.js";
// Premium limitations
export const LIMITS = {
    FREE: {
        TRAVEL_LISTS: 3,
        DESTINATIONS_PER_LIST: 10,
        JOURNAL_ENTRIES: 20,
        IMAGES_PER_JOURNAL: 1,
        COLLABORATORS_PER_LIST: 2,
        STORAGE_MB: 100,
    },
    PREMIUM: {
        TRAVEL_LISTS: -1, // Unlimited
        DESTINATIONS_PER_LIST: -1, // Unlimited
        JOURNAL_ENTRIES: -1, // Unlimited
        IMAGES_PER_JOURNAL: 5,
        COLLABORATORS_PER_LIST: -1, // Unlimited
        STORAGE_MB: 5000, // 5GB
    },
};
export const checkPremiumStatus = (user) => {
    if (!user.premium)
        return false;
    // Check if premium has expired
    if (user.premiumExpiresAt && new Date() > user.premiumExpiresAt) {
        return false;
    }
    return true;
};
export const canCreateTravelList = async (userId) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user)
            throw new Error("User not found");
        const isPremium = checkPremiumStatus(user);
        const limit = isPremium
            ? LIMITS.PREMIUM.TRAVEL_LISTS
            : LIMITS.FREE.TRAVEL_LISTS;
        if (limit === -1) {
            return { canCreate: true, currentCount: 0, limit: -1 };
        }
        const currentCount = await TravelListModel.countDocuments({
            owner: userId,
        });
        return {
            canCreate: currentCount < limit,
            currentCount,
            limit,
        };
    }
    catch (error) {
        throw error;
    }
};
export const canAddDestination = async (listId, userId) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user)
            throw new Error("User not found");
        const isPremium = checkPremiumStatus(user);
        const limit = isPremium
            ? LIMITS.PREMIUM.DESTINATIONS_PER_LIST
            : LIMITS.FREE.DESTINATIONS_PER_LIST;
        if (limit === -1) {
            return { canAdd: true, currentCount: 0, limit: -1 };
        }
        const currentCount = await DestinationModel.countDocuments({
            list: listId,
        });
        return {
            canAdd: currentCount < limit,
            currentCount,
            limit,
        };
    }
    catch (error) {
        throw error;
    }
};
export const canCreateJournalEntry = async (userId) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user)
            throw new Error("User not found");
        const isPremium = checkPremiumStatus(user);
        const limit = isPremium
            ? LIMITS.PREMIUM.JOURNAL_ENTRIES
            : LIMITS.FREE.JOURNAL_ENTRIES;
        if (limit === -1) {
            return { canCreate: true, currentCount: 0, limit: -1 };
        }
        const currentCount = await JournalEntryModel.countDocuments({
            author: userId,
        });
        return {
            canCreate: currentCount < limit,
            currentCount,
            limit,
        };
    }
    catch (error) {
        throw error;
    }
};
export const canAddImageToJournal = async (userId, currentImageCount) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user)
            throw new Error("User not found");
        const isPremium = checkPremiumStatus(user);
        const limit = isPremium
            ? LIMITS.PREMIUM.IMAGES_PER_JOURNAL
            : LIMITS.FREE.IMAGES_PER_JOURNAL;
        return {
            canAdd: currentImageCount < limit,
            currentCount: currentImageCount,
            limit,
        };
    }
    catch (error) {
        throw error;
    }
};
export const getUserLimits = async (userId) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user)
            throw new Error("User not found");
        const isPremium = checkPremiumStatus(user);
        const limits = isPremium ? LIMITS.PREMIUM : LIMITS.FREE;
        // Get current usage
        const [travelListsCount, journalEntriesCount] = await Promise.all([
            TravelListModel.countDocuments({ owner: userId }),
            JournalEntryModel.countDocuments({ author: userId }),
        ]);
        return {
            isPremium,
            limits,
            usage: {
                travelLists: travelListsCount,
                journalEntries: journalEntriesCount,
            },
            premiumExpiresAt: user.premiumExpiresAt,
        };
    }
    catch (error) {
        throw error;
    }
};
export const expirePremiumSubscriptions = async () => {
    try {
        const expiredUsers = await UserModel.updateMany({
            premium: true,
            premiumExpiresAt: { $lte: new Date() },
        }, {
            $set: { premium: false },
            $unset: { premiumExpiresAt: 1 },
        });
        console.log(`Expired ${expiredUsers.modifiedCount} premium subscriptions`);
        return expiredUsers.modifiedCount;
    }
    catch (error) {
        console.error("Error expiring premium subscriptions:", error);
        throw error;
    }
};
