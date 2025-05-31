import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"FileShare Hub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - FileShare Hub',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 30px;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              color: #856404;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>FileShare Hub</p>
          </div>
          
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password for your FileShare Hub account. If you didn't make this request, you can safely ignore this email.</p>
            
            <p>To reset your password, click the button below:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="background: #e9ecef; padding: 10px; border-radius: 5px; word-break: break-all;">
              ${resetUrl}
            </p>
            
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul style="margin: 5px 0;">
                <li>This link will expire in 1 hour for security reasons</li>
                <li>You can only use this link once</li>
                <li>If you didn't request this reset, please ignore this email</li>
              </ul>
            </div>
            
            <p>If you're having trouble with the button above, copy and paste the URL below into your web browser:</p>
            <p style="color: #666; font-size: 12px; word-break: break-all;">${resetUrl}</p>
          </div>
          
          <div class="footer">
            <p>This email was sent by FileShare Hub</p>
            <p>If you have any questions, please contact our support team.</p>
            <p>&copy; ${new Date().getFullYear()} FileShare Hub. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request - FileShare Hub
        
        Hello,
        
        We received a request to reset your password for your FileShare Hub account.
        
        To reset your password, visit this link:
        ${resetUrl}
        
        This link will expire in 1 hour for security reasons.
        
        If you didn't request this password reset, you can safely ignore this email.
        
        Best regards,
        FileShare Hub Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"FileShare Hub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to FileShare Hub! 🎉',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to FileShare Hub</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .feature {
              background: white;
              padding: 20px;
              margin: 15px 0;
              border-radius: 8px;
              border-left: 4px solid #667eea;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Welcome to FileShare Hub!</h1>
            <p>Your secure file sharing journey starts here</p>
          </div>
          
          <div class="content">
            <h2>Hello ${name || 'there'}! 👋</h2>
            <p>Thank you for joining FileShare Hub, the secure and decentralized file sharing platform.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" class="button">Go to Dashboard</a>
            </div>
            
            <h3>What you can do with FileShare Hub:</h3>
            
            <div class="feature">
              <h4>🚀 Upload Files to IPFS</h4>
              <p>Securely store your files on the decentralized IPFS network</p>
            </div>
            
            <div class="feature">
              <h4>🔗 Generate Shareable Links</h4>
              <p>Create secure download links with custom expiration and download limits</p>
            </div>
            
            <div class="feature">
              <h4>📱 QR Code Sharing</h4>
              <p>Generate QR codes for easy mobile sharing</p>
            </div>
            
            <div class="feature">
              <h4>📊 Track Analytics</h4>
              <p>Monitor your file uploads, downloads, and sharing statistics</p>
            </div>
            
            <div class="feature">
              <h4>🔒 Privacy First</h4>
              <p>Your files are encrypted and stored securely</p>
            </div>
            
            <h3>Getting Started:</h3>
            <ol>
              <li>Visit your dashboard to upload your first file</li>
              <li>Set expiration dates and download limits</li>
              <li>Share the generated link or QR code</li>
              <li>Monitor your files in the dashboard</li>
            </ol>
            
            <p>If you have any questions or need help, don't hesitate to reach out to our support team.</p>
          </div>
          
          <div class="footer">
            <p>Happy file sharing!</p>
            <p>The FileShare Hub Team</p>
            <p>&copy; ${new Date().getFullYear()} FileShare Hub. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to FileShare Hub!
        
        Hello ${name || 'there'}!
        
        Thank you for joining FileShare Hub, the secure and decentralized file sharing platform.
        
        What you can do:
        - Upload files to IPFS
        - Generate shareable links with expiration
        - Create QR codes for easy sharing
        - Track your file analytics
        - Secure and private file storage
        
        Visit your dashboard: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard
        
        Happy file sharing!
        The FileShare Hub Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};

// Test email configuration
export const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return { success: true };
  } catch (error) {
    console.error('Email configuration error:', error);
    return { success: false, error: error.message };
  }
};
