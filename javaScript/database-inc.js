const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "typing_game_database",
  port: 3306 
});

con.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  
  console.log("Database connection successful.");
});

module.exports.con = con;
