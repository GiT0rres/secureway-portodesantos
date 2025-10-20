import { DataType, DataTypes, Model } from "sequelize";
import { sequelize } from "../repositories/repoConfig";

export class Esp extends Model{
     public id!: number 
     public name!: string
     public local!: string 
     public readonly createdAt!: Date //creado em
     public readonly updateAt!: Date //atulizando em
}

Esp.init({
    id: {type:DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    nome: {type:DataTypes.STRING, allowNull:false },
    local: {type:DataTypes.STRING, allowNull:false },

}, {
    sequelize, 
    "tableName":"esp",
    "timestamps": true
})