export const deliveryOtpEmailTemplate = (otp: string, userName: string): string => {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 40px 20px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: 600;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .greeting {
                        font-size: 16px;
                        margin-bottom: 20px;
                        color: #555;
                    }
                    .otp-section {
                        background-color: #f9f9f9;
                        border-left: 4px solid #667eea;
                        padding: 25px;
                        margin: 30px 0;
                        border-radius: 4px;
                        text-align: center;
                    }
                    .otp-label {
                        font-size: 14px;
                        color: #666;
                        margin-bottom: 10px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        font-weight: 600;
                    }
                    .otp-code {
                        font-size: 36px;
                        font-weight: bold;
                        color: #667eea;
                        letter-spacing: 6px;
                        font-family: 'Courier New', monospace;
                        margin: 15px 0;
                    }
                    .otp-timer {
                        font-size: 13px;
                        color: #e74c3c;
                        margin-top: 10px;
                    }
                    .message {
                        color: #666;
                        font-size: 14px;
                        line-height: 1.8;
                        margin-bottom: 20px;
                    }
                    .footer {
                        background-color: #f5f5f5;
                        padding: 20px 30px;
                        font-size: 12px;
                        color: #999;
                        text-align: center;
                        border-top: 1px solid #eee;
                    }
                    .warning {
                        background-color: #fff3cd;
                        border-left: 4px solid #ffc107;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 4px;
                        font-size: 13px;
                        color: #856404;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🚚 Delivery OTP</h1>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">
                            Hi <strong>${userName}</strong>,
                        </div>
                        
                        <p class="message">
                            Your delivery is on the way! Use the OTP below to verify your identity when the delivery partner arrives.
                        </p>
                        
                        <div class="otp-section">
                            <div class="otp-label">Your Delivery OTP</div>
                            <div class="otp-code">${otp}</div>
                            <div class="otp-timer">⏱️ Valid for 10 minutes</div>
                        </div>
                        
                        <div class="warning">
                            <strong>⚠️ Security Alert:</strong> Never share this OTP with anyone. Our delivery partner will never ask for it via call or message.
                        </div>
                        
                        <p class="message">
                            Keep this OTP handy and share it with your delivery partner when they arrive at your location.
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p>© 2024 Grocery Delivery. All rights reserved.</p>
                        <p>If you didn't request this OTP, please contact support immediately.</p>
                    </div>
                </div>
            </body>
        </html>
    `;
};