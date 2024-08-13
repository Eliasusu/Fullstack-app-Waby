import { Router } from "express";
import { register, login, logout, protectedRoute } from "./auth.controllers.js";

export const authRouter = Router();

//Register user 
authRouter.post('/register', register);

//Login user 
authRouter.post('/login', login);

//Logout user
authRouter.post('/logout', logout);

//Protected route
authRouter.get('/protected', protectedRoute);


