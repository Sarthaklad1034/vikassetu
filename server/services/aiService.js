// aiService.js
const OpenAI = require('openai');
const environment = require('../config/environment');

const openai = new OpenAI({
    apiKey: environment.services.openai.apiKey
});

class AIService {
    async analyzeGrievancePriority(grievanceText) {
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{
                    role: "system",
                    content: "Analyze the grievance text and rate its priority from 1-5 based on urgency and impact."
                }, {
                    role: "user",
                    content: grievanceText
                }]
            });

            return parseInt(completion.choices[0].message.content);
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error('Failed to analyze grievance priority');
        }
    }

    async suggestInfrastructureImprovements(areaData) {
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{
                    role: "system",
                    content: "Based on the area data, suggest infrastructure improvements."
                }, {
                    role: "user",
                    content: JSON.stringify(areaData)
                }]
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error('Failed to generate infrastructure suggestions');
        }
    }
}

module.exports = new AIService();