import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
require('dotenv').config();
import Order from './orders';
import Product from './product';

interface OrderDetailAttributes {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

interface OrderDetailCreationAttributes extends Optional<OrderDetailAttributes, 'id'> {}

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
});

class OrderDetail extends Model<OrderDetailAttributes, OrderDetailCreationAttributes> implements OrderDetailAttributes {
    public id!: number;
    public order_id!: number;
    public product_id!: number;
    public quantity!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

OrderDetail.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Order,
                key: 'id',
            },
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Product,
                key: 'id',
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'orders_datails',
    }
);

Order.hasMany(OrderDetail, { foreignKey: 'order_id' });
Product.hasMany(OrderDetail, { foreignKey: 'product_id' });

OrderDetail.belongsTo(Order, { foreignKey: 'order_id' });
OrderDetail.belongsTo(Product, { foreignKey: 'product_id' });

export default OrderDetail;