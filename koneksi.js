const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Sesuaikan dengan username database Anda
  password: '', // Sesuaikan dengan password database Anda
  database: 'hygrowlab', // Nama database Anda
});

db.connect((err) => {
  if (err) {
    console.error('Koneksi ke database gagal:', err.message);
  } else {
    console.log('Terhubung ke database.');
  }
});

module.exports = db;
