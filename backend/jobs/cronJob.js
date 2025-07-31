// jobs/cronJob.js

import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Birthday from "../models/Birthday.js";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

// Helper function to get date in local timezone
const getLocalDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// Main job logic, now exported as a function
export const runBirthdayReminders = async () => {
    console.log("⏰ Cron job triggered by API endpoint...");

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("❌ Email configuration is missing on the server.");
        return { success: false, message: "Email configuration missing." };
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let status = { success: true, message: "Job finished.", sent: 0, failed: 0 };

    try {
        await connectDB();
        console.log("🗄️ Database connected for cron job.");

        const today = getLocalDate();
        const birthdays = await Birthday.find().populate("userId", "email name").lean();
        console.log(`📅 Found ${birthdays.length} total birthdays to check.`);

        for (const birthday of birthdays) {
            if (!birthday.userId?.email) {
                console.log(`⚠️ Skipping ${birthday.name} - no user email found`);
                continue;
            }

            const birthDate = new Date(birthday.birthdate);
            const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

            if (thisYearBirthday < today) {
                thisYearBirthday.setFullYear(today.getFullYear() + 1);
            }

            const daysBefore = birthday.notifyBeforeDays ?? 1;
            const reminderDate = new Date(thisYearBirthday);
            reminderDate.setDate(reminderDate.getDate() - daysBefore);
            reminderDate.setHours(0, 0, 0, 0);

            const todayMidnight = new Date(today);
            todayMidnight.setHours(0, 0, 0, 0);

            if (reminderDate.getTime() === todayMidnight.getTime()) {
                console.log(`🎂 Preparing reminder for ${birthday.name}...`);
                const emailOptions = {
                    from: `"Bornify" <${process.env.EMAIL_USER}>`,
                    to: birthday.userId.email,
                    subject: `🎉 Reminder: ${birthday.name}'s Birthday in ${daysBefore} day${daysBefore > 1 ? 's' : ''}!`,
                    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                           <h2 style="color: #e91e63;">🎉 Birthday Reminder!</h2>
                           <p>Hey ${birthday.userId.name || "there"},</p>
                           <p>Don't forget — <strong>${birthday.name}</strong>'s birthday is coming up in <strong>${daysBefore} day${daysBefore > 1 ? "s" : ""}</strong>! 🎂</p>
                           <p style="margin-top: 30px; color: #666;">- Bornify Team</p>
                         </div>`,
                };

                try {
                    await transporter.sendMail(emailOptions);
                    console.log(`✅ Reminder sent to ${birthday.userId.email} for ${birthday.name}`);
                    status.sent++;
                } catch (emailError) {
                    console.error(`❌ Failed to send email for ${birthday.name}:`, emailError.message);
                    status.failed++;
                }
            }
        }
    } catch (error) {
        console.error("❌ A critical error occurred in the reminder job:", error);
        status = { success: false, message: error.message };
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Database disconnected.");
    }

    console.log(`📊 Job summary: ${status.sent} sent, ${status.failed} failed.`);
    return status;
};