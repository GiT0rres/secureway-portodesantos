import { Model, DataTypes } from "sequelize";
import { sequelize } from "../repositories/repoConfig";

export class Enterprise extends Model {
  public id!: number;
  public nome!: string;
  public email!: string;
  public telefone!: string;  // mudou para string
  public cnpj!: string;      // mudou para string
  public senhaHash!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Enterprise.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefone: {
      type: DataTypes.STRING, // string
      allowNull: false,
    },
    cnpj: {
      type: DataTypes.STRING, // string
      allowNull: false,
      unique: true,
    },
    senhaHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "enterprise",
    timestamps: true,
  }
);