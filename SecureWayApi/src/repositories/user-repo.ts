// repositories/user-repo.ts
import { Users } from "../models/userModel";

export const findAllUsers = async () => {
  return await Users.findAll();
};

export const findUserByID = async (id: number) => {
  return await Users.findByPk(id);
};

export const findUserByFirebaseUid = async (firebaseUid: string) => {
  return await Users.findOne({ where: { firebaseUid } });
};

export const findUserByEmail = async (email: string) => {
  return await Users.findOne({ where: { email } });
};

export const createUser = async (data: any) => {
  return await Users.create({
    "firebaseUid": data.firebaseUid,
    "nome": data.nome,
    "email": data.email,
    "telefone": data.telefone,
    "cpf": data.cpf || null,
    "rg": data.rg || null,
    "chaveUnitaria": data.chaveUnitaria || null
  });
};

export const updateUser = async (id: number, updateData: any) => {
  return await Users.update(updateData, {
    where: { id }
  });
};

export const updateChaveUnitaria = async (id: number, chaveUnitaria: number) => {
  return await Users.update(
    { chaveUnitaria },
    { where: { id } }
  );
};

export const findUserByChaveUnitaria = async (chaveUnitaria: number) => {
  return await Users.findOne({ where: { chaveUnitaria } });
};

export const deleteUser = async (id: number) => {
  const deleted = await Users.destroy({ where: { id } });
  return deleted > 0;
};