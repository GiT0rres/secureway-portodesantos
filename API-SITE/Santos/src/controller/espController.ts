import { Response, Request } from "express"
import { Esp } from "../models/espModel"

export const getEsp = async (req:Request, res:Response) => {
    try{
    const esp = await Esp.findAll()
    res.status(200).json(esp)
    }catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export const getEspID = async (req:Request, res:Response) => {
    const { id } = req.params;

    const esp = await Esp.findByPk(id);//se o findByPk n achar o id ele retorna null
    if(!esp){
        res.status(404).json({"error":"user not found"})
        return
    }

    res.status(200).json(esp)
}

export const postEsp = async (req:Request, res:Response) => {
    try {
        const {nome, local} = req.body
    if(!nome || !local){
        res.status(400).json({"error": "faltou coisa"}) 
        return 
    }

    await Esp.create({
        "nome":nome,
        "local":local
    })
    res.status(201).json({"message":"sucess"})
    }catch(i){
        res.status(400).json({"error": i}) 
    }
}


export const patchEsp = async (req:Request, res:Response) =>{
    try{
       const { id } = req.params;//pega da url
        const { nome, local } = req.body;

        const esp = await Esp.findByPk(id);//se o findByPk n achar o id ele retorna null
        if(!esp){
            res.status(404).json({"error":"esp not found"})
            return
        }

        const updateData: any = {};//dicionario
         // Verifica cada campo individualmente e adiciona ao objeto de atualização se estiver definido
        if(nome !== undefined)updateData.nome = nome;
        if(local !== undefined)updateData.local = local;

        // Verifica se há campos para atualizar
        // Object.keys(updateData):
        // Retorna um array com as chaves do objeto
        // Exemplo: { nome: "João", email: "joao@email.com" } → ["nome", "email"]
        // Se o array estiver vazio, significa que nenhum campo foi fornecido
        if(Object.keys(updateData).length === 0 ){
            res.status(400).json({"error":"No fields provided for update"})
            return
        }

        // Atualiza o esp
        // Primeiro parâmetro: dados para atualizar
        // Segundo parâmetro: condições (where) - quais registros atualizar
        await Esp.update(updateData, {
            where: {id}
        })

        // Busca o esp atualizado para retornar
        // Busca novamente o esp para obter os dados atualizados
        const updatedUser = await Esp.findByPk(id);
        res.status(200).json(updatedUser);
    }catch{
        res.status(400).json({"error":"error when updating"})
    }
}


export const deleteEspID = async (req:Request, res:Response) => {
    const { id } = req.params;

    const esp = await Esp.findByPk(id);//se o findByPk n achar o id ele retorna null
    if(!esp){
        res.status(404).json({"error":"user not found"})
        return
    }
    
    await Esp.destroy({where: {id}})
    res.status(200).json({"message":"sucess"})
}