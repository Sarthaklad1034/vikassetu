// src/services/mlService.js
import api from "./api";

const mlService = {
    predictInfrastructure: async(data) => {
        const response = await api.post("/ml/infrastructure-predict", data);
        return response.data;
    },

    prioritizeGrievance: async(grievanceData) => {
        const response = await api.post("/ml/grievance-priority", grievanceData);
        return response.data;
    },

    communityInsights: async() => {
        const response = await api.get("/ml/community-insights");
        return response.data;
    },
};

export default mlService;