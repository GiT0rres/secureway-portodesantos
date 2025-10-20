import { httpResponse } from "../models/http-response-model";

/**
 * UTILITÁRIO DE RESPOSTAS HTTP PADRONIZADAS
 * Garante consistência em todas as respostas da API
 */

// Success: 200 OK
export const ok = async (data: any): Promise<httpResponse> => {
    return {
        statusCode: 200,
        body: data,
    };
};

// Success: 204 No Content
export const noContent = async (): Promise<httpResponse> => {
    return {
        statusCode: 204,
        body: null,
    };
};

// Success: 201 Created
export const created = async (body: any): Promise<httpResponse> => {
    return {
        statusCode: 201,
        body: body,
    };
};

// Client Error: 400 Bad Request
export const badRequest = async (): Promise<httpResponse> => {
    return {
        statusCode: 400,
        body: { message: "Bad Request" },
    };
};

// Client Error: 401 Unauthorized
export const unauthorized = async (message: string = "Unauthorized"): Promise<httpResponse> => {
    return {
        statusCode: 401,
        body: { message: message }, // IMPORTANTE: 'message' em vez de 'error'
    };
};

// Client Error: 403 Forbidden
export const forbidden = async (message: string = "Forbidden"): Promise<httpResponse> => {
    return {
        statusCode: 403,
        body: { message: message },
    };
};

// Client Error: 404 Not Found
export const notFound = async (message: string = "Not Found"): Promise<httpResponse> => {
    return {
        statusCode: 404,
        body: { message: message },
    };
};

// Server Error: 500 Internal Server Error
export const serverError = async (error: Error): Promise<httpResponse> => {
    return {
        statusCode: 500,
        body: { message: error.message || "Internal Server Error" },
    };
};