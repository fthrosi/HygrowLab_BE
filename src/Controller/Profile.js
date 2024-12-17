import db from '../Database/setup.js';

export async function getName(user_id) {
  try {
    const sql = `SELECT * FROM users WHERE id = ?`;
    const [result] = await db.query(sql, [user_id]);
    return result;
  } catch (err) {
    throw new Error('Internal Server Error');
  }
}
export async function getUpdate(full_name, birthday, city, email, id) {
  try {
    const sql = `UPDATE users SET full_name = ? , birthday = ? , city = ? , email = ?  WHERE id = ?`;
    const [result] = await db.query(sql, [
      full_name,
      birthday,
      city,
      email,
      id,
    ]);
    return result;
  } catch (err) {
    throw new Error('Internal Server Error');
  }
}
export async function getJumlah(id) {
  try {
    const sql = `SELECT COUNT(*) AS jumlah FROM plants WHERE user_id= ?;`;
    const [result] = await db.query(sql, [id]);
    return result;
  } catch (err) {
    throw new Error('Internal Server Error');
  }
}
export async function getPlants(id) {
  try {
    const sql = `SELECT COUNT(*) AS jumlah FROM plants WHERE user_id= ?;`;
    const [result] = await db.query(sql, [id]);
    return result;
  } catch (err) {
    throw new Error('Internal Server Error');
  }
}
export async function getFoto(id, foto) {
  try {
    const sql = `UPDATE users SET foto = ?   WHERE id = ?`;
    const [result] = await db.query(sql, [foto, id]);
    return result;
  } catch (err) {
    throw new Error('Internal Server Error');
  }
}
export async function getUpdatePass(hashedNewPass, id) {
  try {
    const sql = `UPDATE users SET password = ?   WHERE id = ?`;
    const [result] = await db.query(sql, [hashedNewPass, id]);
    return result;
  } catch (err) {
    throw new Error('Internal Server Error');
  }
}
export async function getRecord(id) {
  try {
    const sql = `SELECT plants.name AS plant_name, listplants.name AS listplant_name, recordings.created_at, plants.plant_list_id FROM recordings INNER JOIN plants ON plants.user_id = recordings.id_user AND plants.id = recordings.id_plant INNER JOIN listplants ON listplants.id = plants.plant_list_id  WHERE recordings.id_user = ?;`;
    const [result] = await db.query(sql, [id]);
    return result;
  } catch (err) {
    throw new Error('Internal Server Error');
  }
}
export async function getChart(id) {
  try {
    const sql = `SELECT listplants.name, COUNT(*) AS jumlah,listplants.id FROM plants INNER JOIN listplants ON listplants.id = plants.plant_list_id WHERE plants.user_id = ? GROUP BY listplants.name;`;
    const [result] = await db.query(sql, [id]);
    return result;
  } catch (err) {
    throw new Error('Internal Server Error');
  }
}
