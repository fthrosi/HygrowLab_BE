import express from 'express';
import { registerUser, loginUser, logout } from '../Controller/Auth.js';
import {
  validateRegisterBody,
  validateLoginBody,
  authenticateToken,
} from '../middleware/Auth.js';
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
    res
      .status(200)
      .json({
        message: 'User logged in successfully',
        data: result,
        accessToken: result.accessToken,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put('/logout', authenticateToken, async (req, res) => {
  const id = req.user.id;
  try {
    const result = await logout(id);
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
