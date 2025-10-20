/**
 * INTERFACE PADRÃO PARA RESPOSTAS HTTP
 * Garante consistência em todas as respostas da API
 */
export interface httpResponse {
    statusCode: number;    // Código HTTP (200, 401, etc)
    body: any;            // Corpo da resposta (dados ou erro)
}