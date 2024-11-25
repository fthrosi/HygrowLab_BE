import express from 'express';
import { addKalkulasi, kalkulasi } from '../Controller/Kalkulasi.js';
import { createPencatatan } from '../Controller/Pencatatan.js';
const router = express.Router();
router.post('/', async (req, res) => {
    try {
        const { tanaman_id, age,volume_air } = req.body;
        const result = await kalkulasi(tanaman_id, age,volume_air);
        res.status(200).json({
            message: 'Kalkulasi berhasil!',
            data: result,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/', async (req, res) => {
    id_user = req.user.id;
    try{
        const {tanaman_id, age,volume_air,nut_a,nut_b} = req.body;
        const result = await createPencatatan(id_user, tanaman_id, age,volume_air);
        if(result){
            const data = await addKalkulasi(tanaman_id, result.insertId,nut_a,nut_b);
            res.status(201).json({ message: 'Pencatatan berhasil ditambahkan', data: data });
        }
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})
export default router;