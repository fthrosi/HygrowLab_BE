import db from '../Database/setup.js';
import jwt from 'jsonwebtoken';

 export async function validateRegisterBody(req, res, next) {
    const { fullName, email, password, city, birthDate } = req.body;
    console.log(req.body);
  
    if (!fullName || !email || !password || !city || !birthDate) {
      return res.status(400).json({ error: 'Semua Form Harus Diisi' });
    }
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email tidak valid' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }
    const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthDate.match(birthDateRegex)) {
      return res.status(400).json({ error: 'Format salah' });
    }
    try{
        const sql = `SELECT * FROM users WHERE email = ?`;
        const [result]= await db.query(sql, [email]);
        if (result.length > 0) {
            return res.status(400).json({ error: 'Email sudah terdaftar' });
        }
        next();
    }catch(err){
        console.error('Database error:', err);
      return res.status(500).json({ error: 'ini error' });
    }
    
    
  }
export function validateLoginBody(req, res, next) {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Semua Form Harus Diisi' });
    }
  
    next();
}
export function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err){
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    })
}