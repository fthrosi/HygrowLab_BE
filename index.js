import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './src/Database/setup.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND passwordd = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    res.json({ message: 'Login berhasil', userId: results[0].id });
  });
});

app.post('/api/register', (req, res) => {
  const { email, nama, password } = req.body; // Ambil data dari request body

  // Query untuk memasukkan data ke database
  const sql = 'INSERT INTO users ( email,nama, passwordd) VALUES (?, ?, ?)';
  db.query(sql, [email, nama, password], (err, result) => {
    if (err) {
      console.error('Error saat menyimpan data:', err.message);
      res.status(500).json({ error: 'Gagal menyimpan data' });
    } else {
      res.status(200).json({ message: 'Data berhasil disimpan' });
    }
  });
  console.error('Data diterima:', req.body);
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
