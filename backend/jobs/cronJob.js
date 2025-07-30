// utils/birthdayReminder.js
import cron from "node-cron";
import nodemailer from "nodemailer";
import Birthday from "../models/Birthday.js";
import User from "../models/User.js";
// For user email

// Email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // app password, not your main Gmail password
    }
});

// Helper function to check if email is configured
const isEmailConfigured = () => {
    return process.env.EMAIL_USER && process.env.EMAIL_PASS;
};

// Helper function to get date in local timezone
const getLocalDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// Run at 8:00 AM every day
cron.schedule("0 8 * * *", async () => {
    console.log("⏰ Birthday reminder job running...");

    // Check if email is configured
    if (! isEmailConfigured()) {
        console.error("❌ Email configuration missing. Please set EMAIL_USER and EMAIL_PASS environment variables.");
        return;
    }

    const today = getLocalDate();

    try { // Get all birthdays with user info
        const birthdays = await Birthday.find().populate("userId", "email name") // get user email + name.lean();

        console.log(`📅 Found ${
            birthdays.length
        } birthdays to check`);

        let emailsSent = 0;
        let emailsFailed = 0;

        for (const birthday of birthdays) {
            if (! birthday.userId ?. email) {
                console.log(`⚠️ Skipping ${
                    birthday.name
                } - no user email found`);
                continue;
            }

            const birthDate = new Date(birthday.birthdate);
            const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

            // If birthday already passed this year, set to next year
            if (thisYearBirthday < today) {
                thisYearBirthday.setFullYear(today.getFullYear() + 1);
            }

            // Calculate reminder date based on notifyBeforeDays
            const daysBefore = birthday.notifyBeforeDays ?? 1; // default 1 day
            const reminderDate = new Date(thisYearBirthday);
            reminderDate.setDate(reminderDate.getDate() - daysBefore);

            // Compare dates (reset time to midnight for accurate comparison)
            reminderDate.setHours(0, 0, 0, 0);
            const todayMidnight = new Date(today);
            todayMidnight.setHours(0, 0, 0, 0);

            if (reminderDate.getTime() === todayMidnight.getTime()) {
                console.log(`🎂 Sending reminder for ${
                    birthday.name
                } (${daysBefore} day${
                    daysBefore > 1 ? 's' : ''
                } before)`);

                const emailOptions = {
                    from: process.env.EMAIL_USER,
                    to: birthday.userId.email,
                    subject: `🎉 Reminder: ${
                        birthday.name
                    }'s Birthday in ${daysBefore} day${
                        daysBefore > 1 ? "s" : ""
                    }!`,
                    text: `Hey ${
                        birthday.userId.name || "there"
                    },\n\nDon't forget — ${
                        birthday.name
                    }'s birthday is coming up in ${daysBefore} day${
                        daysBefore > 1 ? "s" : ""
                    }! 🎂\n\n- Bornify`,
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #e91e63;">🎉 Birthday Reminder!</h2>
              <p>Hey ${
                        birthday.userId.name || "there"
                    },</p>
              <p>Don't forget — <strong>${
                        birthday.name
                    }</strong>'s birthday is coming up in <strong>${daysBefore} day${
                        daysBefore > 1 ? "s" : ""
                    }</strong>! 🎂</p>
              <p style="margin-top: 30px; color: #666;">- Bornify Team</p>
            </div>
          `
                };

                try {
                    await new Promise((resolve, reject) => {
                        transporter.sendMail(emailOptions, (err, info) => {
                            if (err) {
                                console.error(`❌ Error sending email to ${
                                    birthday.userId.email
                                }:`, err);
                                emailsFailed++;
                                reject(err);
                            } else {
                                console.log(`✅ Reminder sent to ${
                                    birthday.userId.email
                                } for ${
                                    birthday.name
                                }`);
                                emailsSent++;
                                resolve(info);
                            }
                        });
                    });
                } catch (emailError) {
                    console.error(`❌ Failed to send email for ${
                        birthday.name
                    }:`, emailError);
                    emailsFailed++;
                }
            }
        }

        console.log(`📊 Reminder job completed: ${emailsSent} sent, ${emailsFailed} failed`);
    } catch (error) {
        console.error("❌ Error running birthday reminder job:", error);
    }
});
