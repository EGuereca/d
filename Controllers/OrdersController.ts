import { Request, Response } from 'express';
import Order from '../db/models/orders';
import User from '../db/models/user';
import OrderDetail from '../db/models/orders_details';
import Product from '../db/models/product';

export default class OrdersController {
    static async getAllOrders(req: Request, res: Response) {
        try {
            const orders = await Order.findAll();
            res.status(200).json(orders);
        } catch (error) {
            console.error('Error al obtener órdenes:', error);
            res.status(500).json({ message: 'Error al obtener órdenes.' });
        }
    }

    static async getOrderById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const order = await Order.findByPk(Number(id));
            if (order) {
                res.status(200).json(order);
            } else {
                res.status(404).json({ message: 'Orden no encontrada.' });
            }
        } catch (error) {
            console.error('Error al obtener la orden:', error);
            res.status(500).json({ error: 'Error al obtener la orden.' });
        }
    }

    static async createOrder(req: Request, res: Response) {
        try {
            const { cliente_id } = req.body;

            if (!cliente_id || isNaN(Number(cliente_id))) {
                return res.status(400).json({ message: 'cliente_id es inválido o no fue proporcionado.' });
            }

            // Buscar repartidor con role_id = 3
            const repartidor = await User.findOne({ where: { role_id: 3 } });

            if (!repartidor) {
                return res.status(404).json({ message: 'No se encontró un repartidor disponible.' });
            }

            // Buscar cliente
            const cliente = await User.findByPk(Number(cliente_id));
            if (!cliente) {
                return res.status(404).json({ message: 'Cliente no encontrado.' });
            }

            // Crear orden
            const order = await Order.create({
                cliente_id: cliente.id,
                repartidor_id: repartidor.id,
                total: 0,
                estado: 'pendiente',
            });

            res.status(201).json({ message: 'Orden creada correctamente', order });
        } catch (error) {
            console.error('Error al crear la orden:', error);
            res.status(500).json({ error: 'Error al crear la orden.' });
        }
    }

    static async updateOrder(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { estado } = req.body;

            const order = await Order.findByPk(Number(id));
            if (!order) {
                return res.status(404).json({ message: 'Orden no encontrada.' });
            }

            await order.update({ estado });

            res.status(200).json({ message: 'Orden actualizada correctamente', order });
        } catch (error) {
            console.error('Error al actualizar la orden:', error);
            res.status(500).json({ error: 'Error al actualizar la orden.' });
        }
    }

    static async getTotal(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const order = await Order.findByPk(Number(id));
            if (order) {
                res.status(200).json(order.total);
            } else {
                res.status(404).json({ message: 'Orden no encontrada.' });
            }
        } catch (error) {
            console.error('Error al obtener el total de la orden:', error);
            res.status(500).json({ error: 'Error al obtener el total de la orden.' });
        }
    }

    static async createOrderDetail(req: Request, res: Response) {
        try {
            const { order_id, product_id, quantity } = req.body;

            const order = await Order.findByPk(Number(order_id));
            if (!order) {
                return res.status(404).json({ message: 'Orden no encontrada.' });
            }

            const product = await Product.findByPk(Number(product_id));
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado.' });
            }

            const orderDetail = await OrderDetail.create({ order_id, product_id, quantity });

            res.status(201).json({ message: 'Detalle de orden creado correctamente', orderDetail });
        } catch (error) {
            console.error('Error al crear el detalle de orden:', error);
            res.status(500).json({ error: 'Error al crear el detalle de orden.' });
        }
    }

    static async getOrderDetails(req: Request, res: Response) {
        try {
            const { order_id } = req.params;
            const orderDetails = await OrderDetail.findAll({ where: { order_id: Number(order_id) } });
            const details = await Promise.all(orderDetails.map(async (detail) => {
                const product = await Product.findByPk(detail.product_id);
                return { ...detail.toJSON(), product };
            }));
            res.status(200).json(details);
        } catch (error) {
            console.error('Error al obtener los detalles de la orden:', error);
            res.status(500).json({ error: 'Error al obtener los detalles de la orden.' });
        }
    }

    static async getProducts(req: Request, res: Response) {
        try {
            const products = await Product.findAll();
            res.status(200).json(products);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({ message: 'Error al obtener productos.' });
        }
    }

    static async getLastOrder(req: Request, res: Response) {
        try {
            const order = await Order.findOne({ order: [['createdAt', 'DESC']] });
            res.status(200).json(order);
        } catch (error) {
            console.error('Error al obtener la última orden:', error);
            res.status(500).json({ error: 'Error al obtener la última orden.' });
        }
    }
    static async getOrderStatus(req: Request, res: Response) {
        try {
            const { orderId } = req.params;
            const order = await Order.findByPk(Number(orderId));

            if (order) {
                res.status(200).json({ estado: order.estado });
            } else {
                res.status(404).json({ message: 'Orden no encontrada.' });
            }
        } catch (error) {
            console.error('Error al obtener el estado de la orden:', error);
            res.status(500).json({ error: 'Error al obtener el estado de la orden.' });
        }
    }
    static async deleteOrderDetail(req: Request, res: Response) {
        try {
            const { orderId, productId } = req.params;
            const orderDetail = await OrderDetail.findOne({
                where: {
                    order_id: Number(orderId),
                    product_id: Number(productId)
                }
            });

            if (!orderDetail) {
                return res.status(404).json({ message: 'Detalle de orden no encontrado.' });
            }

            await orderDetail.destroy();
            res.status(200).json({ message: 'Producto eliminado del carrito correctamente.' });
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            res.status(500).json({ error: 'Error al eliminar el producto del carrito.' });
        }
    }

}
