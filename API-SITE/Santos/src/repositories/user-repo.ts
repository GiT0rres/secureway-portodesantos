import { Users } from "../models/userModel";
import * as crypto from "../utils/hash-helper";

/**
 * REPOSITÓRIO DE USUÁRIOS
 * Todas as operações de banco relacionadas a usuários
 * Segue o padrão Repository para separar lógica de dados da lógica de negócio
 */

/**
 * Busca todos os usuários do sistema
 * @returns Promise<Users[]> Array com todos os usuários
 * @warning Cuidado com dados sensíveis - considerar projeções em produção
 */
export const findAllUsers = async () => {
  return await Users.findAll();
};

/**
 * Busca usuário por ID primário
 * @param id ID do usuário a ser buscado
 * @returns Promise<Users | null> Usuário encontrado ou null se não existir
 * @usage Usado para perfil, edição, busca por ID
 */
export const findUserByID = async (id: number) => {
  return await Users.findByPk(id);
};

/**
 * Busca usuário por email (USADO PELO SISTEMA DE AUTENTICAÇÃO)
 * @param email Email do usuário a ser buscado
 * @returns Promise<Users | null> Usuário encontrado ou null se não existir
 * @critical Função crítica para login - manter performance otimizada
 */
export const findUserByEmail = async (email: string) => {
  return await Users.findOne({ where: { email } });
};

/**
 * Cria novo usuário com senha criptografada
 * @param data Objeto com dados do usuário { nome, senha, email, telefone }
 * @returns Promise<Users> Usuário criado com ID gerado
 * @security A senha é hasheada com Argon2 antes de armazenar
 * @validation Garantir que email seja único (tratado pelo modelo)
 */
export const createUser = async (data: any) => {
  return await Users.create({
    "nome": data["nome"],
    "senhaHash": await crypto.hashArgon2(data["senha"]), // Transforma senha em hash seguro
    "email": data["email"],
    "telefone": data["telefone"]
  });
};

/**
 * Deleta usuário do sistema
 * @param id ID do usuário a ser deletado
 * @returns Promise<boolean> True se usuário foi deletado, false se não encontrado
 * @consideration Em produção, considerar soft delete em vez de exclusão física
 */
export const deleteUser = async (id: number) => {
  const deleted = await Users.destroy({ where: { id } });
  return deleted > 0; // Retorna boolean indicando se deletion ocorreu
};