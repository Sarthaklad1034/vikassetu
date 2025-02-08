// emailService.js
const { Resend } = require('resend');
const environment = require('../config/environment');

const resend = new Resend(environment.email.resendApiKey);

class EmailService {
    async sendVerificationEmail(to, token) {
        try {
            await resend.emails.send({
                from: environment.email.fromEmail,
                to,
                subject: 'Verify Your VikaSetu Account',
                html: this.getVerificationEmailTemplate(token)
            });
        } catch (error) {
            console.error('Email Service Error:', error);
            throw new Error('Failed to send verification email');
        }
    }

    async sendGrievanceUpdate(to, grievanceDetails) {
        try {
            await resend.emails.send({
                from: environment.email.fromEmail,
                to,
                subject: `Update on your Grievance #${grievanceDetails.id}`,
                html: this.getGrievanceUpdateTemplate(grievanceDetails)
            });
        } catch (error) {
            console.error('Email Service Error:', error);
            throw new Error('Failed to send grievance update');
        }
    }

    async sendProjectNotification(to, projectDetails) {
        try {
            await resend.emails.send({
                from: environment.email.fromEmail,
                to,
                subject: `New Project Update: ${projectDetails.title}`,
                html: this.getProjectUpdateTemplate(projectDetails)
            });
        } catch (error) {
            console.error('Email Service Error:', error);
            throw new Error('Failed to send project notification');
        }
    }

    getVerificationEmailTemplate(token) {
        return `
            <h1>Welcome to VikaSetu!</h1>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${environment.isProduction ? 'https://' : 'http://'}${environment.cors.origin}/verify-email?token=${token}">
                Verify Email
            </a>
        `;
    }

    getGrievanceUpdateTemplate(details) {
        return `
            <h1>Grievance Update</h1>
            <p>Your grievance #${details.id} has been updated:</p>
            <p>Status: ${details.status}</p>
            <p>Update: ${details.update}</p>
        `;
    }

    getProjectUpdateTemplate(details) {
        return `
            <h1>${details.title}</h1>
            <p>${details.description}</p>
            <p>Status: ${details.status}</p>
            <p>Last Updated: ${details.updatedAt}</p>
        `;
    }
}

module.exports = new EmailService();