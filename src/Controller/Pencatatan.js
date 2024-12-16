import db from "../Database/setup.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export async function createPencatatan(user_id, tanaman_id, age, volume_air) {
  try {
    const sql = `INSERT INTO recordings (id_user, id_plant, age,volume_air ) VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(sql, [
      user_id,
      tanaman_id,
      age,
      volume_air,
    ]);
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Internal Server Error");
  }
}
export async function getRecordings(user_id, tanaman_id) {
  try {
    const sql = `SELECT 
      p.name AS nama, 
      p.tanggal_tanam AS tanggal, 
      lp.harvest_time AS harvest,
      r.id AS id, 
      r.age AS usia, 
      r.volume_air AS volume,
      r.tinggi_tanaman AS tinggi, 
      r.note AS note, 
      r.foto AS foto, 
      k.nutrient_a,
      k.nutrient_b 
    FROM plants p 
    LEFT JOIN recordings r ON p.id = r.id_plant 
    LEFT JOIN listplants lp ON p.plant_list_id = lp.id 
    LEFT JOIN nutrision_calculation k ON r.id = k.id_record 
    WHERE p.user_id = ? AND p.id = ?`;
    
    const [result] = await db.query(sql, [user_id, tanaman_id]);
    
    if (result.length === 0) {
      throw new Error("Tanaman tidak ditemukan");
    }
    
    const { nama, harvest, tanggal } = result[0];
    const tanggalTanam = tanggal ? new Date(tanggal).toISOString().split("T")[0] : null;
    
    const data = result
      .filter(item => item.id !== null)
      .map((item) => ({
        id: item.id,
        foto: item.foto ? `/${item.foto.replace(/\\/g, '/')}` : null,
        note: item.note,
        nutrient_a: item.nutrient_a,
        nutrient_b: item.nutrient_b,
        usia: item.usia,
        volume: item.volume,
        tinggi: item.tinggi,
      }));
    return {
      nama,
      harvest,
      tanggalTanam,
      data, 
    };
  } catch (err) {
    throw new Error("Internal Server Error");
  } 
}
export async function updateCatatan(note, id, tinggi_tanaman) {
  try {
    const sql = `UPDATE recordings Set  note = ?,tinggi_tanaman = ? where id = ?`;
    const [result] = await db.query(sql, [note, tinggi_tanaman, id]);
    console.log(result);
    return {
      data: {
        id,
        note,
        tinggi_tanaman,
      },
    };
  } catch (err) {
    throw new Error("Internal Server Error");
  }
}
export async function updateFoto(foto, id) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const checkSql = `SELECT foto FROM recordings WHERE id = ?`;
    const [rows] = await db.query(checkSql, [id]);

    if (rows.length === 0) {
      throw { message: "Data Tidak Ditemukan", statusCode: 404 };
    }
    const oldFoto = rows[0].foto;
    const sql = `UPDATE recordings Set foto = ? where id = ?`;
    const [result] = await db.query(sql, [foto, id]);
    if (oldFoto) {
      const normalizedPath = oldFoto.replace(/\\/g, "/");
      const oldFilePath = path.resolve(__dirname, "..", "..", normalizedPath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log(`File lama "${oldFoto}" berhasil dihapus.`);
      }
    }
    return {
      data: {
        id,
        foto: foto ? `/${foto.replace(/\\/g, '/')}` : null,
      },
    };
  } catch (err) {
    throw {
      message: err.message || "Internal Server Error",
      statusCode: err.statusCode || 500,
    };
  }
}
export async function deleteCatatan(id) {
  try {
    const sql = `DELETE FROM recordings where id = ?`;
    const [result] = await db.query(sql, [id]);
    return result;
  } catch (err) {
    throw new Error("Internal Server Error");
  }
}
