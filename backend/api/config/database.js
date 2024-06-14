const mysql = require("mysql2");

let conn = {};

conn = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  multipleStatements: true,
  dateStrings: "date",
});

module.exports = conn;
