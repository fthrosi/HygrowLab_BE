import db from "../Database/setup.js";

export async function getJenisTanaman() {
  try {
    const sql = `SELECT * FROM listplants`;
    const [result] = await db.query(sql);
    return result;
  } catch (err) {
    throw new Error("Internal Server Error");
  }
}

export async function getTanaman(user_id) {
  try {
    const sql = `SELECT 
                p.id AS plant_id,
                p.name AS plant_name, 
                pl.name AS plant_list_name, 
                p.tanggal_tanam As tanggal_tanam, 
                p.tanggal_panen As tanggal_panen
            FROM 
                plants p
            INNER JOIN 
                listplants pl 
            ON 
                p.plant_list_id = pl.id
            WHERE 
                p.user_id = ?;`;
    const [result] = await db.query(sql, [user_id]);
    const formattedResult = result.map(item => ({
        ...item,
        tanggal_tanam: item.tanggal_tanam ? new Date(item.tanggal_tanam).toISOString().split('T')[0] : null,
        tanggal_panen: item.tanggal_panen ? new Date(item.tanggal_panen).toISOString().split('T')[0] : null
      }));
    return formattedResult;
  } catch (err) {
    throw new Error("Internal Server Error");
  }
}
export async function addTanaman(
  user_id,
  nama_tanaman,
  jenis_tanaman,
  tanggal_tanam
) {
  try {
    const sqlCheck = `SELECT * FROM listplants where id = ?`;
    const [resultCheck] = await db.query(sqlCheck, [jenis_tanaman]);
    if (resultCheck.length === 0) {
      throw { message: 'Jenis Tanaman Tidak Ditemukan', statusCode: 404 };
    }
    const sqlName = `SELECT * FROM plants where name = ?`;
    const [resultName] = await db.query(sqlName, [nama_tanaman]);
    if (resultName.length !== 0) {
      throw { message: 'Nama Tanaman Sudah Ada', statusCode: 400 };
    }
    const lamaPanen = resultCheck[0].harvest_time * 7;
    const tanggal_panen = new Date(tanggal_tanam);
    tanggal_panen.setDate(tanggal_panen.getDate() + lamaPanen);

    const tanggalPanenStr = tanggal_panen.toISOString().split("T")[0];
    const sql = `INSERT INTO plants (user_id, plant_list_id,name,tanggal_tanam,tanggal_panen) VALUES (?, ?, ?,?,?)`;
    const [result] = await db.query(sql, [
      user_id,
      resultCheck[0].id,
      nama_tanaman,
      tanggal_tanam,
      tanggalPanenStr,
    ]);
    return result;
  } catch (err) {
    throw { message: err.message || 'Internal Server Error', statusCode: err.statusCode || 500 };
  }
}
export async function updateTanaman(id, name) {
  try {
    const sql = `UPDATE plants Set name = ? where id = ?`;
    const [result] = await db.query(sql, [name, id]);
    return result;
  } catch (err) {
    throw new Error("Internal Server Error");
  }
}
export async function deleteTanaman(id) {
  try {
    const sql = `DELETE FROM plants where id = ?`;
    const [result] = await db.query(sql, [id]);
    return result;
  } catch (err) {
    throw new Error("Internal Server Error");
  }
}
