import { DataType, DataTypes, Model } from "sequelize";
import { sequelize } from "../repositories/repoConfig";
import { Esp } from "./espModel";

export class Read extends Model{
    public id!: number
    public readKey!: number
    public idEsp!: number; // FK para Esp
    public readonly createdAt!: Date;
}

Read.init({
    id: {type:DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    readKey: {type:DataTypes.INTEGER, allowNull: false},
    idEsp: {type: DataTypes.INTEGER, allowNull: false, references: { model: Esp, key: "id" },},

}, {
    sequelize, 
    "tableName":"read",
    "timestamps": true
})