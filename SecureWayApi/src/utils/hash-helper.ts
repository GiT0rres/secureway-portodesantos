import * as argon2 from 'argon2';
import * as crypto from 'crypto';

/**
 * UTILITÁRIO PARA HASH E CRIPTOGRAFIA
 * Responsável por todas as operações de segurança de senhas e tokens
 */

/**
 * Cria hash de senha usando Argon2
 * @param senha Senha em texto puro
 * @returns Promise<string> Hash seguro da senha
 */
export const hashArgon2 = async (senha: string): Promise<string> => {
    try {
        return await argon2.hash(senha);
    } catch (error) {
        console.error('Erro ao criar hash Argon2:', error);
        throw new Error('Falha ao criptografar senha');
    }
}

/**
 * Verifica se uma senha corresponde ao hash Argon2
 * @param senha Senha em texto puro para verificar
 * @param senhaHash Hash Argon2 armazenado no banco
 * @returns Promise<boolean> True se a senha estiver correta
 */
export const verifyArgon2 = async (senha: string, senhaHash: string): Promise<boolean> => {
    try {
        return await argon2.verify(senhaHash, senha);
    } catch (error) {
        console.error('Erro ao verificar hash Argon2:', error);
        return false;
    }
}

/**
 * Cria um hash SHA-256 de uma string
 * Usado para armazenar refresh tokens de forma segura no banco
 * @param data String para hashear (ex: refresh token)
 * @returns Promise<string> Hash SHA-256 em hexadecimal
 */
export const sha256Hash = async (data: string): Promise<string> => {
    return crypto.createHash('sha256').update(data).digest('hex');
}