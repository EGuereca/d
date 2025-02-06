import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
require('dotenv').config();

interface ProductAttributes {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public nombre!: string;
    public descripcion!: string;
    public precio!: number;
    public imagen!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
});

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        precio: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        imagen: {
            type: DataTypes.STRING,
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
        tableName: 'products',
    }
);

export default Product;