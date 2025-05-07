const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const db = new Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST, // Add your host if different
  database: process.env.DATABASE, // Replace with your database name
  password: process.env.DB_PASSWORD, // Replace with your database password
  port: process.env.DB_PORT, // Default PostgreSQL port
});

module.exports = db