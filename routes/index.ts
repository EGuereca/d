import express from "express";
import AuthController from "../Controllers/Auth";
import UserController from "../Controllers/UserController";
import RepartidorController from "../Controllers/RepartidorController";
import { verifyToken } from "../middlewares/authMiddleware";
import dotenv from "dotenv";
import OrdersController from "../Controllers/OrdersController";

dotenv.config();

const routes = express.Router();
console.log("Rutas cargadas correctamente");


// Rutas de autenticación
routes.post("/register", AuthController.register);
routes.post("/login", AuthController.login);
routes.post("/logout", AuthController.logout);

// Rutas de usuarios
routes.get("/users", verifyToken, UserController.getAllUsers);
routes.get("/users/:id", verifyToken, UserController.getUserById);
routes.put("/users/:id", verifyToken, UserController.updateUser);
routes.delete("/users/:id", verifyToken, UserController.deleteUser);
routes.get("/last-user", UserController.getLastUser);

routes.get('/assign-repartidor', UserController.assignRepartidor);
routes.get('/user', UserController.getLoggedInUser);

// Rutas de repartidor
routes.get("/salida", RepartidorController.salida);
routes.get("/punto-medio", RepartidorController.puntoMedio);
routes.get("/llegada", RepartidorController.llegada);
routes.get("/avanzar", RepartidorController.avanzar);

// Rutas de órdenes
routes.get("/orders", OrdersController.getAllOrders);
routes.get("/orders/:id", OrdersController.getOrderById);
routes.post("/orders", OrdersController.createOrder);
routes.put("/orders/:id", OrdersController.updateOrder);
routes.get("/orders/:id/total", OrdersController.getTotal);
routes.post("/orders/details", OrdersController.createOrderDetail);
routes.get("/orders/:order_id/details", OrdersController.getOrderDetails);
routes.get("/orders/last/", OrdersController.getLastOrder);
routes.get('/status/:orderId', OrdersController.getOrderStatus);
routes.delete('/orders/:orderId/details/:productId', OrdersController.deleteOrderDetail);
// Rutas de productos
routes.get("/products", OrdersController.getProducts);

export default routes;
