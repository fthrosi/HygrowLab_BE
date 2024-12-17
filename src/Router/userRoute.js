import express from 'express';
import { registerUser, loginUser } from '../Controller/Auth.js';
import { validateRegisterBody, validateLoginBody } from '../middleware/Auth.js';
const router = express.Router();

router.post('/register', validateRegisterBody, async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const result = await registerUser(fullName, email, password);
    res
      .status(201)
      .json({ message: 'User registered successfully', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post('/login', validateLoginBody, async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await loginUser(email, password, res);
    res.status(200).json({
      message: 'User logged in successfully',
      data: result,
      accessToken: result.accessToken,
      id: result.id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/logout', async (req, res) => {
  // Menghapus refresh token dari cookie
  res.clearCookie('refreshToken', {
    httpOnly: true, // Pastikan hanya dapat diakses oleh server
    secure: process.env.NODE_ENV === 'production', // Hanya gunakan secure cookie di produksi (HTTPS)
    sameSite: 'strict', // Mencegah pengiriman cookie dalam permintaan lintas situs
  });

  // Kirimkan respons bahwa logout berhasil
  res.status(200).json({
    message: 'User logged out successfully',
  });
});
// router.post('/refreshToken', async (req,res)=>{
//     const refresh = req.cookies.refreshToken;
//     if(!refresh){
//         return res.sendStatus(401);
//     }
//     try{
//         const result = await refreshToken(refresh);
//         if (result.error) {
//             return res.status(403).json({ error: result.error });
//         }
//         res.status(200).json({
//             message: 'Token refreshed successfully',
//             data: result,
//         });
//     }catch(err){
//         res.status(500).json({ error: err.message });
//     }
// })
export default router;
