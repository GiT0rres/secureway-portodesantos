import { DataType, DataTypes, Model } from "sequelize";
import { sequelize } from "../repositories/repoConfig";
import { Esp } from "./espModel";
import { Users } from "./userModel";

// Modelo de Agendamento
export class Scheduling extends Model {
  public id!: number;
  public local!: string;
  public empresa!: string;
  public carga!: string;
  public dataHora!: Date;
  public finalizado!: boolean;
  public idUsuario!: number; // FK para Usuario
  public idEsp!: number; // FK para Esp
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Scheduling.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    local: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    empresa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    carga: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dataHora: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    finalizado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Users, key: "id" },
    },
    idEsp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Esp, key: "id" },
    },
  },
  {
    sequelize,
    tableName: "scheduling",
    timestamps: true,
  }
);