import { Response, Request } from "express"
import { Users } from "../models/userModel"
import { Scheduling } from "../models/schedulingModel"
// Importa Operadores do Sequelize para consultas complexas
import { Op } from "sequelize";
import { Read } from "../models/readModel";
import { Esp } from "../models/espModel";
// NOVOS IMPORTS PARA AUTH
import * as authService from "../services/auth-service";
import * as httpHelper from "../utils/http-helper";
import { PersistentSession } from "../models/persistent-session-model";
import * as crypto from "../utils/hash-helper";

export const getUser = async (req:Request, res:Response) => {
    try{
    const users = await Users.findAll()
    res.status(200).json(users)
    }catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export const getUserID = async (req:Request, res:Response) => {
    const { id } = req.params;

    const user = await Users.findByPk(id);//se o findByPk n achar o id ele retorna null
    if(!user){
        res.status(404).json({"error":"user not found"})
        return
    }

    res.status(200).json(user)
}

export const postUser = async (req: Request, res: Response) => {
    try {
        const { nome, email, senha, telefone, rg, cpf } = req.body;

        if (!nome || !email || !senha || !telefone || !rg || !cpf) {
            res.status(400).json({ "error": "faltou algum campo obrigatório" });
            return;
        }

        const senhaHash = await crypto.hashArgon2(senha);

        const newUser = await Users.create({
            nome,
            email,
            senhaHash,
            telefone,
            rg,
            cpf
        });

        res.status(201).json({ message: "success", user: newUser });

    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};


export const patchUser = async (req:Request, res:Response) =>{
    try{
       const { id } = req.params;//pega da url
        const { nome, email, senha, telefone, chaveUnitaria, cpf, rg } = req.body;

        const user = await Users.findByPk(id);//se o findByPk n achar o id ele retorna null
        if(!user){
            res.status(404).json({"error":"user not found"})
            return
        }

        const updateData: any = {};//dicionario
         // Verifica cada campo individualmente e adiciona ao objeto de atualização se estiver definido
        if(nome !== undefined)updateData.nome = nome;
        if(email !== undefined)updateData.email = email;
        if(senha !== undefined)updateData.senhaHash = senha;
        if(telefone !== undefined)updateData.telefone = telefone;
        if(chaveUnitaria !== undefined)updateData.chaveUnitaria = chaveUnitaria;
        if(cpf !== undefined)updateData.cpf = cpf;
        if(rg !== undefined)updateData.rg = rg

        // ✅ CORRETO - Se vier senha, fazer hash antes de salvar
        if(senha !== undefined) {
            updateData.senhaHash = await crypto.hashArgon2(senha);
        }
        
        // Verifica se há campos para atualizar
        // Object.keys(updateData):
        // Retorna um array com as chaves do objeto
        // Exemplo: { nome: "João", email: "joao@email.com" } → ["nome", "email"]
        // Se o array estiver vazio, significa que nenhum campo foi fornecido
        if(Object.keys(updateData).length === 0 ){
            res.status(400).json({"error":"No fields provided for update"})
            return
        }

        // Atualiza o usuário
        // Primeiro parâmetro: dados para atualizar
        // Segundo parâmetro: condições (where) - quais registros atualizar
        await Users.update(updateData, {
            where: {id}
        })

        // Busca o usuário atualizado para retornar
        // Busca novamente o usuário para obter os dados atualizados
        const updatedUser = await Users.findByPk(id);
        res.status(200).json(updatedUser);
    }catch{
        res.status(400).json({"error":"error when updating"})
    }
}

export const deleteUserID = async (req:Request, res:Response) => {
    const { id } = req.params;

    const users = await Users.findByPk(id);//se o findByPk n achar o id ele retorna null
    if(!users){
        res.status(404).json({"error":"user not found"})
        return
    }
    
    await Users.destroy({where: {id}})
    res.status(200).json({"message":"sucess"})
}




export const getAccessVerification = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.chaveUnitaria) {
      return res.status(400).json({ error: "User has no unitary key" });
    }

    // Pega data/hora atual do sistema
    const nowUTC = new Date();
    // CORREÇÃO: Converte para horário de Brasília (UTC-3)
    const now = new Date(nowUTC.getTime() - 3 * 60 * 60 * 1000);

    // DEBUG: Mostra as datas que estão sendo usadas na busca
    console.log('=== DEBUG DATES ===');
    console.log('NOW UTC:', nowUTC);
    console.log('NOW UTC ISO:', nowUTC.toISOString());
    console.log('NOW BRASÍLIA:', now);
    console.log('NOW BRASÍLIA ISO:', now.toISOString());
    console.log('NOW Local:', now.toString());
    
    const windowStart = new Date(now.getTime() - 20 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 20 * 60 * 1000);
    
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    console.log('WINDOW START:', windowStart);
    console.log('WINDOW END:', windowEnd);
    console.log('START OF DAY:', startOfDay);
    console.log('END OF DAY:', endOfDay);

    // Busca TODOS os agendamentos do usuário para hoje (sem filtro de hora)
    const allSchedulingsToday = await Scheduling.findAll({
      where: {
        idUsuario: id,
        dataHora: {
          [Op.between]: [startOfDay, endOfDay]
        },
      },
    });

    if (!allSchedulingsToday || allSchedulingsToday.length === 0) {
      return res.status(404).json({ 
        message: "No scheduling found for this user today",
        debug: {
          now: now.toISOString(),
          startOfDay: startOfDay.toISOString(),
          endOfDay: endOfDay.toISOString()
        }
      });
    }

    // Agora filtra manualmente por hora
    const validScheduling = allSchedulingsToday.find(scheduling => {
      const schedulingTime = new Date(scheduling.dataHora);
      const timeDiff = Math.abs(schedulingTime.getTime() - now.getTime());
      const twentyMinutesInMs = 20 * 60 * 1000;
      
      
      return timeDiff <= twentyMinutesInMs;
    });


    if (!validScheduling) {
      return res.status(404).json({ 
        message: "No scheduling found within 20 minutes window",
        debug: {
          now: now.toISOString(),
          windowStart: windowStart.toISOString(),
          windowEnd: windowEnd.toISOString(),
          allSchedulings: allSchedulingsToday.map(s => ({
            id: s.id,
            dataHora: s.dataHora,
            dataHoraISO: new Date(s.dataHora).toISOString()
          }))
        }
      });
    }

    // ... resto do código
    if (!validScheduling.idEsp) {
      return res.status(400).json({ error: "Scheduling has no Esp associated" });
    }

    const lastRead = await Read.findOne({
      where: { idEsp: validScheduling.idEsp },
      order: [["createdAt", "DESC"]],
    });

    if (!lastRead) {
      return res.status(404).json({ message: "No recent read found for this Esp" });
    }



    if (lastRead.readKey !== user.chaveUnitaria) {
      return res.status(403).json({ message: "Access denied: key mismatch" });
    }

    return res.status(200).json({
      message: "Access granted",
      scheduling: validScheduling,
      lastRead
    });

  } catch (error: any) {
    console.error("Error in getAccessVerification:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};



export const patchAddKeytoUser = async (req:Request, res:Response) => {
    try {

    const { id_U, id_E } = req.params; // id_U = usuário, id_E = ESP

    // DEBUG: Log dos parâmetros recebidos
    console.log('=== DEBUG POST ADD KEY ===');
    console.log('User ID:', id_U);
    console.log('ESP ID:', id_E);

    // Verifica se o usuário existe
    const user = await Users.findByPk(id_U);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verifica se o ESP existe
    const esp = await Esp.findByPk(id_E);
    if (!esp) {
      return res.status(404).json({ error: "ESP not found" });
    }

    // Pega data/hora atual do sistema
    const nowUTC = new Date();
    // CORREÇÃO: Converte para horário de Brasília (UTC-3)
    const now = new Date(nowUTC.getTime() - 3 * 60 * 60 * 1000);

    // Calcula 5 minutos atrás no horário de Brasília
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

        // Busca a última leitura do ESP dos últimos 5 minutos
    const lastRead = await Read.findOne({
      where: { 
        idEsp: id_E,
        createdAt: {
          [Op.gte]: fiveMinutesAgo // Leitura feita há até 5 minutos (horário Brasília)
        }
      },
      order: [["createdAt", "DESC"]], // Pega a mais recente
    });

    console.log('LAST READ FOUND:', lastRead);

    if (!lastRead) {
      return res.status(404).json({ 
        error: "No recent read found for this ESP (within 5 minutes)",
        debug: {
          nowUTC: nowUTC.toISOString(),
          nowBrasilia: now.toISOString(),
          fiveMinutesAgo: fiveMinutesAgo.toISOString(),
          espId: id_E
        }
      });
    }

    // Verifica se a leitura tem uma chave
    if (!lastRead.readKey) {
      return res.status(400).json({ 
        error: "Recent read has no key",
        debug: {
          readId: lastRead.id,
          createdAt: lastRead.createdAt
        }
      });
    }

    // Atualiza a chave unitária do usuário com a chave da leitura
    user.chaveUnitaria = lastRead.readKey;
    await user.save();

      
        res.status(200).json({
      message: "Key successfully added to user",
      user: {
        id: user.id,
        nome: user.nome,
        chaveUnitaria: user.chaveUnitaria
      },
      read: {
        id: lastRead.id,
        readKey: lastRead.readKey,
        createdAt: lastRead.createdAt
      }
    });

    }catch(error: any){
      res.status(500).json({ 
        error: "Internal server error", 
        details: error.message 
      });
    }
}

// ========== FUNÇÕES DE AUTENTICAÇÃO ==========

/**
 * POST /users/login
 * Realiza login do usuário e cria sessão
 */
export const login = async (req: Request, res: Response) => {
    let httpResponse = null;
    let body = {};
    
    try {
        const { email, senha } = req.body;
        
        // Chama serviço de autenticação
        httpResponse = await authService.loginService(
            email, 
            senha, 
            "" + req.ip, 
            "" + req.get("User-Agent")
        );
        
        // Se login foi bem sucedido, configura cookies
        if (httpResponse.statusCode === 201) {
            res.cookie("refresh-token", httpResponse.body["refresh-token"], {
                httpOnly: true,    // Proteção XSS
                secure: process.env.NODE_ENV === "production", // HTTPS em produção
                sameSite: "lax",   // Proteção CSRF
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
            });
            
            // Retorna apenas access token no body
            body = { 
                "access-token": httpResponse.body["access-token"],
                "message": "Login realizado com sucesso"
            };
        } else {
            body = httpResponse.body;
        }
        
    } catch (error) {
        console.error('Erro no login:', error);
        httpResponse = await httpHelper.badRequest();
        body = { message: "Erro interno do servidor" };
    }

    res.status(httpResponse.statusCode).json(body);
}

/**
 * GET /user/getname  
 * Retorna informações do usuário autenticado (rota protegida)
 */
export const getName = async (req: Request, res: Response) => {
    try {
        let httpResponse = null;
        
        // Verifica autenticação
        const access = await authService.auth(req, res);
        
        if (access) {
            // Busca dados do usuário (sem informações sensíveis)
            const user = await Users.findByPk(access["userId"]);
            httpResponse = await httpHelper.ok({
                id: user?.id,
                nome: user?.nome,
                email: user?.email
            });
        } else {
            httpResponse = await httpHelper.unauthorized("Não autenticado");
        }
        
        res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
        console.error("Erro em getName:", error);
        const httpResponse = await httpHelper.badRequest();
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }
}

/**
 * GET /user/isAuthed
 * Verifica se o usuário está autenticado e renova tokens se necessário
 * Útil para front-end verificar estado da autenticação
 */
export const isAuthed = async (req: Request, res: Response) => {
    let httpResponse = null;
    
    const access = await authService.auth(req, res);
    
    if (access) {
        const bodyResponse = {} as { "access-token"?: string };
        
        // Se tokens foram renovados, retorna novo access token
        if (access["changed"]) {
            bodyResponse["access-token"] = access["access-token"];
        }
        
        httpResponse = await httpHelper.ok(bodyResponse);
    } else {
        httpResponse = await httpHelper.unauthorized("Não autenticado");
    }
    
    res.status(httpResponse.statusCode).json(httpResponse.body);
}

/**
 * POST /user/logout
 * Realiza logout do usuário (invalida a sessão)
 */
export const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies["refresh-token"];
        
        if (refreshToken) {
            // Invalida sessão no banco
            const refreshTokenHash = await crypto.sha256Hash(refreshToken);
            await PersistentSession.update(
                { valid: false, expiredAt: new Date() },
                { where: { refreshTokenHash: refreshTokenHash } }
            );
        }
        
        // Limpa cookie
        res.clearCookie("refresh-token");
        
        const httpResponse = await httpHelper.ok({ message: "Logout realizado com sucesso" });
        res.status(httpResponse.statusCode).json(httpResponse.body);
        
    } catch (error) {
        console.error('Erro no logout:', error);
        const httpResponse = await httpHelper.badRequest();
        res.status(httpResponse.statusCode).json(httpResponse.body);
    }
}