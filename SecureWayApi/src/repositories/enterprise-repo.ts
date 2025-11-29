// repositories/enterprise-repo.ts
import { Enterprise } from "../models/enterpriseModel";

export const findAllEnterprises = async () => {
  return await Enterprise.findAll();
};

export const findEnterpriseByID = async (id: number) => {
  return await Enterprise.findByPk(id);
};

export const findEnterpriseByFirebaseUid = async (firebaseUid: string) => {
  return await Enterprise.findOne({ where: { firebaseUid } });
};

export const findEnterpriseByCNPJ = async (cnpj: number) => {
  return await Enterprise.findOne({ where: { cnpj } });
};

export const findEnterpriseByEmail = async (email: string) => {
  return await Enterprise.findOne({ where: { email } });
};

export const createEnterprise = async (data: any) => {
  return await Enterprise.create({
    "firebaseUid": data.firebaseUid,
    "nome": data.nome,
    "email": data.email,
    "telefone": data.telefone,
    "cnpj": data.cnpj
  });
};

export const updateEnterprise = async (id: number, updateData: any) => {
  return await Enterprise.update(updateData, {
    where: { id }
  });
};

export const deleteEnterprise = async (id: number) => {
  const deleted = await Enterprise.destroy({ where: { id } });
  return deleted > 0;
};