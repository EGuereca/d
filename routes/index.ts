import express from "express";
import AuthController from "../Controllers/Auth";
import UserController from "../Controllers/UserController";
import RepartidorController from "../Controllers/RepartidorController";
import { verifyToken } from "../middlewares/authMiddleware";
import dotenv from "dotenv";

dotenv.config();

const routes = express.Router();
console.log("Rutas cargadas correctamente");


// Rutas de autenticación
routes.post("/register", AuthController.register);
routes.post("/login", AuthController.login);
routes.post("/logout",  AuthController.logout);

// Rutas de usuarios
routes.get("/users", verifyToken, UserController.getAllUsers);
routes.get("/users/:id", verifyToken, UserController.getUserById);
routes.put("/users/:id", verifyToken, UserController.updateUser);
routes.delete("/users/:id", verifyToken, UserController.deleteUser);

routes.get('/assign-repartidor', UserController.assignRepartidor);
routes.get('/user', UserController.getLoggedInUser);

// Rutas de repartidor
routes.get("/salida", RepartidorController.salida);
routes.get("/punto-medio", RepartidorController.puntoMedio);
routes.get("/llegada", RepartidorController.llegada);
routes.get("/avanzar", RepartidorController.avanzar);


export default routes;
