import db from '../Database/setup.js';

export async function createPencatatan(user_id, tanaman_id, age,volume_air){
    try{
        const sql = `INSERT INTO recordings (id_user, id_plant, age,volume_air ) VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(sql, [user_id, tanaman_id, age, volume_air]);
        return result;
    }catch(err){
        console.error(err);
        throw new Error('Internal Server Error');
    }
}
export async function getRecordings(user_id, tanaman_id){
    try{
        const sql = `SELECT * FROM recordings WHERE id_user = ? AND id_plant = ?`;
        const [result] = await db.query(sql, [user_id,tanaman_id]);
        return result;
    }catch(err){
        console.error(err);
        throw new Error('Internal Server Error');
    }
}
export async function updateCatatan(age,note,foto,id,tinggi_tanaman){
    try{
        const sql = `UPDATE recordings Set age = ?, note = ?,foto = ?,tinggi_tanaman = ? where id = ?`;
        const [result] = await db.query(sql,[age,note,foto,tinggi_tanaman,id]);
        console.log(result);
        return result;
    }catch(err){
        throw new Error('Internal Server Error');
    }
}
export async function deleteCatatan(id){
    try{
        const sql = `DELETE FROM recordings where id = ?`;
        const [result] = await db.query(sql,[id]);
        return result;
    }catch(err){
        throw new Error('Internal Server Error');
    }
}