import api from "./api";

export const profileService = {
    getProfile: async () => {
        try {
            const response = await api.get("/profile");
            return response.data;
        } catch (error) {
            console.error("Error fetching profile:", error);
            throw error;
        }
    },
};
