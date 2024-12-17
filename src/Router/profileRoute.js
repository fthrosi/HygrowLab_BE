import express from 'express';
import {
  getName,
  getUpdate,
  getFoto,
  getUpdatePass,
  getJumlah,
  getPlants,
  getRecord,
  getChart,
} from '../Controller/Profile.js';

import bcrypt from 'bcrypt';
import upload from '../middleware/multer.js';

const router = express.Router();

router.get('/user/:id', async (req, res) => {
  const user_id = req.params.id;
  try {
    const result = await getName(user_id);

    res
      .status(200)
      .json({ message: 'Data Nama berhasil didapatkan', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/plants/:id', async (req, res) => {
  const user_id = req.params.id;
  try {
    const result = await getJumlah(user_id);

    res
      .status(200)
      .json({ message: 'jumlah tanaman berhasil didapatkan', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/jenis/:id', async (req, res) => {
  const user_id = req.params.id;
  try {
    const result = await getPlants(user_id);

    res.status(200).json({
      message: 'jumlah jenis tanaman berhasil didapatkan',
      data: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch('/user/:id', async (req, res) => {
  const id = req.params.id;
  const { full_name, birthday, city, email } = req.body;
  try {
    const result = await getUpdate(full_name, birthday, city, email, id);

    res.status(200).json({ message: 'Data berhasil di update', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/upload/:id', upload.single('file'), async (req, res) => {
  const id = req.params.id;
  const file = req.file;

  if (!file) {
    return res.status(400).send('Tidak ada file yang diunggah');
  }

  // Simpan informasi file ke database jika perlu
  const foto = `${file.filename}`;
  try {
    const result = await getFoto(id, foto);

    res.status(200).json({ message: 'Foto berhasil di update', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch('/updatepass/:id', async (req, res) => {
  const user_id = req.params.id;
  const { oldPass1, oldPass2, newPass } = req.body;

  try {
    const isMatch = await bcrypt.compare(oldPass2, oldPass1);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password Lama salah!' });
    }
    const hashedNewPass = await bcrypt.hash(newPass, 10);
    const result = await getUpdatePass(hashedNewPass, user_id);

    res
      .status(200)
      .json({ message: 'Password Berhasil Di ubah', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/record/:id', async (req, res) => {
  const user_id = req.params.id;
  try {
    const result = await getRecord(user_id);

    res.status(200).json({
      message: 'jumlah jenis tanaman berhasil didapatkan',
      data: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/chart/:id', async (req, res) => {
  const user_id = req.params.id;
  try {
    const result = await getChart(user_id);

    res.status(200).json({
      message: 'jumlah jenis tanaman berhasil didapatkan',
      data: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
