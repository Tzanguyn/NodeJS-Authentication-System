import nodemailer from 'nodemailer';  // Importing nodemailer for email sending functionality
import dotenv from 'dotenv';          // Importing dotenv to load environment variables

dotenv.config();  // Loading environment variables from .env file

// Use real Gmail SMTP if credentials provided; otherwise fall back to a dev-safe transport
const hasEmailCreds = Boolean(process.env.EMAIL && process.env.PASSWORD);

export const transporter = hasEmailCreds
    ? nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        })
    : nodemailer.createTransport({
            // Dev fallback: don't send over SMTP; serialize message to JSON so sendMail resolves
            jsonTransport: true,
        });

export const mailTransportMode = hasEmailCreds ? 'smtp' : 'dev-json';
