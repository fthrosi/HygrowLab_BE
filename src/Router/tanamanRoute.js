import express from 'express';
import {getTanaman,addTanaman,updateTanaman,deleteTanaman} from '../Controller/Tanaman.js';
import { authenticateToken } from '../middleware/Auth.js';

const router = express.Router();

router.get('/tanaman', async (req, res) => {
    const user_id = req.user.id;
    try{
        const result = await getTanaman(user_id);
        res.status(200).json({ message: 'Data tanaman berhasil didapatkan', data: result });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});
router.post('/tanaman',authenticateToken, async (req, res) => {
    const user_id = req.user.id;
    const {nama_tanaman, jenis_tanaman, tanggal_tanam} = req.body;
    console.log(req.body);
    try{
        const result = await addTanaman(user_id, nama_tanaman, jenis_tanaman,tanggal_tanam);
        res.status(201).json({ message: 'Tanaman berhasil ditambahkan', data: result });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});
router.put('/tanaman/:id',authenticateToken, async (req, res) => {
    const id = req.params.id;
    const {nama_tanaman} = req.body
    try{
        const result = await updateTanaman(id,nama_tanaman);
        res.status(200).json({ message: 'Tanaman berhasil diupdate', data: result });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});
router.delete('/tanaman/:id',authenticateToken, async (req, res) => {
    const id = req.params.id;
    try{
        const result = await deleteTanaman(id);
        res.status(200).json({ message: 'Tanaman berhasil dihapus', data: result });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});
export default router;