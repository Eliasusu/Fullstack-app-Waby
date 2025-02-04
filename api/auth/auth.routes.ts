import { Router } from "express";
import { register, login, logout, profile, verifyToken } from "./auth.controllers.js";
import { validateToken } from "../middlewares/validateToken.js";

export const authRouter = Router();

//Register user 
authRouter.post('/register', register);

//Login user 
authRouter.post('/login', login);

//Logout user
authRouter.post('/logout', logout);

//Protected route
authRouter.get('/verify', verifyToken);

authRouter.get('/profile', validateToken ,profile);


