import {getCurrentUser,   login, logout, register } from '../controllers/authController';
import express from 'express';
import auth from '../middleware/authMiddleware';
import checkRole from '../middleware/roleMiddleware';
const router = express.Router();

router.get("/user",auth , getCurrentUser);

router.post("/register",register );
router.post("/login", login );
router.post("/logout", logout );





export default router;