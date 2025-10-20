import { Response, Request } from "express"
import { Read } from "../models/readModel"

export const getRead = async (req: Request, res: Response) => {
    try {
        const read = await Read.findAll()
        res.status(200).json(read)
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

// Retorna read por ID
export const getReadId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const read = await Read.findByPk(id);

  if (!read) {
    return res.status(404).json({ error: "Scheduling not found" });
  }

  res.status(200).json(read);
};

// Cria novo read
export const postRead = async (req: Request, res: Response) => {
  try {
    const { readKey, idEsp } = req.body;

    if (!readKey || !idEsp) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newRead = await Read.create({
      readKey,
      idEsp,
    });

    res.status(200).json(newRead);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Atualiza read
export const patchRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { readKey, idEsp } = req.body;

    const read = await Read.findByPk(id);

    if (!read) {
      return res.status(404).json({ error: "Read not found" });
    }

      const updateData: any = {};//dicionario
      // Verifica cada campo individualmente e adiciona ao objeto de atualização se estiver definido
        if (readKey !== undefined) updateData.readKey = readKey;
        if (idEsp !== undefined) updateData.idEsp = idEsp;
    
      // Verifica se há campos para atualizar
      // Object.keys(updateData):
      // Retorna um array com as chaves do objeto
      // Exemplo: { nome: "João", email: "joao@email.com" } → ["nome", "email"]
      // Se o array estiver vazio, significa que nenhum campo foi fornecido
      if(Object.keys(updateData).length === 0 ){
        res.status(400).json({"error":"No fields provided for update"})
            return
      }
    
      // Atualiza o read
      // Primeiro parâmetro: dados para atualizar
      // Segundo parâmetro: condições (where) - quais registros atualizar
      await Read.update(updateData, {
        where: {id}
      })

      // Busca o read atualizado para retornar
      // Busca novamente o read para obter os dados atualizados
      const updated = await Read.findByPk(id);
      res.status(200).json(updated);
  } catch (err: any) {
    res.status(500).json({ "error": err.message });
  }
};


// Deleta read
export const deleteRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const read = await Read.findByPk(id);

  if (!read) {
    return res.status(404).json({ error: "Read not found" });
  }

  await read.destroy();
  res.status(200).json({ message: "Read deleted successfully" });
};