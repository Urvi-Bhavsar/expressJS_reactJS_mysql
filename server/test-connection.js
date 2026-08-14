require('dotenv').config();
const mysql = require('mysql2');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'employee_management'
};

console.log('Testing connection with config:');
console.log('Host:', config.host);
console.log('Port:', config.port);
console.log('User:', config.user);
console.log('Database:', config.database);
console.log('');

const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
    console.error('❌ Connection failed:');
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Successfully connected to MySQL!');
  
  connection.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      console.error('❌ Query failed:', err);
      process.exit(1);
    }
    console.log('✅ Query successful:', results);
    connection.end();
  });
});
