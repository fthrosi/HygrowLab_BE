import express from 'express';
import {getTanaman,addTanaman,updateTanaman,deleteTanaman,getJenisTanaman} from '../Controller/Tanaman.js';
import { authenticateToken } from '../middleware/Auth.js';

const router = express.Router();

router.get('/tanaman',authenticateToken, async (req, res) => {
    const user_id = req.user.id;
    console.log(user_id);
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
        const statusCode = err.statusCode
        res.status(statusCode).json({ error: err.message });
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
router.get('/list',authenticateToken, async (req, res) => {
    try{
        const result = await getJenisTanaman();
        res.status(200).json({ message: 'Data list tanaman berhasil didapatkan', data: result });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});
export default router;