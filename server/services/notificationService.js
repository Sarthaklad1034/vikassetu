// notificationService.js
const WebSocket = require('ws');
const environment = require('../config/environment');

class NotificationService {
    constructor() {
        this.wss = new WebSocket.Server({ port: environment.wsPort });
        this.clients = new Map();

        this.wss.on('connection', (ws, req) => {
            const userId = this.extractUserIdFromRequest(req);
            this.clients.set(userId, ws);

            ws.on('close', () => {
                this.clients.delete(userId);
            });
        });
    }

    extractUserIdFromRequest(req) {
        // Extract user ID from request headers or query parameters
        return req.headers['x-user-id'] || req.url.split('=')[1];
    }

    async notifyUser(userId, notification) {
        const client = this.clients.get(userId);
        if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(notification));
        }
    }

    async broadcastToVillage(villageId, notification) {
        this.clients.forEach((client, userId) => {
            if (client.readyState === WebSocket.OPEN && client.villageId === villageId) {
                client.send(JSON.stringify(notification));
            }
        });
    }
}

module.exports = new NotificationService();