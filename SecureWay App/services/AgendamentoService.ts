// services/agendamentoService.ts
import { db } from './firebase.config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { Agendamento, NovoAgendamento } from '../types/agendamentos';

export const agendamentoService = {
  /**
   * Criar novo agendamento
   */
  async criar(dados: NovoAgendamento): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'agendamentos'), {
        ...dados,
        status: 'pendente',
        createdAt: Timestamp.now().toDate().toISOString(),
      });
      
      console.log('Agendamento criado com ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  },

  /**
   * Buscar agendamentos por motorista
   */
  async buscarPorMotorista(motoristaId: string): Promise<Agendamento[]> {
    try {
      const q = query(
        collection(db, 'agendamentos'),
        where('motoristaId', '==', motoristaId),
        orderBy('data', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const agendamentos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Agendamento));
      
      console.log(`Encontrados ${agendamentos.length} agendamentos para o motorista`);
      return agendamentos;
    } catch (error) {
      console.error('Erro ao buscar agendamentos do motorista:', error);
      throw error;
    }
  },

  /**
   * Buscar agendamentos por empresa
   */
  async buscarPorEmpresa(empresaId: string): Promise<Agendamento[]> {
    try {
      const q = query(
        collection(db, 'agendamentos'),
        where('empresaId', '==', empresaId),
        orderBy('data', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const agendamentos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Agendamento));
      
      console.log(`Encontrados ${agendamentos.length} agendamentos para a empresa`);
      return agendamentos;
    } catch (error) {
      console.error('Erro ao buscar agendamentos da empresa:', error);
      throw error;
    }
  },

  /**
   * Buscar todos os agendamentos (admin)
   */
  async buscarTodos(): Promise<Agendamento[]> {
    try {
      const q = query(
        collection(db, 'agendamentos'),
        orderBy('data', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Agendamento));
    } catch (error) {
      console.error('Erro ao buscar todos os agendamentos:', error);
      throw error;
    }
  },

  /**
   * Atualizar status do agendamento
   */
  async atualizarStatus(
    agendamentoId: string, 
    status: Agendamento['status']
  ): Promise<void> {
    try {
      const docRef = doc(db, 'agendamentos', agendamentoId);
      await updateDoc(docRef, { 
        status,
        updatedAt: Timestamp.now().toDate().toISOString()
      });
      
      console.log(`Status do agendamento ${agendamentoId} atualizado para ${status}`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  },

  /**
   * Atualizar dados do agendamento
   */
  async atualizar(
    agendamentoId: string, 
    dados: Partial<Agendamento>
  ): Promise<void> {
    try {
      const docRef = doc(db, 'agendamentos', agendamentoId);
      await updateDoc(docRef, {
        ...dados,
        updatedAt: Timestamp.now().toDate().toISOString()
      });
      
      console.log(`Agendamento ${agendamentoId} atualizado`);
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      throw error;
    }
  },

  /**
   * Deletar agendamento
   */
  async deletar(agendamentoId: string): Promise<void> {
    try {
      const docRef = doc(db, 'agendamentos', agendamentoId);
      await deleteDoc(docRef);
      
      console.log(`Agendamento ${agendamentoId} deletado`);
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      throw error;
    }
  },

  /**
   * Buscar todos os motoristas (para empresa selecionar)
   */
  async buscarMotoristas(): Promise<any[]> {
    try {
      const q = query(
        collection(db, 'usuarios'),
        where('tipo', '==', 'motorista')
      );
      
      const snapshot = await getDocs(q);
      const motoristas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`Encontrados ${motoristas.length} motoristas`);
      return motoristas;
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
      throw error;
    }
  },

  /**
   * Buscar todas as empresas (para motorista selecionar)
   */
  async buscarEmpresas(): Promise<any[]> {
    try {
      const q = query(
        collection(db, 'usuarios'),
        where('tipo', '==', 'empresa')
      );
      
      const snapshot = await getDocs(q);
      const empresas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`Encontradas ${empresas.length} empresas`);
      return empresas;
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      throw error;
    }
  },

  /**
   * Buscar agendamentos por data
   */
  async buscarPorData(data: Date): Promise<Agendamento[]> {
    try {
      const inicioDia = new Date(data);
      inicioDia.setHours(0, 0, 0, 0);
      
      const fimDia = new Date(data);
      fimDia.setHours(23, 59, 59, 999);
      
      const q = query(
        collection(db, 'agendamentos'),
        where('data', '>=', inicioDia.toISOString()),
        where('data', '<=', fimDia.toISOString())
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Agendamento));
    } catch (error) {
      console.error('Erro ao buscar agendamentos por data:', error);
      throw error;
    }
  },

  /**
   * Buscar agendamentos por status
   */
  async buscarPorStatus(status: Agendamento['status']): Promise<Agendamento[]> {
    try {
      const q = query(
        collection(db, 'agendamentos'),
        where('status', '==', status),
        orderBy('data', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Agendamento));
    } catch (error) {
      console.error('Erro ao buscar agendamentos por status:', error);
      throw error;
    }
  }
};