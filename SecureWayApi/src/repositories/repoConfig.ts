import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("Santos", "root", "", {
    "host": "localHost",
    "dialect": "mysql",
    "logging": false,
    "timezone": "-03:00"
})