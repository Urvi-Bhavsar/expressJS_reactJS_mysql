# 🏢 Employee Management System

A full-stack web application for managing employee data with support for single and bulk employee operations, built with React, Express.js, and MySQL/TiDB.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://express-js-react-js-mysql-323h.vercel.app)
[![Backend](https://img.shields.io/badge/backend-render-blue)](#)
[![Database](https://img.shields.io/badge/database-TiDB-orange)](https://www.pingcap.com/tidb-serverless/)

## 🌐 Live Deployment

- **Frontend**: [https://express-js-react-js-mysql-323h.vercel.app](https://express-js-react-js-mysql-323h.vercel.app)
- **Backend API**: Deployed on Render
- **Database**: TiDB Cloud (Serverless)

## ✨ Features

### Core Functionality
- ✅ **Add Single Employee** - Form-based employee creation with validation
- ✅ **Bulk Import** - Upload Excel files with multiple employees
- ✅ **View Employee List** - Paginated table with search and sort
- ✅ **Edit Employee** - Update existing employee details
- ✅ **Delete Employee** - Remove employees with confirmation
- ✅ **Export Data** - Download all employees as Excel
- ✅ **Download Template** - Sample Excel template for bulk import

### Technical Features
- 🔍 Real-time search across all fields
- 📊 Sortable columns (Name, Age, Position, Email, etc.)
- 📄 Pagination with configurable page size
- ✉️ Email notifications (optional)
- 🎨 Modern UI with Ant Design
- 📱 Responsive design
- ⚡ Optimized performance with connection pooling
- 🛡️ Input validation and error handling
- 🔒 Secure database connections with SSL support

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.0.0
- **UI Library**: Ant Design 5.23.3
- **Form Management**: Formik 2.4.6
- **Validation**: Yup 1.6.1
- **HTTP Client**: Axios 1.7.9
- **Routing**: React Router DOM 7.1.4
- **Notifications**: React Toastify 11.0.3
- **Utilities**: Lodash 4.17.21
- **Build Tool**: Create React App

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.21.2
- **Database**: MySQL 2.18.1 / MySQL2 3.12.0
- **File Processing**: ExcelJS 4.4.0, Multer 1.4.5
- **Email**: Nodemailer 6.10.0
- **Validation**: Joi 13.13.3, Express Validator 7.2.1
- **Environment**: dotenv 16.4.7
- **Dev Tool**: Nodemon 3.1.9

### Database Options
- **Local Development**: MySQL 5.7+ / 8.0+
- **Production**: TiDB Cloud Serverless

## 📁 Project Structure

```
employee-management/
├── client/                      # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── addEmployee.js
│   │   │   └── addEmployeeDetailsForm.js
│   │   ├── config/             # Configuration files
│   │   │   └── employeeListColumns.js
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useAddEmployee.js
│   │   │   └── useEmployeeDetailsList.js
│   │   ├── list/               # List components
│   │   │   └── employeDetailsList.js
│   │   ├── schema/             # Validation schemas
│   │   │   └── employeeDetailsSchema.js
│   │   ├── App.js              # Main application component
│   │   └── index.js            # Application entry point
│   ├── .env                    # Frontend environment variables
│   └── package.json            # Frontend dependencies
│
├── server/                      # Express.js backend
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   │   ├── db.js           # Database connection
│   │   │   └── mailer.js       # Email configuration
│   │   ├── controllers/        # Request handlers
│   │   │   └── employeeController.js
│   │   ├── middlewares/        # Express middlewares
│   │   │   └── cors.js
│   │   ├── models/             # Database models
│   │   │   └── employeeModel.js
│   │   ├── routes/             # API routes
│   │   │   └── employeeRoutes.js
│   │   ├── serializers/        # Data serializers
│   │   │   └── employeeSerializer.js
│   │   └── app.js              # Express application
│   ├── .env                    # Backend environment variables
│   ├── check-db.js             # Database connection checker
│   ├── employee_management.sql # Database schema
│   └── package.json            # Backend dependencies
│
├── BULK_UPLOAD_GUIDE.md        # Bulk import documentation
├── DATABASE_SETUP.md           # Database setup guide
├── EMAIL_SETUP.md              # Email configuration guide
├── QUICK_START.md              # Quick start guide
├── QUICK_FIX.md                # Troubleshooting guide
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MySQL** (v5.7+ or 8.0+) for local development
- **Git**

### Local Development Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd employee-management
```

#### 2. Setup Backend

```bash
cd server
npm install

# Create .env file
cat > .env << EOF
# Server Configuration
PORT=3001

# Database Configuration (Local MySQL)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=employee_management

# Email Configuration (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EOF
```

#### 3. Setup Database

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p
CREATE DATABASE employee_management;
EXIT;
```

**Option B: Using the check script**
```bash
npm run check-db
```

#### 4. Setup Frontend

```bash
cd ../client
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL="http://localhost:3001"
EOF
```

#### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
# Server runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
# App opens at http://localhost:3000
```

### Production Deployment

#### Backend (Render)

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure build settings:**
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
4. **Add environment variables:**
   ```
   PORT=3001
   DB_HOST=<tidb-host>
   DB_PORT=4000
   DB_USER=<tidb-user>
   DB_PASSWORD=<tidb-password>
   DB_NAME=employee_management
   EMAIL_USER=<your-email>
   EMAIL_PASS=<app-password>
   ```
5. **Deploy**

#### Frontend (Vercel)

1. **Import your GitHub repository** to Vercel
2. **Configure build settings:**
   - **Framework Preset**: Create React App
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/build`
3. **Add environment variables:**
   ```
   REACT_APP_API_URL=<your-render-backend-url>
   ```
4. **Deploy**

#### Database (TiDB Cloud)

1. **Create a TiDB Serverless Cluster** at [https://tidbcloud.com](https://tidbcloud.com)
2. **Get connection details:**
   - Host
   - Port (usually 4000)
   - User
   - Password
3. **Create the database:**
   ```sql
   CREATE DATABASE employee_management;
   ```
4. **Update backend environment variables** with TiDB credentials

## 📖 API Documentation

### Base URL
- **Local**: `http://localhost:3001`
- **Production**: Deployed on Render

### Endpoints

#### Health Check
```http
GET /health
```
Returns server and database status.

#### Get Employees
```http
GET /get-employee-details?page=1&pageSize=5&sortField=name&sortOrder=ASC&search=john
```
**Query Parameters:**
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 5)
- `sortField` - Field to sort by
- `sortOrder` - ASC or DESC
- `search` - Search term

#### Create Employee
```http
POST /create
Content-Type: application/json

{
  "name": "John Doe",
  "age": 30,
  "position": "Developer",
  "email": "john@example.com",
  "officeDays": 22,
  "salary": 17600
}
```

#### Update Employee
```http
PUT /update-employee-details/:id
Content-Type: application/json

{
  "name": "John Doe",
  "age": 31,
  "position": "Senior Dev",
  "email": "john@example.com",
  "officeDays": 23,
  "salary": 18400
}
```

#### Delete Employee
```http
DELETE /delete-employee-details/:id
```

#### Bulk Upload
```http
POST /upload-employee-details
Content-Type: multipart/form-data

file: <excel-file>
```

#### Download Template
```http
GET /download-sample-template
```
Returns Excel template with instructions.

#### Export Data
```http
GET /download-employee-data
```
Returns Excel file with all employees.

## 📝 Validation Rules

### Employee Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| **Name** | String | Yes | Max 10 characters |
| **Age** | Number | Yes | Min: 18, Max: 999 |
| **Position** | String | Yes | Max 16 characters |
| **Email** | String | Yes | Valid email (.com, .io, .in), Unique |
| **Office Days** | Number | Yes | Min: 1, Max: 31 |
| **Salary** | Number | No | Auto-calculated: Days × 800 |

### Sample Data

```javascript
{
  "name": "Alice",
  "age": 28,
  "position": "Designer",
  "email": "alice@company.com",
  "officeDays": 20,
  "salary": 16000
}
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
# API Base URL
REACT_APP_API_URL="http://localhost:3001"

# For production (use your Render backend URL)
# REACT_APP_API_URL="<your-render-backend-url>"
```

#### Backend (.env)
```env
# Server Port
PORT=3001

# Local MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=employee_management

# TiDB Cloud Database (Production)
# DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
# DB_PORT=4000
# DB_USER=<username>
# DB_PASSWORD=<password>
# DB_NAME=employee_management

# Email Configuration (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🎯 Usage Guide

### Adding a Single Employee

1. Click the **"Add Details"** button
2. Fill in the employee form:
   - Name (required, max 10 chars)
   - Age (required, 18+)
   - Position (required, max 16 chars)
   - Email (required, unique)
   - Office Days (required, 1-31)
   - Salary (optional, auto-calculated)
3. Click **"Save"**
4. Employee appears in the list

### Bulk Import Employees

1. Click **"Download Sample Template"** (green button)
2. Open the downloaded Excel file
3. **Read the Instructions sheet** carefully
4. Fill in the Employee Data sheet:
   - Delete sample rows
   - Add your employee data
   - Follow validation rules
5. Save the file
6. Click **"Import Employee Details"**
7. Select your filled Excel file
8. Wait for success message
9. Employees appear in the list

### Managing Employees

- **👁️ View**: Click eye icon to view details (read-only)
- **✏️ Edit**: Click edit icon, modify fields, click Update
- **🗑️ Delete**: Click delete icon, confirm deletion
- **🔍 Search**: Type in search box (searches all fields)
- **⬆️⬇️ Sort**: Click column headers to sort
- **📄 Pagination**: Use page controls at bottom

### Exporting Data

1. Click **"Download Employee Data"** button
2. File downloads as `employees.xlsx`
3. Open in Excel or Google Sheets

## 🐛 Troubleshooting

### Common Issues

#### Frontend can't connect to Backend
```bash
# Check REACT_APP_API_URL in client/.env
REACT_APP_API_URL="http://localhost:3001"

# Restart the client after changing .env
cd client
npm start
```

#### Database Connection Failed
```bash
# Check if MySQL is running
sudo systemctl status mysql
sudo systemctl start mysql

# Test database connection
cd server
npm run check-db

# Verify credentials in server/.env
```

#### Email Notifications Not Working
- Email notifications are **optional**
- Server will start with email disabled
- See `EMAIL_SETUP.md` for configuration
- Common error: Invalid Google App Password

#### Bulk Import Fails
1. Use the official template (don't modify headers)
2. Check all required fields are filled
3. Verify email format (.com, .io, .in)
4. Ensure emails are unique
5. Check validation rules (age 18+, days 1-31, etc.)

#### Port Already in Use
```bash
# Backend port 3001
sudo lsof -i :3001
kill -9 <PID>

# Frontend port 3000
sudo lsof -i :3000
kill -9 <PID>
```

### Getting Help

1. Check the `QUICK_FIX.md` file
2. Review `DATABASE_SETUP.md` for database issues
3. Read `BULK_UPLOAD_GUIDE.md` for import problems
4. Check server console for error messages
5. Use the `/health` endpoint to check system status

## 📚 Additional Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Fast setup guide
- **[BULK_UPLOAD_GUIDE.md](./BULK_UPLOAD_GUIDE.md)** - Detailed bulk import instructions
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Database configuration guide
- **[EMAIL_SETUP.md](./EMAIL_SETUP.md)** - Email notification setup
- **[QUICK_FIX.md](./QUICK_FIX.md)** - Common problems and solutions

## 🧪 Testing

### Manual Testing Checklist

- [ ] Add single employee
- [ ] Edit employee details
- [ ] Delete employee
- [ ] Search employees
- [ ] Sort by different columns
- [ ] Change page size
- [ ] Navigate between pages
- [ ] Download template
- [ ] Upload valid Excel file
- [ ] Upload invalid Excel file (test validation)
- [ ] Export employee data
- [ ] Check email notifications (if enabled)

### API Testing

Use the health check endpoint:
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "error": null
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔒 Security Considerations

### Production Checklist

- [ ] Use strong database passwords
- [ ] Enable HTTPS for API endpoints
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted origins
- [ ] Implement rate limiting
- [ ] Add authentication/authorization
- [ ] Validate and sanitize all inputs
- [ ] Use SSL for database connections (TiDB)
- [ ] Keep dependencies updated
- [ ] Review and rotate API keys regularly

### Environment Variables Security

- Never commit `.env` files to git
- Use different credentials for dev/prod
- Rotate passwords periodically
- Use secrets management in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **Development Team** - Initial work

## 🙏 Acknowledgments

- Ant Design for the UI components
- ExcelJS for Excel file handling
- TiDB Cloud for database hosting
- Render for backend hosting
- Vercel for frontend hosting

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Made with ❤️ using React, Express.js, and MySQL**
