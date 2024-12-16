import express from 'express';
import upload from "../middleware/multer.js";
import { updateFoto,getRecordings,updateCatatan,deleteCatatan } from "../Controller/Pencatatan.js";
import { authenticateToken } from "../middleware/Auth.js";

const router = express.Router();
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

router.put('/edit/:id',authenticateToken, async (req, res) => {
    try {
      const { note,tinggi_Tanaman } = req.body;
      const id = req.params.id;
      console.log(note,id,tinggi_Tanaman)
      const result = await updateCatatan(note,id,tinggi_Tanaman);
  
      res.status(200).json({
        message: 'Data pencatatan berhasil diupdate!',
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error)
    }
  });
router.put('/foto/:id',authenticateToken, upload.single('foto'),async(req,res)=>{
  try {
    const foto = req.file ? req.file.path : null;
    const id = req.params.id;

    const result = await updateFoto(foto,id);
    res.status(200).json({
      message: 'Foto pencatatan berhasil diupdate!',
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
