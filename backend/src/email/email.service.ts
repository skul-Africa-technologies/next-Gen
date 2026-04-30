import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface UserInfo {
  email: string;
  name: string;
}

export interface VerificationInfo {
  email: string;
  name: string;
  verificationToken: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private readonly maxRetries = 3;
  private readonly retryDelay = 2000;

  constructor(private configService: ConfigService) {
    const brevoApiKey = this.configService.get<string>('BREVO_API_KEY');
    const emailFrom = this.configService.get<string>('EMAIL_FROM') || 'noreply@nextgen.com';

    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: brevoApiKey?.split(':')[0] || '',
        pass: brevoApiKey || '',
      },
    });
  }

  private async withRetry<T>(
    fn: () => Promise<T>,
    context: string,
  ): Promise<T> {
    let lastError: Error | undefined;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.logger.warn(
          `Attempt ${attempt}/${this.maxRetries} failed for ${context}: ${lastError.message}`,
        );
        if (attempt < this.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        }
      }
    }
    throw lastError || new Error(`Failed after ${this.maxRetries} attempts`);
  }

  async sendSignupEmail(user: UserInfo): Promise<void> {
    const emailFrom = this.configService.get<string>('EMAIL_FROM') || 'noreply@nextgen.com';
    const appName = 'NextGen';

    const htmlContent = this.getSignupTemplate(user.name);

    await this.withRetry(
      async () => {
        await this.transporter.sendMail({
          from: `${appName} <${emailFrom}>`,
          to: user.email,
          subject: 'Welcome to NextGen - You\'re Now Part of the Next Generation!',
          html: htmlContent,
        });
        this.logger.log(`Signup email sent to ${user.email}`);
      },
      `signup email to ${user.email}`,
    );
  }

  async sendLoginEmail(user: UserInfo): Promise<void> {
    const emailFrom = this.configService.get<string>('EMAIL_FROM') || 'noreply@nextgen.com';
    const appName = 'NextGen';
    const loginTime = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const htmlContent = this.getLoginTemplate(user.name, loginTime);

    await this.withRetry(
      async () => {
        await this.transporter.sendMail({
          from: `${appName} <${emailFrom}>`,
          to: user.email,
          subject: 'New Login Detected - NextGen',
          html: htmlContent,
        });
        this.logger.log(`Login email sent to ${user.email}`);
      },
      `login email to ${user.email}`,
    );
  }

  async sendVerificationEmail(info: VerificationInfo): Promise<void> {
    const emailFrom = this.configService.get<string>('EMAIL_FROM') || 'noreply@nextgen.com';
    const appName = 'NextGen';
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'https://nextgen.com';
    const verificationLink = `${frontendUrl}/verify-email?token=${info.verificationToken}`;

    const htmlContent = this.getVerificationTemplate(info.name, verificationLink);

    await this.withRetry(
      async () => {
        await this.transporter.sendMail({
          from: `${appName} <${emailFrom}>`,
          to: info.email,
          subject: 'Verify Your Email - NextGen',
          html: htmlContent,
        });
        this.logger.log(`Verification email sent to ${info.email}`);
      },
      `verification email to ${info.email}`,
    );
  }

  private getSignupTemplate(name: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to NextGen</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #111111; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(255, 107, 0, 0.15);">
            <!-- Header -->
            <tr>
              <td style="padding: 0;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td height="4" style="background: linear-gradient(90deg, #FF6B00 0%, #FF8C33 100%);"></td>
                  </tr>
                </table>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #161616; padding: 30px 40px;">
                  <tr>
                    <td align="center">
                      <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        Next<span style="color: #FF6B00;">Gen</span>
                      </h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px;">
                <h2 style="margin: 0 0 20px 0; color: #FFFFFF; font-size: 24px; font-weight: 600;">
                  Welcome aboard, ${this.escapeHtml(name)}!
                </h2>
                <p style="margin: 0 0 20px 0; color: #A0A0A0; font-size: 16px; line-height: 1.6;">
                  You're now part of the <strong style="color: #FF6B00;">next generation</strong> of innovators. Your journey to building the future starts here.
                </p>
                <p style="margin: 0 0 30px 0; color: #A0A0A0; font-size: 16px; line-height: 1.6;">
                  Explore hackathons, connect with fellow students, and bring your ideas to life. We can't wait to see what you'll create.
                </p>

                <!-- CTA Button -->
                <table border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #FF6B00 0%, #FF8533 100%);" bgcolor="#FF6B00">
                      <a href="https://nextgen.com" style="font-size: 16px; font-weight: 600; color: #FFFFFF; text-decoration: none; padding: 16px 32px; display: inline-block; border-radius: 12px;">
                        Explore Platform
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 30px 40px; background-color: #0D0D0D; border-top: 1px solid #222222;">
                <p style="margin: 0; color: #666666; font-size: 13px; text-align: center; line-height: 1.5;">
                  Need help? Contact us at <a href="mailto:support@nextgen.com" style="color: #FF6B00; text-decoration: none;">support@nextgen.com</a>
                </p>
                <p style="margin: 10px 0 0 0; color: #444444; font-size: 12px; text-align: center;">
                  © ${new Date().getFullYear()} NextGen. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  }

  private getLoginTemplate(name: string, loginTime: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Login - NextGen</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #111111; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(255, 107, 0, 0.15);">
            <!-- Header -->
            <tr>
              <td style="padding: 0;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td height="4" style="background: linear-gradient(90deg, #FF6B00 0%, #FF8C33 100%);"></td>
                  </tr>
                </table>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #161616; padding: 30px 40px;">
                  <tr>
                    <td align="center">
                      <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        Next<span style="color: #FF6B00;">Gen</span>
                      </h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px;">
                <h2 style="margin: 0 0 20px 0; color: #FFFFFF; font-size: 24px; font-weight: 600;">
                  New Login Detected
                </h2>
                <p style="margin: 0 0 10px 0; color: #A0A0A0; font-size: 16px; line-height: 1.6;">
                  Hi <strong style="color: #FFFFFF;">${this.escapeHtml(name)}</strong>,
                </p>
                <p style="margin: 0 0 20px 0; color: #A0A0A0; font-size: 16px; line-height: 1.6;">
                  We noticed a new login to your account from:
                </p>
                <div style="background-color: #1A1A1A; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #333333;">
                  <p style="margin: 0; color: #FFFFFF; font-size: 16px; font-weight: 500;">
                    🕐 ${loginTime}
                  </p>
                </div>
                <p style="margin: 0 0 30px 0; color: #707070; font-size: 14px; line-height: 1.6;">
                  If this was you, you're all set! If you didn't log in, please secure your account immediately.
                </p>

                <!-- CTA Button -->
                <table border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #FF6B00 0%, #FF8533 100%);" bgcolor="#FF6B00">
                      <a href="https://nextgen.com" style="font-size: 16px; font-weight: 600; color: #FFFFFF; text-decoration: none; padding: 16px 32px; display: inline-block; border-radius: 12px;">
                        Explore Platform
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 30px 40px; background-color: #0D0D0D; border-top: 1px solid #222222;">
                <p style="margin: 0; color: #666666; font-size: 13px; text-align: center; line-height: 1.5;">
                  Need help? Contact us at <a href="mailto:support@nextgen.com" style="color: #FF6B00; text-decoration: none;">support@nextgen.com</a>
                </p>
                <p style="margin: 10px 0 0 0; color: #444444; font-size: 12px; text-align: center;">
                  © ${new Date().getFullYear()} NextGen. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  }

  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  private getVerificationTemplate(name: string, verificationLink: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - NextGen</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #111111; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(255, 107, 0, 0.15);">
            <!-- Header -->
            <tr>
              <td style="padding: 0;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td height="4" style="background: linear-gradient(90deg, #FF6B00 0%, #FF8C33 100%);"></td>
                  </tr>
                </table>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #161616; padding: 30px 40px;">
                  <tr>
                    <td align="center">
                      <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        Next<span style="color: #FF6B00;">Gen</span>
                      </h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px;">
                <h2 style="margin: 0 0 20px 0; color: #FFFFFF; font-size: 24px; font-weight: 600;">
                  Verify Your Email
                </h2>
                <p style="margin: 0 0 10px 0; color: #A0A0A0; font-size: 16px; line-height: 1.6;">
                  Hi <strong style="color: #FFFFFF;">${this.escapeHtml(name)}</strong>,
                </p>
                <p style="margin: 0 0 20px 0; color: #A0A0A0; font-size: 16px; line-height: 1.6;">
                  Welcome to NextGen! Please verify your email address to get started.
                </p>

                <!-- CTA Button -->
                <table border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #FF6B00 0%, #FF8533 100%);" bgcolor="#FF6B00">
                      <a href="${verificationLink}" style="font-size: 16px; font-weight: 600; color: #FFFFFF; text-decoration: none; padding: 16px 32px; display: inline-block; border-radius: 12px;">
                        Verify Email
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin: 30px 0 0 0; color: #707070; font-size: 14px; line-height: 1.6;">
                  This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 30px 40px; background-color: #0D0D0D; border-top: 1px solid #222222;">
                <p style="margin: 0; color: #666666; font-size: 13px; text-align: center; line-height: 1.5;">
                  Need help? Contact us at <a href="mailto:support@nextgen.com" style="color: #FF6B00; text-decoration: none;">support@nextgen.com</a>
                </p>
                <p style="margin: 10px 0 0 0; color: #444444; font-size: 12px; text-align: center;">
                  © ${new Date().getFullYear()} NextGen. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  }

  async sendPasswordResetEmail(info: { email: string; name: string; resetLink: string }): Promise<void> {
    const emailFrom = this.configService.get<string>('EMAIL_FROM') || 'noreply@nextgen.com';
    const appName = 'NextGen';

    const htmlContent = this.getPasswordResetTemplate(info.name, info.resetLink);

    await this.withRetry(
      async () => {
        await this.transporter.sendMail({
          from: `${appName} <${emailFrom}>`,
          to: info.email,
          subject: 'Reset Your Password - NextGen',
          html: htmlContent,
        });
        this.logger.log(`Password reset email sent to ${info.email}`);
      },
      `password reset email to ${info.email}`,
    );
  }

  private getPasswordResetTemplate(name: string, resetLink: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - NextGen</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #111111; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(255, 107, 0, 0.15);">
            <!-- Header -->
            <tr>
              <td style="padding: 0;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td height="4" style="background: linear-gradient(90deg, #FF6B00 0%, #FF8C33 100%);"></td>
                  </tr>
                </table>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #161616; padding: 30px 40px;">
                  <tr>
                    <td align="center">
                      <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        Next<span style="color: #FF6B00;">Gen</span>
                      </h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px;">
                <h2 style="margin: 0 0 20px 0; color: #FFFFFF; font-size: 24px; font-weight: 600;">
                  Reset Your Password
                </h2>
                <p style="margin: 0 0 10px 0; color: #A0A0A0; font-size: 16px; line-height: 1.6;">
                  Hi <strong style="color: #FFFFFF;">${this.escapeHtml(name)}</strong>,
                </p>
                <p style="margin: 0 0 20px 0; color: #A0A0A0; font-size: 16px; line-height: 1.6;">
                  You requested to reset your password. Click the button below to choose a new password.
                </p>

                <!-- CTA Button -->
                <table border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #FF6B00 0%, #FF8533 100%);" bgcolor="#FF6B00">
                      <a href="${resetLink}" style="font-size: 16px; font-weight: 600; color: #FFFFFF; text-decoration: none; padding: 16px 32px; display: inline-block; border-radius: 12px;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin: 30px 0 0 0; color: #707070; font-size: 14px; line-height: 1.6;">
                  This link will expire in 30 minutes. If you didn't request a password reset, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 30px 40px; background-color: #0D0D0D; border-top: 1px solid #222222;">
                <p style="margin: 0; color: #666666; font-size: 13px; text-align: center; line-height: 1.5;">
                  Need help? Contact us at <a href="mailto:support@nextgen.com" style="color: #FF6B00; text-decoration: none;">support@nextgen.com</a>
                </p>
                <p style="margin: 10px 0 0 0; color: #444444; font-size: 12px; text-align: center;">
                  © ${new Date().getFullYear()} NextGen. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  }

  async sendPasswordChangedConfirmationEmail(user: UserInfo): Promise<void> {
    const emailFrom = this.configService.get<string>('EMAIL_FROM') || 'noreply@nextgen.com';
    const appName = 'NextGen';
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    const htmlContent = this.getPasswordChangedTemplate(user.name, frontendUrl);

    await this.withRetry(
      async () => {
        await this.transporter.sendMail({
          from: `${appName} <${emailFrom}>`,
          to: user.email,
          subject: 'Your Password Has Been Changed - NextGen',
          html: htmlContent,
        });
        this.logger.log(`Password change confirmation email sent to ${user.email}`);
      },
      `password change confirmation email to ${user.email}`,
    );
  }

  private getPasswordChangedTemplate(name: string, frontendUrl: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed - NextGen</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #111111; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(255, 107, 0, 0.15);">
            <!-- Header -->
            <tr>
              <td style="padding: 0;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td height="4" style="background: linear-gradient(90deg, #FF6B00 0%, #FF8C33 100%);"></td>
                  </tr>
                </table>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #161616; padding: 30px 40px;">
                  <tr>
                    <td align="center">
                      <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        Next<span style="color: #FF6B00;">Gen</span>
                      </h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px;">
                <h2 style="margin: 0 0 20px 0; color: #00C853; font-size: 24px; font-weight: 600;">
                  Password Successfully Changed
                </h2>
                <p style="margin: 0 0 10px 0; color: #A0A0A0; font-size: 16px; line-height: 1.6;">
                  Hi <strong style="color: #FFFFFF;">${this.escapeHtml(name)}</strong>,
                </p>
                <p style="margin: 0 0 20px 0; color: #A0A0A0; font-size: 16px; line-height: 1.6;">
                  Your password has been successfully changed. Your account is now secure.
                </p>

                <p style="margin: 0 0 30px 0; color: #707070; font-size: 14px; line-height: 1.6;">
                  If you did not make this change, please contact our support team immediately.
                </p>

                <!-- CTA Button -->
                <table border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #FF6B00 0%, #FF8533 100%);" bgcolor="#FF6B00">
                      <a href="${frontendUrl}" style="font-size: 16px; font-weight: 600; color: #FFFFFF; text-decoration: none; padding: 16px 32px; display: inline-block; border-radius: 12px;">
                        Go to Login
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 30px 40px; background-color: #0D0D0D; border-top: 1px solid #222222;">
                <p style="margin: 0; color: #666666; font-size: 13px; text-align: center; line-height: 1.5;">
                  Need help? Contact us at <a href="mailto:support@nextgen.com" style="color: #FF6B00; text-decoration: none;">support@nextgen.com</a>
                </p>
                <p style="margin: 10px 0 0 0; color: #444444; font-size: 12px; text-align: center;">
                  © ${new Date().getFullYear()} NextGen. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  }
}