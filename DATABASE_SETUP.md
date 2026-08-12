# Database Setup Guide

## Overview
This application uses MySQL as its database. The backend is now configured to handle database connection failures gracefully without crashing.

## Current Status
- ✅ Server will start even if database is not connected
- ✅ Helpful error messages displayed in console
- ✅ API endpoints return user-friendly errors when database is unavailable
- ✅ Health check endpoint to monitor database status

## Setting Up MySQL Database

### Option 1: Using DBeaver (Recommended for Beginners)

1. **Install MySQL Server** (if not already installed)
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install mysql-server
   
   # Start MySQL service
   sudo systemctl start mysql
   sudo systemctl enable mysql
   ```

2. **Secure MySQL Installation**
   ```bash
   sudo mysql_secure_installation
   ```
   - Set root password (use 'root' to match current config, or update .env)
   - Remove anonymous users: Yes
   - Disallow root login remotely: No (for local development)
   - Remove test database: Yes
   - Reload privilege tables: Yes

3. **Create Database**
   ```bash
   # Login to MySQL
   sudo mysql -u root -p
   
   # Create database
   CREATE DATABASE my_db;
   
   # Create user (optional, for better security)
   CREATE USER 'myapp_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON my_db.* TO 'myapp_user'@'localhost';
   FLUSH PRIVILEGES;
   
   # Exit
   EXIT;
   ```

4. **Configure DBeaver Connection**
   - Open DBeaver
   - Click "New Database Connection"
   - Select MySQL
   - Enter connection details:
     - Host: localhost
     - Port: 3306
     - Database: my_db
     - Username: root (or myapp_user if you created one)
     - Password: root (or your password)
   - Test Connection
   - Click Finish

### Option 2: Using Command Line

1. **Check if MySQL is running**
   ```bash
   sudo systemctl status mysql
   ```

2. **If not running, start it**
   ```bash
   sudo systemctl start mysql
   ```

3. **Create the database**
   ```bash
   mysql -u root -p
   CREATE DATABASE my_db;
   EXIT;
   ```

## Configuration

### Environment Variables
Update the `.env` file in the `server` directory:

```env
# Database Configuration
DB_HOST = localhost
DB_USER = root
DB_PASSWORD = root
DB_NAME = my_db
```

### Custom Configuration
If you want to use different credentials:
1. Update the values in `.env`
2. Make sure the user has proper permissions
3. Restart the server

## Testing the Connection

### Method 1: Health Check Endpoint
Once the server is running, visit:
```
http://localhost:3001/health
```

This will show:
- ✅ Database connection status
- ✅ Any error messages if connection fails
- ✅ Timestamp of the check

### Method 2: Server Console
When you start the server, you'll see:
- ✅ `Connected to MySQL database successfully.` (if connected)
- ❌ Error details and troubleshooting steps (if not connected)

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
**Solution:**
```bash
# Reset root password
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
FLUSH PRIVILEGES;
EXIT;
```

### Error: "Can't connect to local MySQL server"
**Solution:**
```bash
# Check if MySQL is running
sudo systemctl status mysql

# If not running, start it
sudo systemctl start mysql

# Enable auto-start on boot
sudo systemctl enable mysql
```

### Error: "Unknown database 'my_db'"
**Solution:**
```bash
# Create the database
mysql -u root -p
CREATE DATABASE my_db;
EXIT;
```

### Error: "Authentication plugin 'caching_sha2_password' cannot be loaded"
**Solution:**
```bash
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
FLUSH PRIVILEGES;
EXIT;
```

## Application Behavior Without Database

### What Works:
- ✅ Server starts successfully
- ✅ Health check endpoint works
- ✅ API endpoints return proper error messages

### What Doesn't Work:
- ❌ Creating employees
- ❌ Fetching employee list
- ❌ Updating/deleting employees
- ❌ Uploading/downloading employee data

### Error Response Format:
```json
{
  "success": false,
  "message": "Database connection is not available",
  "error": {
    "code": "DB_NOT_CONNECTED",
    "details": "MySQL database is not connected. Please check server logs for more information.",
    "suggestions": [
      "Ensure MySQL server is running",
      "Verify database credentials in .env file",
      "Check if the database exists",
      "Verify MySQL service is accessible on the configured host and port"
    ]
  }
}
```

## Quick Start Checklist

- [ ] MySQL server installed
- [ ] MySQL service running (`sudo systemctl status mysql`)
- [ ] Database created (`CREATE DATABASE my_db;`)
- [ ] User credentials configured in `.env`
- [ ] DBeaver connected (optional)
- [ ] Server started (`npm start` in server directory)
- [ ] Health check passed (`http://localhost:3001/health`)
- [ ] Table auto-created on first API call

## Additional Notes

- The application automatically creates the `employeeDetails` table on the first API call
- You can use DBeaver to view and manage the data visually
- Connection uses a pool for better performance
- Failed queries won't crash the server

## Need Help?

Check the server console for detailed error messages and suggestions when database connection fails.
