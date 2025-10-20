import { DataTypes, Model } from "sequelize";
import { sequelize } from "../repositories/repoConfig";
import { Users } from "./userModel";

/**
 * MODELO DE SESSÕES PERSISTENTES
 * Armazena refresh tokens com hash para segurança
 * Permite manter usuários logados mesmo após fechar o navegador
 */
export class PersistentSession extends Model {
    // ID único da sessão
    public id!: number;
    
    // IP do usuário (ex: "192.168.1.100")
    public ip!: string;
    
    // Hash do refresh token (SHA-256) - NUNCA armazena o token real
    public refreshTokenHash!: string;
    
    // User Agent do navegador (ex: "Chrome Windows")
    public agent!: string;
    
    // ID do usuário dono da sessão
    public userId!: number;
    
    // Se a sessão ainda é válida (pode ser invalidada no logout)
    public valid!: boolean;
    
    // Data de expiração (normalmente 7 dias)
    public expiresAt!: Date;
    
    // Data que foi invalidada (opcional - preenchida quando faz logout)
    public expiredAt?: Date;
    
    // Data de criação (automática)
    public readonly createdAt!: Date;
    
    // Data de última atualização (automática)
    public readonly updatedAt!: Date;

    // Relacionamento com usuário - permite acessar os dados do usuário
    public getUser!: () => Promise<Users>;
}

// Definição da tabela no banco de dados
PersistentSession.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,    // Gera automaticamente: 1, 2, 3...
        primaryKey: true        // Identificador único
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: false        // Obrigatório ter um IP
    },
    refreshTokenHash: {
        type: DataTypes.STRING(64), // SHA-256 produz 64 caracteres hex
        allowNull: false,
        unique: true           // Cada hash é único no sistema
    },
    agent: {
        type: DataTypes.STRING,
        allowNull: false,      // Obrigatório ter user agent
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,      // Sessão deve pertencer a um usuário
        references: {
            model: Users,      // Referencia a tabela de usuários
            key: "id"
        },
        onUpdate: "CASCADE"    // Se usuário for atualizado, reflete aqui
    },
    valid: {
        type: DataTypes.BOOLEAN,
        defaultValue: true    // Nova sessão começa como válida
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false      // Data de expiração obrigatória
    },
    expiredAt: {
        type: DataTypes.DATE,
        allowNull: true       // Data de invalidação opcional
    }
}, {
    sequelize,                // Conexão com o banco de dados
    tableName: "persistent_sessions",  // Nome da tabela no banco
    timestamps: true          // Cria createdAt e updatedAt automaticamente
});

// Definindo relacionamentos entre as tabelas

/**
 * Uma sessão pertence a UM usuário
 * - foreignKey: "userId" - campo que faz a ligação
 * - as: "user" - apelido para usar nas queries
 */
PersistentSession.belongsTo(Users, { 
    foreignKey: "userId", 
    as: "user" 
});

/**
 * Um usuário pode ter MUITAS sessões
 * - foreignKey: "userId" - campo que faz a ligação  
 * - as: "sessions" - apelido para usar nas queries
 */
Users.hasMany(PersistentSession, { 
    foreignKey: "userId", 
    as: "sessions" 
});