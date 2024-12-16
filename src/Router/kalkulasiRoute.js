import express from 'express';
import { addKalkulasi, kalkulasi } from '../Controller/Kalkulasi.js';
import { createPencatatan } from '../Controller/Pencatatan.js';
import { authenticateToken } from '../middleware/Auth.js';
const router = express.Router();
router.post('/',authenticateToken, async (req, res) => {
    try {
        const { nama, volume,usia } = req.body;
        const result = await kalkulasi(nama, volume,usia);
        res.status(200).json({
            message: 'Kalkulasi berhasil!',
            data: result,
        });
    } catch (err) {
        console.error(err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ error: err.message || 'Internal Server Error' });
    }
});
router.post('/add',authenticateToken, async (req, res) => {
    const id_user = req.user.id;
    try{
        const {tanaman_id, age,volume,nut_a,nut_b} = req.body;
        const result = await createPencatatan(id_user, tanaman_id, age,volume);
        if(result){
            const data = await addKalkulasi(tanaman_id, result.insertId,nut_a,nut_b);
            res.status(201).json({ message: 'Pencatatan berhasil ditambahkan', data: data });
        }
    }catch(err){
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ error: err.message || 'Internal Server Error' });
    }
})
export default router;