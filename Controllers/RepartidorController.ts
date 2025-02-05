import { Request, Response } from "express";

export default class RepartidorController {
  private static ubicaciones = [
    { latitude: 20.6736, longitude: -103.344 }, 
    { latitude: 20.6750, longitude: -103.350 }, 
    { latitude: 20.6780, longitude: -103.355 }, 
  ];

  static avance: number = 0;  

  static salida(req: Request, res: Response) {
    return res.json(RepartidorController.ubicaciones[0]);
  }

  static puntoMedio(req: Request, res: Response) {
    return res.json(RepartidorController.ubicaciones[1]);
  }

  static llegada(req: Request, res: Response) {
    return res.json(RepartidorController.ubicaciones[2]);
  }

  static avanzar(req: Request, res: Response) {
    if (RepartidorController.avance >= RepartidorController.ubicaciones.length - 1) {
      return res.json({ message: "El repartidor ha llegado al destino." });
    }

    const ubicacionActual = RepartidorController.ubicaciones[RepartidorController.avance];
    const ubicacionSiguiente = RepartidorController.ubicaciones[RepartidorController.avance + 1];

    RepartidorController.avance++;

    return res.json({
      message: "El repartidor ha avanzado",
      location: ubicacionSiguiente,
      avance: RepartidorController.avance,
    });
  }
}
