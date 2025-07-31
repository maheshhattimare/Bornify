// jobs/cronJob.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Birthday from "../models/Birthday.js";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

// Helper to get today's date at midnight in UTC for consistent server-side date handling
const getTodayAtMidnightUTC = () => {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
};

// Main job logic - SECURE & ENHANCED VERSION
export const runBirthdayReminders = async () => {
  console.log("⏰ Starting SECURE birthday reminder job...");

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ Email configuration is missing.");
    return { success: false, message: "Email configuration missing." };
  }

  let status = { success: true, message: "Job finished.", sent: 0, failed: 0 };

  try {
    await connectDB();
    console.log("🗄️ Database connected for cron job.");

    const todayUTC = getTodayAtMidnightUTC();

    // 1. Find all users in the database to process them one by one
    const allUsers = await User.find({}).lean();
    console.log(`👥 Found ${allUsers.length} total users to check.`);

    // 2. Loop through each user individually to ensure data privacy
    for (const user of allUsers) {
      // Find ONLY the birthdays that belong to the current user
      const userBirthdays = await Birthday.find({ userId: user._id }).lean();

      if (userBirthdays.length === 0) {
        continue; // Skip to the next user if they have no birthdays
      }

      const remindersForThisUser = [];

      // 3. Check each of THIS USER'S birthdays to see if a reminder is due today
      for (const birthday of userBirthdays) {
        const birthDate = new Date(birthday.birthdate);
        const thisYearBirthday = new Date(
          Date.UTC(
            todayUTC.getUTCFullYear(),
            birthDate.getUTCMonth(),
            birthDate.getUTCDate()
          )
        );

        const daysBefore = birthday.notifyBeforeDays ?? 1;
        const reminderDate = new Date(thisYearBirthday);
        reminderDate.setUTCDate(reminderDate.getUTCDate() - daysBefore);

        // Compare if today is the exact reminder day
        if (reminderDate.getTime() === todayUTC.getTime()) {
          remindersForThisUser.push({
            name: birthday.name,
            daysBefore: daysBefore,
          });
        }
      }

      // 4. If there are reminders for this user, build and send ONE email
      if (remindersForThisUser.length > 0) {
        console.log(
          `✅ Found ${remindersForThisUser.length} reminder(s) for user ${user.email}.`
        );

        // --- Enhanced Email HTML ---
        const reminderListHtml = remindersForThisUser
          .map(
            (r) =>
              `<div style="background-color: #ffffff; border-left: 4px solid #e91e63; padding: 15px; margin-bottom: 10px; border-radius: 4px;">
                        <p style="margin: 0; font-size: 16px; color: #333;">
                            <strong>${
                              r.name
                            }</strong>'s birthday is in <strong>${
                r.daysBefore
              } day${r.daysBefore > 1 ? "s" : ""}</strong>!
                        </p>
                    </div>`
          )
          .join("");

        const emailHtml = `
                    <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; background-color: #f4f4f7; padding: 20px; text-align: center;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                            <div style="background-color: #e91e63; color: #ffffff; padding: 20px;">
                                <h1 style="margin: 0; font-size: 24px;">Bornify</h1>
                            </div>
                            <div style="padding: 30px; text-align: left;">
                                <h2 style="font-size: 20px; color: #333;">Hey ${
                                  user.name || "there"
                                },</h2>
                                <p style="font-size: 16px; color: #555; line-height: 1.5;">
                                    Here are your friendly birthday reminders for today:
                                </p>
                                <div style="margin-top: 20px;">
                                    ${reminderListHtml}
                                </div>
                                <p style="font-size: 16px; color: #555; line-height: 1.5; margin-top: 30px;">
                                    Have a great day!
                                </p>
                            </div>
                            <div style="background-color: #f4f4f7; padding: 20px; font-size: 12px; color: #888;">
                                <p style="margin: 0;">You received this email because you use Bornify.</p>
                                <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} Bornify. All rights reserved.</p>
                            </div>
                        </div>
                    </div>`;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const emailOptions = {
          from: `"Bornify" <${process.env.EMAIL_USER}>`,
          to: user.email, // Send email ONLY to the current user
          subject: `🎉 You have ${remindersForThisUser.length} birthday reminder(s) today!`,
          html: emailHtml,
        };

        try {
          await transporter.sendMail(emailOptions);
          console.log(`👍 Email sent successfully to ${user.email}.`);
          status.sent++;
        } catch (emailError) {
          console.error(
            `❌ Failed to send email to ${user.email}:`,
            emailError.message
          );
          status.failed++;
        }
      }
    }
  } catch (error) {
    console.error("❌ A critical error occurred in the reminder job:", error);
    status = { success: false, message: error.message };
  } finally {
    // We do NOT disconnect here, to prevent crashing the web server.
    console.log("✅ Cron job logic finished.");
  }

  console.log(`📊 Job summary: ${status.sent} sent, ${status.failed} failed.`);
  return status;
};
