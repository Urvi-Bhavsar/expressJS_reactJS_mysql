# Email Configuration Guide

## Overview
The application sends email notifications when employees are created or uploaded. However, **email functionality is completely optional** - the application will work perfectly fine without it.

## Current Status
⚠️ **Email credentials in `.env` appear to be invalid or expired**

The error you're seeing:
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

This means the Gmail App Password is no longer valid.

## How the Application Handles Email Errors

✅ **Server will NOT crash** if email fails
✅ **Employee operations continue normally**
✅ **Error is logged** but doesn't stop execution
✅ **Email is optional** - can be disabled completely

## Options

### Option 1: Disable Email Completely (Recommended for Development)

Simply comment out or remove the email credentials in `.env`:

```env
# EMAIL_USER = urvi.bhavsar@tntra.io
# EMAIL_PASS = hyeq fqxo ekfw mukh
```

Or leave them empty:
```env
EMAIL_USER = 
EMAIL_PASS = 
```

The application will detect this and skip email sending.

### Option 2: Fix Email Configuration

If you want email notifications to work, follow these steps:

#### Step 1: Enable 2-Step Verification
1. Go to https://myaccount.google.com/
2. Click "Security" in the left sidebar
3. Scroll to "How you sign in to Google"
4. Click "2-Step Verification"
5. Follow the setup process

#### Step 2: Generate App Password
1. After enabling 2-Step Verification, go back to Security
2. Scroll down to "App passwords"
3. Click "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Enter a name like "Employee Management System"
6. Click "Generate"
7. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

#### Step 3: Update .env File
```env
EMAIL_USER = your-email@gmail.com
EMAIL_PASS = abcd efgh ijkl mnop
```

**Important:** Remove spaces from the app password or keep them - both work.

#### Step 4: Update Email Recipients
In `server/src/controllers/employeeController.js`, update these lines:
```javascript
cc: "your-cc-email@gmail.com",
bcc: "your-bcc-email@gmail.com",
```

### Option 3: Use Different Email Service

If you don't want to use Gmail, you can modify `server/src/config/mailer.js`:

#### For Outlook/Office365:
```javascript
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

#### For Yahoo:
```javascript
const transporter = nodemailer.createTransport({
  service: "yahoo",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

#### For Custom SMTP:
```javascript
const transporter = nodemailer.createTransport({
  host: "your-smtp-server.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

## Testing Email Configuration

After updating credentials, restart the server and check the console:

### Success:
```
✅ Email service is ready
```

### Failure (but application continues):
```
⚠️  Email service configuration error:
   Message: Invalid login: 535-5.7.8 Username and Password not accepted

📧 Email notifications are DISABLED
   Application will continue without email functionality
```

## Email Features in the Application

When email is working, notifications are sent for:

1. **Employee Creation**
   - Welcome email to the new employee
   - Contains: Name, Position, Office Days

2. **Bulk Upload**
   - Notification to all uploaded employees
   - Summary of total records uploaded

## Troubleshooting

### Error: "Invalid login"
- App password is wrong or expired
- 2-Step Verification not enabled
- Solution: Generate new app password

### Error: "ECONNREFUSED"
- No internet connection
- SMTP server unreachable
- Solution: Check internet connection

### Error: "ETIMEDOUT"
- Firewall blocking port 465/587
- Network restrictions
- Solution: Check firewall/network settings

### Emails not received
- Check spam folder
- Verify recipient email address
- Check email service quotas

## Security Best Practices

1. **Never commit .env file to git**
   - Already in .gitignore
   - Contains sensitive credentials

2. **Use App Passwords, not account password**
   - More secure
   - Can be revoked independently

3. **Rotate passwords regularly**
   - Generate new app password every few months
   - Delete old ones

4. **Limit email recipients**
   - Don't send to unnecessary CC/BCC
   - Respect email quotas

## Email Quotas

Be aware of email sending limits:

- **Gmail Free:** ~500 emails/day
- **Gmail Workspace:** ~2000 emails/day
- **Other services:** Check provider limits

If you exceed quotas, email sending will fail but the application will continue working.

## Current Fix Applied

The application has been updated with:
- ✅ Safe email wrapper function
- ✅ Graceful error handling
- ✅ Server won't crash on email failures
- ✅ Automatic detection of email availability
- ✅ Clear console messages about email status

You can now run the application without fixing email credentials - it will work perfectly fine without email functionality!
