import db from "../Database/setup.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export async function getUser(user_id) {
  try {
    const sql = `SELECT * FROM users WHERE id = ?`;
    const [result] = await db.query(sql, [user_id]);
    const { full_name, email, foto, city, birthday } = result[0];
    const tanggal = birthday ? 
      new Date(birthday.getTime() - birthday.getTimezoneOffset() * 60000)
        .toISOString().split('T')[0] 
      : null;
    const newFoto = foto ? foto.replace(/\\/g, '/') : null
    return {
      full_name,
      email,
      newFoto,
      city,
      tanggal,
    };
  } catch (err) {
    throw new Error(err);
  }
}
export async function getUpdate(full_name, birthday, city, email, id) {
  try {
    const tanggal = new Date(birthday);
    console.log(tanggal);
    const sql = `UPDATE users SET full_name = ? , birthday = ? , city = ? , email = ?  WHERE id = ?`;
    const [result] = await db.query(sql, [full_name, tanggal, city, email, id]);
    return result;
  } catch (err) {
    throw new Error("Internal Server Error");
  }
}
export async function getJumlah(id) {
  try {
    const sql = `SELECT COUNT(*) AS jumlah FROM plants WHERE user_id= ?;`;
    const [result] = await db.query(sql, [id]);
    return result;
  } catch (err) {
    throw new Error("Internal Server Error");
  }
}
export async function getPlants(id) {
  try {
    const sql = `SELECT COUNT(*) AS jumlah FROM plants WHERE user_id= ?;`;
    const [result] = await db.query(sql, [id]);
    return result;
  } catch (err) {
    throw new Error("Internal Server Error");
  }
}
export async function updateFoto(id,foto) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const checkSql = `SELECT foto FROM users WHERE id = ?`;
    const [rows] = await db.query(checkSql, [id]);

    if (rows.length === 0) {
      throw { message: "users Tidak Ditemukan", statusCode: 404 };
    }
    const oldFoto = rows[0].foto;
    const sql = `UPDATE users Set foto = ? where id = ?`;
    const [result] = await db.query(sql, [foto, id]);
    if (oldFoto) {
      const normalizedPath = oldFoto.replace(/\\/g, "/");
      const oldFilePath = path.resolve(__dirname, "..", "..", normalizedPath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }
    return {
      data: {
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
export async function getUpdatePass(password,newPassword, id) {
  try {
    const user = `SELECT * FROM users where id = ?`;
    const [userCheck] = await db.query(user,[id])
    if(userCheck.length === 0 ){
      throw { message: 'User Tidak Ditemukan', statusCode: 404 };
    }
    console.log(password,userCheck[0].password,newPassword)
    const isPasswordMatch = await bcrypt.compare(password, userCheck[0].password);
    if(!isPasswordMatch){
      throw { message: 'Password Lama Salah', statusCode: 400 };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql = `UPDATE users SET password = ?   WHERE id = ?`;
    const [result] = await db.query(sql, [hashedPassword, id]);
    return result;
  } catch (err) {
    console.log(err)
    throw { message: err.message || 'Internal Server Error', statusCode: err.statusCode || 500 };
  }
}
