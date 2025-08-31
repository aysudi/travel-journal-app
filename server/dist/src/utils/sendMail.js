import nodemailer from "nodemailer";
import config from "../config/config";
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_PASS,
    },
});
const generateUnlockAccountHTML = (name, unlockAccountLink, lockUntil) => {
    return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 40px; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; text-align: center; padding: 40px 20px;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">🔐 Account Locked</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Security Alert for Your VoyageVault Account</p>
        </div>
        <div style="padding: 40px 30px; line-height: 1.7; color: #1e293b;">
          <p style="margin: 0 0 20px 0; font-size: 16px;">Hi <strong>${name}</strong>,</p>
          <p style="margin: 0 0 20px 0;">Your account has been temporarily locked due to multiple unsuccessful login attempts. It will remain locked until <strong style="color: #dc2626;">${lockUntil}</strong>.</p>
          <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-left: 4px solid #dc2626; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <strong>🛡️ Security Tip:</strong> If this wasn't you, contact support immediately.
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${unlockAccountLink}" style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);">🔓 Unlock Account Now</a>
          </div>
          <p style="margin: 20px 0 0 0; color: #64748b; font-size: 14px; text-align: center;">Safe travels! ✈️ The VoyageVault Team</p>
        </div>
        <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: #f1f5f9; text-align: center; padding: 25px;">
          <div style="font-size: 18px; font-weight: 600; color: #94a3b8; margin-bottom: 10px;">✈️ VoyageVault</div>
          <p style="margin: 0; font-size: 12px; opacity: 0.8;">&copy; ${new Date().getFullYear()} VoyageVault. Protecting your memories.</p>
        </div>
      </div>
    </div>
  `;
};
export const sendUnlockAccountEmail = async (recipientEmail, name, unlockTime, unlockAccountLink) => {
    try {
        const htmlContent = generateUnlockAccountHTML(name, unlockAccountLink, unlockTime);
        const mailOptions = {
            from: `"VoyageVault Security" <${config.GMAIL_USER}>`,
            to: recipientEmail,
            subject: "🔒 VoyageVault Account Locked - Action Required",
            html: htmlContent,
        };
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error("Error sending unlock account email:", error);
    }
};
export const sendVerificationEmail = async (toEmail, userFullName, verificationLink) => {
    try {
        await transporter.sendMail({
            from: `"VoyageVault" <${config.GMAIL_USER}>`,
            to: toEmail,
            subject: "✈️ Welcome to VoyageVault - Verify Your Email",
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 40px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; text-align: center; padding: 50px 20px;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700;">Welcome to VoyageVault!</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Your Journey Starts Here</p>
            </div>
            <div style="padding: 40px 30px; line-height: 1.8; color: #1e293b;">
              <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 12px; padding: 25px; margin: 0 0 30px 0; text-align: center; border-left: 5px solid #64748b;">
                <h3 style="margin: 0 0 15px 0; color: #334155; font-size: 20px;">🎉 Welcome ${userFullName}!</h3>
                <p style="margin: 0; color: #475569;">You've joined thousands of travelers who trust VoyageVault!</p>
              </div>
              <p style="margin: 0 auto; text-align: center; font-size: 16px;">We're thrilled to have you! VoyageVault is your digital companion for documenting memories and planning adventures.</p>
              <div style="display: flex; gap: 15px; margin: 25px auto; flex-wrap: wrap; justify-content: center; align-items: center;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;  min-width: 120px;">
                  <div style="font-size: 24px; margin-bottom: 8px;">📝</div>
                  <div style="font-weight: 600; color: #495057; font-size: 14px;">Travel Journals</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; min-width: 120px;">
                  <div style="font-size: 24px; margin-bottom: 8px;">🗺️</div>
                  <div style="font-weight: 600; color: #495057; font-size: 14px;">Trip Planning</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; min-width: 120px;">
                  <div style="font-size: 24px; margin-bottom: 8px;">📸</div>
                  <div style="font-weight: 600; color: #495057; font-size: 14px;">Memory Vault</div>
                </div>
              </div>
              <p style="margin: 25px auto; text-align: center; font-size: 16px;">To start exploring, please verify your email address:</p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #334155 0%, #475569 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 18px; box-shadow: 0 8px 20px rgba(51, 65, 85, 0.3);">✨ Verify Email Address</a>
              </div>
              <p style="font-size: 14px; color: #64748b; text-align: center; margin: 25px 0 0 0;">If you didn't create this account, you can safely ignore this email.</p>
            </div>
            <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: #f1f5f9; text-align: center; padding: 30px;">
              <div style="font-size: 20px; font-weight: 600; color: #94a3b8; margin-bottom: 10px;">✈️ VoyageVault</div>
              <p style="margin: 0 0 15px 0;">Capturing memories, one journey at a time</p>
              <p style="margin: 0; font-size: 12px; opacity: 0.8;">&copy; ${new Date().getFullYear()} VoyageVault. All rights reserved.</p>
            </div>
          </div>
        </div>`,
        });
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
};
export const sendForgotPasswordEmail = async (toEmail, userFullName, resetLink) => {
    try {
        await transporter.sendMail({
            from: `"VoyageVault" <${config.GMAIL_USER}>`,
            to: toEmail,
            subject: "🔐 Reset Your VoyageVault Password",
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 40px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            <div style="background: linear-gradient(135deg, #4d9de0 0%, #5a6fd8 100%); color: white; text-align: center; padding: 50px 20px;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700;">🔐 Password Reset</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Secure Your VoyageVault Account</p>
            </div>
            <div style="padding: 40px 30px; line-height: 1.8; color: #2c3e50;">
              <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 25px; margin: 0 0 30px 0; text-align: center; border-left: 5px solid #4d9de0;">
                <h3 style="margin: 0 0 15px 0; color: #1565c0; font-size: 20px;">Hello ${userFullName}!</h3>
                <p style="margin: 0; color: #1976d2;">We received a request to reset your VoyageVault password.</p>
              </div>
              <p style="margin: 0 0 25px 0; font-size: 16px;">If this was you, click the secure button below to create a new password:</p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #4d9de0 0%, #5a6fd8 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 18px; box-shadow: 0 8px 20px rgba(77, 157, 224, 0.3);">🔑 Reset My Password</a>
              </div>
              <div style="background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #f44336; text-align: center;">
                <strong style="color: #c62828;">⏰ This link expires in 1 hour</strong>
              </div>
              <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #ff9800;">
                <h4 style="margin: 0 0 15px 0; color: #f57f17; font-size: 16px;">🛡️ Security Tips:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #5d4037; font-size: 14px;">
                  <li style="margin-bottom: 8px;">Use a mix of uppercase, lowercase, numbers, and symbols</li>
                  <li style="margin-bottom: 8px;">Make it at least 8 characters long</li>
                  <li>Don't reuse passwords from other accounts</li>
                </ul>
              </div>
              <p style="font-size: 14px; color: #6c757d; text-align: center; margin: 25px 0 0 0;">If you didn't request this, you can safely ignore this email.</p>
            </div>
            <div style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: #ecf0f1; text-align: center; padding: 30px;">
              <div style="font-size: 20px; font-weight: 600; color: #4d9de0; margin-bottom: 10px;">✈️ VoyageVault</div>
              <p style="margin: 0; font-size: 12px; opacity: 0.8;">&copy; ${new Date().getFullYear()} VoyageVault. All rights reserved.</p>
            </div>
          </div>
        </div>`,
        });
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
};
