# Quick Start Guide - Employee Management System

## 🚀 Setup (First Time Only)

### 1. Install Dependencies
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Setup Database
```bash
cd server

# Check if database is ready
npm run check-db

# If needed, create database
mysql -u root -p
CREATE DATABASE employee_management;
EXIT;
```

### 3. Configure Environment
Edit `server/.env`:
```env
DB_HOST = localhost
DB_USER = root
DB_PASSWORD = root
DB_NAME = employee_management
PORT = 4000
```

### 4. Start Application
```bash
# Terminal 1 - Start Backend
cd server
npm start

# Terminal 2 - Start Frontend
cd client
npm start
```

Access at: **http://localhost:3000**

---

## 📋 Main Features

### Add Single Employee
1. Click **"Add Details"** button
2. Fill in the form
3. Click **"Save"** or **"Update"**

### Bulk Import Employees
1. Click **"Download Sample Template"** (green button)
2. Open the downloaded Excel file
3. Delete sample data and add your employees
4. Save the file
5. Click **"Import Employee Details"**
6. Select your file
7. Wait for success message

### View/Edit/Delete Employees
- **Eye icon** 👁️ - View details (read-only)
- **Edit icon** ✏️ - Edit employee
- **Delete icon** 🗑️ - Remove employee

### Search & Filter
- Use search box to find employees by name, email, position, etc.
- Click column headers to sort

### Export Data
- Click **"Download Employee Data"** to export all employees as Excel

---

## 📝 Quick Tips

### Template Format
```
Name (max 10) | Age (18+) | Position (max 16) | Email (.com/.io/.in) | Office Days (1-31) | Salary (optional)
```

### Validation Rules
- **Name:** Required, max 10 characters
- **Age:** Required, 18-999
- **Position:** Required, max 16 characters
- **Email:** Required, unique, valid format
- **Office Days:** Required, 1-31
- **Salary:** Optional (auto: Days × 800)

### Common Errors
| Error | Solution |
|-------|----------|
| Email invalid | Must end with .com, .io, or .in |
| Name too long | Maximum 10 characters |
| Age too low | Minimum 18 years |
| Office Days > 31 | Maximum 31 days |

---

## 🔧 Troubleshooting

### Server Won't Start
```bash
# Check if database is running
sudo systemctl status mysql

# Check database connection
cd server
npm run check-db
```

### Database Connection Failed
```bash
# Start MySQL
sudo systemctl start mysql

# Verify credentials in server/.env
DB_USER = root
DB_PASSWORD = root
DB_NAME = employee_management
```

### Email Errors (Won't Crash Server)
```
⚠️  Email notifications are DISABLED
```
This is normal - app works without email. To enable, see `EMAIL_SETUP.md`

### Import Fails
1. Use the sample template (don't modify headers)
2. Check all required fields are filled
3. Verify email format and uniqueness
4. Ensure file is .xlsx format

---

## 🎯 Workflow Examples

### Scenario 1: Adding 5 New Employees
1. Download sample template
2. Fill in 5 employee rows
3. Upload file
4. Verify in list ✅

### Scenario 2: Updating Employee Info
1. Click edit icon on employee row
2. Modify details
3. Click "Update"
4. Changes reflected immediately ✅

### Scenario 3: Exporting for Backup
1. Click "Download Employee Data"
2. File saves as `employees.xlsx`
3. Keep for records ✅

---

## 📚 Documentation

- **BULK_UPLOAD_GUIDE.md** - Detailed bulk import instructions
- **DATABASE_SETUP.md** - Complete database setup guide
- **EMAIL_SETUP.md** - Email notification configuration
- **QUICK_FIX.md** - Solutions for common issues

---

## 🔑 Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Check server & DB status |
| `/download-sample-template` | GET | Get upload template |
| `/create` | POST | Add single employee |
| `/get-employee-details` | GET | List all employees |
| `/upload-employee-details` | POST | Bulk import |
| `/download-employee-data` | GET | Export all data |

---

## ✅ System Check

Before starting work:
```bash
cd server
npm run check-db
npm start
```

Look for:
- ✅ Server running on port 4000
- ✅ Connected to MySQL database
- ⚠️  Email notifications status (optional)

---

## 🎉 You're All Set!

Your Employee Management System is ready to use. Start by downloading the sample template and importing your first batch of employees!

**Need Help?** Check the detailed guides in the documentation files.
