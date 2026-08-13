# Employee Management System - Backend

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Check Database Connection
Before starting the server, verify your database is set up correctly:
```bash
npm run check-db
```

This will:
- ✅ Test connection to MySQL server
- ✅ Verify database exists
- ✅ Check if tables are ready
- ✅ Show helpful error messages if something is wrong

### 3. Start the Server
```bash
npm start
```

The server will start even if the database is not connected, but all database operations will fail with helpful error messages.

## Database Setup

### Quick Setup (Ubuntu/Debian)
```bash
# Install MySQL
sudo apt update
sudo apt install mysql-server

# Start MySQL
sudo systemctl start mysql

# Create database
sudo mysql -u root -p
CREATE DATABASE my_db;
EXIT;
```

For detailed setup instructions, see [DATABASE_SETUP.md](../DATABASE_SETUP.md)

## Environment Variables

Create or update `.env` file:
```env
# Server
PORT = 4000

# Database
DB_HOST = localhost
DB_USER = root
DB_PASSWORD = root
DB_NAME = my_db

# Email (for notifications)
EMAIL_USER = your-email@example.com
EMAIL_PASS = your-app-password
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server and database connection status.

### Employee Operations
- `POST /create` - Create new employee
- `GET /get-employee-details` - Get all employees (with pagination, search, sort)
- `PUT /update-employee-details/:id` - Update employee
- `DELETE /delete-employee-details/:id` - Delete employee
- `GET /download-employee-data` - Download employees as Excel
- `POST /upload-employee-details` - Upload employees from Excel

## Features

### ✅ Graceful Database Handling
- Server starts even without database connection
- Clear error messages when database is unavailable
- Automatic retry on connection restoration

### ✅ Error Handling
- Validation on all inputs
- Proper HTTP status codes
- User-friendly error messages

### ✅ Connection Pooling
- Efficient database connections
- Better performance under load
- Automatic connection management

## Troubleshooting

### Server starts but API calls fail
1. Check if MySQL is running:
   ```bash
   sudo systemctl status mysql
   ```

2. Run the database check:
   ```bash
   npm run check-db
   ```

3. Check health endpoint:
   ```
   http://localhost:4000/health
   ```

### Common Error Solutions

**"ECONNREFUSED"**
- MySQL is not running
- Solution: `sudo systemctl start mysql`

**"ER_ACCESS_DENIED_ERROR"**
- Wrong credentials
- Solution: Update `.env` or reset MySQL password

**"ER_BAD_DB_ERROR"**
- Database doesn't exist
- Solution: Create database with `CREATE DATABASE my_db;`

For more help, see [DATABASE_SETUP.md](../DATABASE_SETUP.md)

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── db.js              # Database connection with error handling
│   │   └── mailer.js          # Email configuration
│   ├── controllers/
│   │   └── employeeController.js
│   ├── models/
│   │   └── employeeModel.js
│   ├── routes/
│   │   └── employeeRoutes.js
│   ├── serializers/
│   │   └── employeeSerializer.js  # Validation
│   ├── middlewares/
│   │   └── cors.js
│   └── app.js                 # Main application
├── check-db.js                # Database checker script
├── .env                       # Environment variables
└── package.json
```

## Dependencies

- **express**: Web framework
- **mysql2**: MySQL client
- **joi**: Validation
- **multer**: File uploads
- **exceljs**: Excel file handling
- **nodemailer**: Email sending
- **dotenv**: Environment variables
- **cors**: Cross-origin resource sharing
- **nodemon**: Development auto-reload

## License

ISC
