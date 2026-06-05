const verifyOtpTemplate = ({ name, otp }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify OTP - GroStore</title>
    </head>
    <body style="margin: 0; padding: 16px; background-color: #f4f4f4; font-family: Arial, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

        <!-- Header -->
        <tr>
          <td align="center" style="background-color: #4CAF50; padding: 40px 20px; color: white;">
            <h1 style="margin: 0; font-size: 32px; font-weight: bold;">GroStore</h1>
            <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">
              Fresh Groceries Delivered to Your Door
            </p>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding: 40px 30px; text-align: center;">
            <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">
              Hello, ${name}!
            </h2>

            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              We received a request to reset your password.
              Please use the OTP below to verify your request.
            </p>

            <!-- OTP Box -->
            <div style="
              display: inline-block;
              background-color: #f1f8f4;
              color: #4CAF50;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              padding: 15px 30px;
              border-radius: 10px;
              border: 2px dashed #4CAF50;
              margin-bottom: 30px;
            ">
              ${otp}
            </div>

            <p style="color: #555; font-size: 16px; margin-top: 20px;">
              This OTP will expire in <strong>1 hour</strong>.
            </p>

            <p style="color: #888; font-size: 14px; margin-top: 30px; line-height: 1.5;">
              If you did not request a password reset, please ignore this email.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #f8f8f8; padding: 30px; text-align: center; color: #888; font-size: 14px;">
            <p style="margin: 0 0 10px;">&copy; 2026 GroStore. All rights reserved.</p>
            <p style="margin: 0;">
              Need help? Contact our support team.
            </p>
          </td>
        </tr>

      </table>
    </body>
    </html>
  `;
};

export default verifyOtpTemplate;
