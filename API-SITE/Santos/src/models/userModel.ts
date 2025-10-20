import { DataType, DataTypes, Model } from "sequelize";
import { sequelize } from "../repositories/repoConfig";

export class Users extends Model {
    public id!: number;
    public cpf!: string;
    public rg!: string;
    public chaveUnitaria!: number;
    public senhaHash!: string;
    public nome!: string;
    public telefone!: string;
    public email!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Users.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
        cpf: { type: DataTypes.STRING, allowNull: false, unique: true },
        rg: { type: DataTypes.STRING, allowNull: false, unique: true },   // agora obrigatório
        chaveUnitaria: { type: DataTypes.INTEGER },
        senhaHash: { type: DataTypes.STRING, allowNull: false },
        nome: { type: DataTypes.STRING, allowNull: false },
        telefone: { type: DataTypes.STRING, allowNull: false, unique: true }, // obrigatório
        email: { type: DataTypes.STRING, allowNull: false, unique: true }
    },
    {
        sequelize,
        tableName: "users",
        timestamps: true
    }
);
