import express from 'express';
import {
  getUser,
  getUpdate,
  updateFoto,
  getUpdatePass,
  getJumlah,
  getPlants,
  getRecord,
  getChart,
} from '../Controller/Profile.js';
import upload from '../middleware/multer.js';
import { authenticateToken } from '../middleware/Auth.js';

const router = express.Router();

router.get('/user', authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await getUser(user_id);
    res
      .status(200)
      .json({ message: 'Data Nama berhasil didapatkan', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/plants',authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await getJumlah(user_id);

    res
      .status(200)
      .json({ message: 'jumlah tanaman berhasil didapatkan', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/record',authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await getRecord(user_id);

    res
      .status(200)
      .json({ message: 'jumlah tanaman berhasil didapatkan', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  router.get('/chart',authenticateToken, async (req, res) => {
    const user_id = req.user.id;
    try {
      const result = await getChart(user_id);
  
      res
        .status(200)
        .json({ message: 'jumlah tanaman berhasil didapatkan', data: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
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
router.put('/user', authenticateToken, async (req, res) => {
  const id = req.user.id;
  const { full_name, tanggal, city, email } = req.body;
  try {
    const result = await getUpdate(full_name, tanggal, city, email, id);

    res.status(200).json({ message: 'Data berhasil di update', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(
  '/upload',
  authenticateToken,
  upload.single('foto'),
  async (req, res) => {
    const id = req.user.id;
    const foto = req.file ? req.file.path : null;
    try {
      const result = await updateFoto(id, foto);

      res
        .status(200)
        .json({ message: 'Foto berhasil di update', data: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);
router.put('/updatepass', authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  const { password, newPassword } = req.body;

  try {
    const result = await getUpdatePass(password, newPassword, user_id);
    res
      .status(200)
      .json({ message: 'Password Berhasil Di ubah', data: result });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res
      .status(statusCode)
      .json({ error: err.message || 'Internal Server Error' });
  }
});
export default router;
