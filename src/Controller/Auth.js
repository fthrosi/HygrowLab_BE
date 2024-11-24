import db from '../Database/setup.js'; 
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();


export async function registerUser(fullName, email, password, city, birthDate) {

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const sql = `INSERT INTO users (full_name, email, password, city, birthday) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [fullName, email, hashedPassword, city, birthDate]);
        return result;
    } catch (err) {
        throw new Error('Internal Server Error');
    }
  
}

export async function loginUser(email, password,res) {
    try {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const [result] = await db.query(sql, [email]);
        if (result.length === 0) {
            throw new Error('Email tidak terdaftar');
        }
        const user = result[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error('Password salah');
        }
        const accessToken = jwt.sign({id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({id: user.id }, process.env.REFRESH_TOKEN, { expiresIn: '1d' });
        const sqlRefreshToken = `UPDATE users SET refreshToken = ? WHERE id = ?`;
        await db.query(sqlRefreshToken, [refreshToken, user.id]);
        res.cookie('refreshToken', refreshToken, { 
           httpOnly: true,
           maxAge: 24 * 60 * 60 * 1000
        });
        return {
            accessToken,
            data: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
            }
        };
    } catch (err) {
        console.error(err);
        throw new Error('Internal Server Error');
    }
}

export async function refreshToken(refresh){
    const Token = refresh;
    try {
        const sql = 'SELECT * FROM users WHERE refreshToken = ?';
        const [result] = await db.query(sql, [Token]);

        if (result.length === 0) {
            throw new Error('Refresh token not found in database');
        }
        const user = result[0];
        const verify = jwt.verify(Token, process.env.REFRESH_TOKEN);
        const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        return {
            accessToken,
            data: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
            },
        };
    } catch (err) {
        return { error: err.message || 'Error refreshing token' };
    }
}