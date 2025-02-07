import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../db/models/user';
import dotenv from 'dotenv';

dotenv.config();

export default class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, phone, password, role } = req.body;
      if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: 'Campos incompletos.' });
      }
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'El correo ya está registrado.' });
      }
      // Encriptar la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(password, 10);

      const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      const expirationUTC = new Date(decoded.exp! * 1000);
      const expirationLocal = new Date(expirationUTC.getTime() - expirationUTC.getTimezoneOffset() * 60000);
      const newUser = await User.create({
        name,
        email,
        phone,
        password: hashedPassword, // Guardar la contraseña encriptada
        jwt_token: token,
        role_id: role, // Asignar el rol de cliente por defecto
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return res.status(201).json({
        message: 'Usuario registrado correctamente.',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role_id: newUser.role_id,
        },
        token,
        tokenExpiration: expirationLocal,
      });
    } catch (error) {
      console.error('Error en el registro:', error);
      return res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (!existingUser) {
        return res.status(404).json({ message: 'Credenciales inválidas.' });
      }

      // Comparar la contraseña encriptada
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales inválidas.' });
      }

      const token = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });

      const decoded = jwt.decode(token) as jwt.JwtPayload;
      const expirationUTC = new Date(decoded.exp! * 1000);
      const expirationLocal = new Date(expirationUTC.getTime() - expirationUTC.getTimezoneOffset() * 60000);

      existingUser.jwt_token = token;
      await existingUser.save();

      return res.status(200).json({
        message: 'Inicio de sesión exitoso.',
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone,
          role_id: existingUser.role_id,
        },
        token,
        tokenExpiration: expirationLocal,
      });
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      res.status(500).json({ message: 'Error al iniciar sesión.' });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      return res.status(200).json({ message: 'Sesión cerrada correctamente.' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      res.status(500).json({ message: 'Error al cerrar sesión.' });
    }
  }
}
