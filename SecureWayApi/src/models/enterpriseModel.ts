// models/enterpriseModel.ts - VERSÃO CORRIGIDA
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../repositories/repoConfig";

export class Enterprise extends Model {
  public id!: number;
  public firebaseUid!: string | null;  // PODE SER NULL
  public nome!: string;
  public email!: string;
  public telefone!: number;
  public cnpj!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Enterprise.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  firebaseUid: {
    type: DataTypes.STRING,
    allowNull: true,      // ← MUDANÇA: Permite NULL
    unique: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefone: {
    type: DataTypes.BIGINT,  // ← MUDANÇA: INTEGER → BIGINT
    allowNull: false,
  },
  cnpj: {
    type: DataTypes.BIGINT,  // ← MUDANÇA: INTEGER → BIGINT
    allowNull: false,
    unique: true,
  }
}, {
  sequelize,
  tableName: "enterprise",
  timestamps: true,
});