import db from '../Database/setup.js';

export async function getTanaman(user_id) {
    try {
        const sql = `SELECT * FROM tanaman Where user_id = ?`;
        const [result] = await db.query(sql, [user_id]);
        return result;
    } catch (err) {
        throw new Error('Internal Server Error');
    }
}
export async function addTanaman(user_id, nama_tanaman, jenis_tanaman) {
    try {
        const sqlCheck = `SELECT * FROM listPlants where name = ?`;
        const [resultCheck] = await db.query(sqlCheck, [jenis_tanaman]);
        if (resultCheck.length === 0) {
            throw new Error('Jenis Tanaman Tidak Ada');
        }
        const sqlName = `SELECT * FROM plants where name = ?`;
        const [resultName] = await db.query(sqlName, [nama_tanaman]);
        if (resultName.length !== 0) {
            throw new Error('Nama Tanaman Sudah Ada');
        }
        const sql = `INSERT INTO plants (user_id, plant_list_id,name) VALUES (?, ?, ?)`;
        const [result] = await db.query(sql, [user_id, resultCheck[0].id ,nama_tanaman]);
        return result;
    }
    catch (err) {
        throw new Error('Internal Server Error');
    }
}
export async function updateTanaman(id,name){
    try{
        const sql = `UPDATE plants Set name = ? where id = ?`;
        const [result] = await db.query(sql,[name,id]);
        return result;
    }catch(err){
        throw new Error('Internal Server Error');
    }
}
export async function deleteTanaman(id){
    try{
        const sql = `DELETE FROM plants where id = ?`;
        const [result] = await db.query(sql,[id]);
        return result;
    }catch(err){
        throw new Error('Internal Server Error');
    }
}