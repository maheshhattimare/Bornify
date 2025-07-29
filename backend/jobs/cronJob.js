// utils/birthdayReminder.js
import cron from "node-cron";
import nodemailer from "nodemailer";
import Birthday from "../models/Birthday.js";
import User from "../models/User.js"; // For user email

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // app password, not your main Gmail password
  },
});

// Run at 8:00 AM every day
cron.schedule("0 8 * * *", async () => {
  console.log("⏰ Birthday reminder job running...");

  const today = new Date();
  today.setHours(0, 0, 0, 0); // reset to midnight

  try {
    // Get all birthdays with user info
    const birthdays = await Birthday.find()
      .populate("userId", "email name") // get user email + name
      .lean();

    birthdays.forEach((b) => {
      if (!b.userId?.email) return; // skip if user has no email

      const birthDate = new Date(b.birthdate);
      const thisYearBirthday = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
      );

      // If birthday already passed this year, set to next year
      if (thisYearBirthday < today) {
        thisYearBirthday.setFullYear(today.getFullYear() + 1);
      }

      // Calculate reminder date based on notifyBeforeDays
      const daysBefore = b.notifyBeforeDays ?? 1; // default 1 day
      const reminderDate = new Date(thisYearBirthday);
      reminderDate.setDate(reminderDate.getDate() - daysBefore);

      // Compare dates
      if (reminderDate.getTime() === today.getTime()) {
        const emailOptions = {
          from: process.env.EMAIL_USER,
          to: b.userId.email,
          subject: `🎉 Reminder: ${b.name}'s Birthday in ${daysBefore} day${
            daysBefore > 1 ? "s" : ""
          }!`,
          text: `Hey ${b.userId.name || "there"},\n\nDon't forget — ${
            b.name
          }'s birthday is coming up in ${daysBefore} day${
            daysBefore > 1 ? "s" : ""
          }! 🎂\n\n- Bornify`,
        };

        transporter.sendMail(emailOptions, (err) => {
          if (err) {
            console.error(`❌ Error sending email to ${b.userId.email}:`, err);
          } else {
            console.log(`✅ Reminder sent to ${b.userId.email} for ${b.name}`);
          }
        });
      }
    });
  } catch (error) {
    console.error("❌ Error running birthday reminder job:", error);
  }
});
