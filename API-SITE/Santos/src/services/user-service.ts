import * as httpResponse from "../utils/http-helper";
import * as UserRepository from "../repositories/user-repo";

/**
 * SERVIÇO DE USUÁRIOS
 * Lógica de negócio para operações com usuários
 * Camada que orquestra repositories e formata respostas HTTP
 */

/**
 * Busca todos os usuários do sistema
 * @returns Promise<httpResponse> Resposta HTTP com dados ou vazia
 * @usage Listagem administrativa, dashboard
 * @security Em produção, considerar filtro de dados sensíveis
 */
export const getUserService = async () => {
    const data = await UserRepository.findAllUsers();
    let response = null;

    if (data) {
      // Retorna 200 OK com os dados dos usuários
      response = await httpResponse.ok(data)
    }else{ 
        // Retorna 204 No Content se não há usuários
        response = await httpResponse.noContent()
    }
    return response
}

/**
 * Cria novo usuário no sistema
 * @param user Objeto com dados do usuário { nome, senha, email, telefone }
 * @returns Promise<httpResponse> Resposta HTTP de sucesso ou erro
 * @validation Valida campos obrigatórios antes de criar
 * @security A senha será hasheada no repositório
 */
export const createUserService = async (user: any) => {
  // Validação robusta dos dados de entrada
  if (!user || 
      Object.keys(user).length === 0 || 
      !user["nome"] || 
      !user["senha"] || 
      !user["email"] || 
      !user["telefone"]) {
     // Retorna 400 Bad Request se dados incompletos
     return await httpResponse.badRequest();
  } else {
     // Chama o repositório para criar usuário (inclui hash da senha)
     const createdUser = await UserRepository.createUser(user);
     console.log(createdUser) // TODO: Remover em produção ou usar logger
     // Retorna 201 Created com dados do usuário criado
     return await httpResponse.created(createdUser);
  }
}

/**
 * Busca usuário específico por ID
 * @param id ID do usuário a ser buscado
 * @returns Promise<httpResponse> Resposta HTTP com usuário ou vazia
 * @usage Perfil do usuário, edição, detalhes
 */
export const getUserByIdService = async (id:number) => {
    const data = await UserRepository.findUserByID(id);
    let response = null;

    if (data) {
      // Retorna 200 OK com dados do usuário
      response = await httpResponse.ok(data)
    }else{
        // Retorna 204 No Content se usuário não existe
        response = await httpResponse.noContent()
    }
    return response
}

/**
 * Deleta usuário do sistema
 * @param userId ID do usuário a ser deletado
 * @returns Promise<httpResponse> Resposta HTTP de sucesso ou erro
 * @validation Verifica se usuário existe antes de deletar
 * @security Em produção, considerar soft delete em vez de exclusão física
 */
export const deleteUserService = async (userId: number | undefined) => {
  // Validação do parâmetro de entrada
  if (!userId) {
    return await httpResponse.badRequest();
  }

  // Verifica se usuário existe antes de tentar deletar
  const userExists = await UserRepository.findUserByID(userId);
  if (!userExists) {
    return await httpResponse.notFound(); // 404 Not Found
  }

  // Executa a exclusão física no banco
  await UserRepository.deleteUser(userId);
  
  // Retorna 204 No Content (sucesso sem corpo)
  return await httpResponse.noContent();
}