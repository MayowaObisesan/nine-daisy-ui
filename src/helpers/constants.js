export const NINE_CREATE_APP_FORM_DRAFT_NAME = "NineAppFormDraft";

export const maxCategoryCount = 4;

export const brandColorMap = {
    "linkedin": "text-blue-700",
    "stack-overflow": "text-orange-600",
    "github": "text-black",
    "medium": "text-black",
    "twitter": "text-blue-400",
    "youtube": "text-red-600",
    "facebook": "text-blue-500",
    "pinterest": "text-red-600",
};

export const releaseType = [
    "IN_PLANNING",
    "IN_DEVELOPMENT",
    "ALPHA",
    "BETA",
    "LIVE"
]

export const timelineAppText = (app) => {
    return {
        category: "App Listing",
        title: `${app.name} listed on ${new Date(app.created_at).toLocaleDateString()}`,
        description: `${app.name} was listed to Nine. Here's an official link. ${app.website}`,
    };
}

export const timelineUserVerifiedText = (user) => {
    return {
        category: "User Verification",
        title: `Your account was verified successfully at ${new Date(user.created_at).toLocaleDateString()}`,
        description: `Your account was verified successfully which gives you access to list your app on Nine.`,
    };
}

export const timelineUserSignupText = (user) => {
    return {
        category: "Account Signup",
        title: `Account created successfully at ${new Date(user.created_at).toLocaleDateString()}`,
        description: `🥳 This was the day you took the step to join the platform to showcase your software career journey`
    };
}

export const timeLineCategoryMapping = (_data) => {
    switch (_data.category) {
        case "LIST_APP":
            return timelineAppText(_data.app)
        case "ACCOUNT_VERIFIED":
            return timelineUserVerifiedText(_data)
        case "SIGNUP":
            return timelineUserSignupText(_data)
        default:
            return "Timeline not understood. Pls send a feedback"
    }
}
