import db from '../Database/setup.js';

export async function getKalkulasi(id_tanaman) {
    try {
        const sql = `SELECT * FROM kalkulasi Where id_plant = ?`;
        const [result] = await db.query(sql, [id_tanaman]);
        return result;
    } catch (err) {
        throw new Error('Internal Server Error');
    }
}
export async function addKalkulasi(id_tanaman,id_record, nut_a, nut_b) {
    try {
        const sql = `INSERT INTO kalkulasi (id_plant,id_record, nutrient_a, nutrient_b) VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(sql, [id_tanaman, id_record, nut_a, nut_b]);
        return result;
    } catch (err) {
        throw new Error('Internal Server Error');
    }
}
export async function kalkulasi(id_tanaman, usia,volume_air){
    try{
        const sql = `SELECT * FROM plants where id = ?`;
        const [result] = await db.query(sql,[id_tanaman]);
        if(result.length === 0){
            throw new Error('Tanaman Tidak Ditemukan');
        }
        const sqlData = `SELECT * FROM listplants where id = ?`;
        const [resultData] = await db.query(sqlData,[result[0].plant_list_id]);
        if(resultData.length === 0){
            throw new Error('Jenis Tanaman Tidak Ditem')
        }
        const data = 'SELECT nitrogen as N, phosporus as P, pottasium as K FROM nutrient_plants where id_plant = ?';
        const [resultNutrient] = await db.query(data,[resultData[0].id,usia]);
        console.log(resultNutrient);
        const Nitrogen = resultNutrient[0].N;
        const Phosphor = resultNutrient[0].P;
        const Potassium = resultNutrient[0].K;
        const jml_N = (Nitrogen *volume_air)/0.2;
        const jml_P = (Phosphor *volume_air)/0.1;
        const jml_K = (Potassium *volume_air)/0.25;
        const Nut_A = jml_N;
        let Nut_B=0
        if(jml_P<= jml_K){
            Nut_B = jml_K;
        }else{
            Nut_B = jml_P;
        }
        return{
            Nut_A,Nut_B
        }
    }
    catch(err){
        console.error(err);
        throw new Error('Internal Server Error');
    }
}