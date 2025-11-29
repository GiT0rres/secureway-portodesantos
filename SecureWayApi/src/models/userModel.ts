// models/userModel.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../repositories/repoConfig";

export class Users extends Model {
    public id!: number;
    public firebaseUid!: string; // NOVO
    public cpf!: number;
    public rg!: string;
    public chaveUnitaria!: number;
    public nome!: string;
    public telefone!: number;
    public email!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Users.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    firebaseUid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    cpf: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    rg: {
        type: DataTypes.STRING,
        allowNull: true
    },
    chaveUnitaria: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    tableName: "users",
    timestamps: true
});