import { Router } from "express";
import { register, login } from "../controllers/auth.controllers.js";

export const authRouter = Router();

//Register user 
authRouter.post('/register', register);

//Login user 
authRouter.post('/login', login);

