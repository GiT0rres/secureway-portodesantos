import { Response, Request } from "express"
import { Enterprise } from "../models/enterpriseModel"

export const getEnterprise = async (req:Request, res:Response) => {
    try{
    const enterprises = await Enterprise.findAll()
    res.status(200).json(enterprises)
    }catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export const getEnterpriseID = async (req:Request, res:Response) => {
    const { id } = req.params;

    const enterprise = await Enterprise.findByPk(id);//se o findByPk n achar o id ele retorna null
    if(!enterprise){
        res.status(404).json({"error":"enterprise not found"})
        return
    }

    res.status(200).json(enterprise)
}

export const postEnterprise = async (req:Request, res:Response) => {
    try {
        const {nome, email, telefone, cnpj, senhaHash} = req.body
    if(!nome || !email || !telefone || !cnpj || !senhaHash){
        res.status(400).json({"error": "faltou coisa"}) 
        return 
    }

    await Enterprise.create({
        "nome": nome,
        "email": email,
        "telefone": telefone,
        "cnpj": cnpj,
        "senhaHash": senhaHash
    })
    res.status(201).json({"message":"success"})
    }catch(i){
        res.status(400).json({"error": i}) 
    }
}

export const patchEnterprise = async (req:Request, res:Response) =>{
    try{
       const { id } = req.params;//pega da url
        const { nome, email, telefone, cnpj, senhaHash } = req.body;

        const enterprise = await Enterprise.findByPk(id);//se o findByPk n achar o id ele retorna null
        if(!enterprise){
            res.status(404).json({"error":"enterprise not found"})
            return
        }

        const updateData: any = {};//dicionario
         // Verifica cada campo individualmente e adiciona ao objeto de atualização se estiver definido
        if(nome !== undefined) updateData.nome = nome;
        if(email !== undefined) updateData.email = email;
        if(telefone !== undefined) updateData.telefone = telefone;
        if(cnpj !== undefined) updateData.cnpj = cnpj;
        if(senhaHash !== undefined) updateData.senhaHash = senhaHash;

        // Verifica se há campos para atualizar
        // Object.keys(updateData):
        // Retorna um array com as chaves do objeto
        // Exemplo: { nome: "João", email: "joao@email.com" } → ["nome", "email"]
        // Se o array estiver vazio, significa que nenhum campo foi fornecido
        if(Object.keys(updateData).length === 0 ){
            res.status(400).json({"error":"No fields provided for update"})
            return
        }

        // Atualiza o enterprise
        // Primeiro parâmetro: dados para atualizar
        // Segundo parâmetro: condições (where) - quais registros atualizar
        await Enterprise.update(updateData, {
            where: {id}
        })

        // Busca o enterprise atualizado para retornar
        // Busca novamente o enterprise para obter os dados atualizados
        const updatedEnterprise = await Enterprise.findByPk(id);
        res.status(200).json(updatedEnterprise);
    }catch{
        res.status(400).json({"error":"error when updating"})
    }
}

export const deleteEnterpriseID = async (req:Request, res:Response) => {
    const { id } = req.params;

    const enterprise = await Enterprise.findByPk(id);//se o findByPk n achar o id ele retorna null
    if(!enterprise){
        res.status(404).json({"error":"enterprise not found"})
        return
    }
    
    await Enterprise.destroy({where: {id}})
    res.status(200).json({"message":"success"})
}