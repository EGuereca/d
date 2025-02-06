import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import dotenv from 'dotenv';
import User from './user';

dotenv.config();

interface OrderAttributes {
    id: number;
    cliente_id: number;
    repartidor_id: number;
    total: number;
    estado: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public cliente_id!: number;
    public repartidor_id!: number;
    public total!: number;
    public estado!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
});

Order.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        repartidor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        total: {
            type: DataTypes.DECIMAL(10, 2), // Mejor precisión para dinero
            allowNull: false,
        },
        estado: {
            type: DataTypes.STRING(20), // Limitamos la longitud del estado
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'orders',
        timestamps: true, // Sequelize manejará createdAt y updatedAt automáticamente
    }
);

// Relaciones corregidas
User.hasMany(Order, { foreignKey: 'cliente_id', as: 'ordenes_cliente' });
User.hasMany(Order, { foreignKey: 'repartidor_id', as: 'ordenes_repartidor' });
Order.belongsTo(User, { foreignKey: 'cliente_id', as: 'cliente' });
Order.belongsTo(User, { foreignKey: 'repartidor_id', as: 'repartidor' });

export default Order;
