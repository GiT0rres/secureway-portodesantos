import { Response, Request } from "express"
import { Scheduling } from "../models/schedulingModel"

export const getScheduling = async (req: Request, res: Response) => {
    try {
        const scheduling = await Scheduling.findAll()
        res.status(200).json(scheduling)
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

// Retorna agendamento por ID
export const getSchedulingId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const scheduling = await Scheduling.findByPk(id);

  if (!scheduling) {
    return res.status(404).json({ error: "Scheduling not found" });
  }

  res.status(200).json(scheduling);
};

// Cria novo agendamento
export const postScheduling = async (req: Request, res: Response) => {
  try {
    const { local, empresa, carga, dataHora, finalizado, idUsuario, idEsp } = req.body;

    if (!local || !empresa || !carga || !dataHora || !idUsuario || !idEsp ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newScheduling = await Scheduling.create({
      local,
      empresa,
      carga,
      dataHora,
      finalizado,
      idUsuario,
      idEsp,
    });

    res.status(200).json(newScheduling);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Atualiza agendamento
export const patchScheduling = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { local, empresa, carga, dataHora, finalizado, idUsuario, idEsp } = req.body;

    const scheduling = await Scheduling.findByPk(id);

    if (!scheduling) {
      return res.status(404).json({ error: "Scheduling not found" });
    }

      const updateData: any = {};//dicionario
      // Verifica cada campo individualmente e adiciona ao objeto de atualização se estiver definido
        if (local !== undefined) updateData.local = local;
        if (empresa !== undefined) updateData.empresa = empresa;
        if (carga !== undefined) updateData.carga = carga;
        if (dataHora !== undefined) updateData.dataHora = dataHora;
        if (finalizado !== undefined) updateData.finalizado = finalizado;
        if (idUsuario !== undefined) updateData.idUsuario = idUsuario;
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
    
      // Atualiza o Scheduling
      // Primeiro parâmetro: dados para atualizar
      // Segundo parâmetro: condições (where) - quais registros atualizar
      await Scheduling.update(updateData, {
        where: {id}
      })

      // Busca o usuário atualizado para retornar
      // Busca novamente o usuário para obter os dados atualizados
      const updated = await Scheduling.findByPk(id);
      res.status(200).json(updated);
  } catch (err: any) {
    res.status(500).json({ "error": err.message });
  }
};

// Deleta agendamento
export const deleteScheduling = async (req: Request, res: Response) => {
  const { id } = req.params;
  const scheduling = await Scheduling.findByPk(id);

  if (!scheduling) {
    return res.status(404).json({ error: "Scheduling not found" });
  }

  await scheduling.destroy();
  res.status(200).json({ message: "Scheduling deleted successfully" });
};