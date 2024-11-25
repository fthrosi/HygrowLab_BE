import express from 'express';
import upload from "../middleware/multer.js";
import { createPencatatan,getRecordings,updateCatatan,deleteCatatan } from "../Controller/Pencatatan.js";
import { authenticateToken } from "../middleware/Auth.js";

const router = express.Router();
router.post('/',authenticateToken, async (req, res) => {
    try {
      const user_id = req.user.id;
      const {tanaman_id, age,volume_air } = req.body;
  
      const result = await createPencatatan(user_id, tanaman_id, age,volume_air);
  
      res.status(201).json({
        message: 'Pencatatan berhasil ditambahkan!',
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get('/:id',authenticateToken, async (req, res) => {
    try {
      const user_id = req.user.id;
      const tanaman_id = req.params.id;
      const result = await getRecordings(user_id, tanaman_id);
  
      res.status(200).json({
        message: 'Data pencatatan berhasil didapatkan!',
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.put('/:id',authenticateToken, upload.single('foto'), async (req, res) => {
    try {
      const { age, note,tinggi_tanaman } = req.body;
      const foto = req.file ? req.file.path : null;
      const id = req.params.id;
      console.log(id);
  
      const result = await updateCatatan(age, onte, foto,id,tinggi_tanaman);
  
      res.status(200).json({
        message: 'Data pencatatan berhasil diupdate!',
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.delete('/:id',authenticateToken, async (req, res) => {
    try {
      const id = req.params.id;
  
      const result = await deleteCatatan(id);
  
      res.status(200).json({
        message: 'Data pencatatan berhasil dihapus!',
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
export default router;
