const verifyEmailTemplate = ({ name, url }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - GroStore</title>
    </head>
    <body style="margin: 0; padding: 16px; background-color: #f4f4f4; font-family: Arial, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <!-- Header with Green Background -->
        <tr>
          <td align="center" style="background-color: #4CAF50; padding: 40px 20px; color: white;">
            <h1 style="margin: 0; font-size: 32px; font-weight: bold;">GroStore</h1>
            <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Fresh Groceries Delivered to Your Door</p>
          </td>
        </tr>

        <!-- Main Content -->
        <tr>
          <td style="padding: 40px 30px; text-align: center;">
            <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Welcome, ${name}!</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Thank you for signing up with GroStore. To complete your registration and start shopping fresh groceries, please verify your email address by clicking the button below.
            </p>

            <!-- Verify Button -->
            <a href="${url}" target="_blank" style="display: inline-block; background-color: #4CAF50; color: white; font-size: 18px; font-weight: bold; text-decoration: none; padding: 15px 40px; border-radius: 8px; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);">
              Verify Email Address
            </a>

            <p style="color: #888; font-size: 14px; margin-top: 30px; line-height: 1.5;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${url}" style="color: #4CAF50; word-break: break-all;">${url}</a>
            </p>

            <p style="color: #555; font-size: 16px; margin-top: 40px;">
              This link will expire in 1 hour for security reasons.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #f8f8f8; padding: 30px; text-align: center; color: #888; font-size: 14px;">
            <p style="margin: 0 0 10px;">&copy; 2026 GroStore. All rights reserved.</p>
            <p style="margin: 0;">
              If you didn't create an account, please ignore this email or contact support.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export default verifyEmailTemplate;
