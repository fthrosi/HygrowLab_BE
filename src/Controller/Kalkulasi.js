import db from '../Database/setup.js';

export async function getKalkulasi(id_tanaman) {
    try {
        const sql = `SELECT * FROM kalkulasi Where id_plant = ?`;
        const [result] = await db.query(sql, [id_tanaman]);
        return result;
    } catch (err) {
        throw new Error('Gagal Manampilkan Data');
    }
}
export async function addKalkulasi(id_tanaman,id_record, nut_a, nut_b) {
    try {
        const sql = `INSERT INTO nutrision_calculation (id_plant,id_record, nutrient_a, nutrient_b) VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(sql, [id_tanaman, id_record, nut_a, nut_b]);
        return result;
    } catch (err) {
        throw new Error('Gagal menambahkan Data');
    }
}
export async function kalkulasi(id_tanaman, volume_air, usia) {
    try {

        const sql = `SELECT * FROM plants WHERE id = ?`;
        const [result] = await db.query(sql, [id_tanaman]);
        if (result.length === 0) {
            throw { message: 'Tanaman Tidak Ditemukan', statusCode: 404 };
        }

        const sqlData = `SELECT * FROM listplants WHERE id = ?`;
        const [resultData] = await db.query(sqlData, [result[0].plant_list_id]);
        if (resultData.length === 0) {
            throw { message: 'Jenis Tanaman Tidak Ditemukan', statusCode: 404 };
        }
        const cekData = `SELECT * FROM recordings where id_plant = ? AND age = ?`
        const [hasilCek] = await db.query(cekData,[id_tanaman,usia])
        if (hasilCek.length != 0){
            throw { message: 'Sudah ada Nutrisi di usia ini', statusCode: 400 };
        }
        const data = `SELECT nitrogen as N, phosporus as P, pottasium as K, week 
                      FROM nutrient_plants 
                      WHERE id_plant = ? AND week = ?`;
        const [resultNutrient] = await db.query(data, [resultData[0].id, usia]);
        if (resultNutrient.length === 0) {
            throw { message: 'Tanaman Harusnya Sudah Dipanen', statusCode: 400 };
        }

        const Nitrogen = resultNutrient[0].N;
        const Phosphor = resultNutrient[0].P;
        const Potassium = resultNutrient[0].K;
        const jml_N = (Nitrogen * volume_air) / 0.2;
        const jml_P = (Phosphor * volume_air) / 0.1;
        const jml_K = (Potassium * volume_air) / 0.25;

        const Nut_A = jml_N;
        const Nut_B = jml_P <= jml_K ? jml_K : jml_P;

        return { Nut_A, Nut_B };
    } catch (err) {
        throw { message: err.message || 'Internal Server Error', statusCode: err.statusCode || 500 };
    }
}
