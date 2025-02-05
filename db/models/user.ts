import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
require('dotenv').config();

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password: string;
  jwt_token?: string; 
  role_id: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'jwt_token'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone?: string;
  public password!: string;
  public jwt_token?: string; 
  public role_id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
});

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jwt_token: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Cliente por defecto
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
    modelName: 'Users',
  }
);

export default User;
