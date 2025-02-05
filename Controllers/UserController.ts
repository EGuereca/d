import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import user from '../db/models/user';

export default class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await user.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error al obtener usuarios.' });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await user.findByPk(id);
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ message: 'Usuario no encontrado.' });
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      res.status(500).json({ error: 'Error al obtener el usuario.' });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;

      const usuario = await user.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      await usuario.update({ name, email, phone });

      res.status(200).json({ message: 'Usuario actualizado correctamente', usuario });
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      res.status(500).json({ error: 'Error al actualizar el usuario.' });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await user.findByPk(id);
      if (usuario) {
        await usuario.destroy();
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado.' });
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      res.status(500).json({ error: 'Error al eliminar el usuario.' });
    }
  }

  static async assignRepartidor(req: Request, res: Response) {
    try {
      const repartidores = await user.findAll({
        where: { role_id: 3 } // Asumiendo que el rol 3 es de repartidor
      });

      if (repartidores.length === 0) {
        return res.status(404).json({ message: 'No hay repartidores disponibles.' });
      }

      const repartidor = repartidores[Math.floor(Math.random() * repartidores.length)];
      return res.status(200).json({ repartidor });
    } catch (error) {
      console.error('Error al asignar repartidor:', error);
      return res.status(500).json({ message: 'Error al asignar repartidor.' });
    }
  }

  static async getLoggedInUser(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No se proporcionó un token válido." });
      }
  
      const token = authHeader.split(" ")[1];
  
      // Verificar y decodificar el token
      let decoded: any;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!);
      } catch (err) {
        return res.status(401).json({ message: "Token inválido o expirado." });
      }
  
      // Asegurar que el payload tenga un id válido
      if (!decoded || !decoded.id) {
        return res.status(400).json({ message: "El token no contiene un ID válido." });
      }
  
      // Buscar al usuario en la base de datos
      const usuario = await user.findByPk(decoded.id);
  
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
  
      return res.status(200).json({ usuario });
    } catch (error) {
      console.error("Error al obtener usuario logueado:", error);
      return res.status(500).json({ message: "Error al obtener usuario." });
    }
  }
}  