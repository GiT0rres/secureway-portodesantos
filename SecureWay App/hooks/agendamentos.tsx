// hooks/useAgendamentos.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { auth } from '../services/firebase.config';
import { agendamentoService } from '../services/AgendamentoService';
import { Agendamento, NovoAgendamento } from '../types/agendamentos';

interface UseAgendamentosReturn {
  agendamentos: Agendamento[];
  loading: boolean;
  error: string | null;
  criarAgendamento: (dados: NovoAgendamento) => Promise<boolean>;
  atualizarStatus: (id: string, status: Agendamento['status']) => Promise<boolean>;
  recarregar: () => Promise<void>;
  filtrarPorStatus: (status?: Agendamento['status']) => Agendamento[];
  agendamentosProximos: () => Agendamento[];
  agendamentosPassados: () => Agendamento[];
}

export function useAgendamentos(tipo: 'motorista' | 'empresa'): UseAgendamentosReturn {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarAgendamentos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      let dados: Agendamento[];
      if (tipo === 'motorista') {
        dados = await agendamentoService.buscarPorMotorista(user.uid);
      } else {
        dados = await agendamentoService.buscarPorEmpresa(user.uid);
      }

      setAgendamentos(dados);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao carregar agendamentos';
      setError(mensagem);
      console.error('Erro ao carregar agendamentos:', err);
    } finally {
      setLoading(false);
    }
  }, [tipo]);

  useEffect(() => {
    carregarAgendamentos();
  }, [carregarAgendamentos]);

  const criarAgendamento = async (dados: NovoAgendamento): Promise<boolean> => {
    try {
      setLoading(true);
      await agendamentoService.criar(dados);
      await carregarAgendamentos();
      Alert.alert('Sucesso!', 'Agendamento criado com sucesso');
      return true;
    } catch (err) {
      console.error('Erro ao criar agendamento:', err);
      Alert.alert('Erro', 'Não foi possível criar o agendamento');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (
    id: string, 
    status: Agendamento['status']
  ): Promise<boolean> => {
    try {
      setLoading(true);
      await agendamentoService.atualizarStatus(id, status);
      await carregarAgendamentos();
      Alert.alert('Sucesso!', 'Status atualizado com sucesso');
      return true;
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      Alert.alert('Erro', 'Não foi possível atualizar o status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const recarregar = async () => {
    await carregarAgendamentos();
  };

  const filtrarPorStatus = (status?: Agendamento['status']): Agendamento[] => {
    if (!status) return agendamentos;
    return agendamentos.filter(ag => ag.status === status);
  };

  const agendamentosProximos = (): Agendamento[] => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    return agendamentos.filter(ag => {
      const dataAgendamento = new Date(ag.data);
      return dataAgendamento >= hoje && ag.status !== 'cancelado' && ag.status !== 'concluido';
    }).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  };

  const agendamentosPassados = (): Agendamento[] => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    return agendamentos.filter(ag => {
      const dataAgendamento = new Date(ag.data);
      return dataAgendamento < hoje || ag.status === 'concluido' || ag.status === 'cancelado';
    }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  };

  return {
    agendamentos,
    loading,
    error,
    criarAgendamento,
    atualizarStatus,
    recarregar,
    filtrarPorStatus,
    agendamentosProximos,
    agendamentosPassados,
  };
}

// Hook auxiliar para estatísticas
export function useAgendamentosStats(agendamentos: Agendamento[]) {
  const total = agendamentos.length;
  const pendentes = agendamentos.filter(ag => ag.status === 'pendente').length;
  const confirmados = agendamentos.filter(ag => ag.status === 'confirmado').length;
  const concluidos = agendamentos.filter(ag => ag.status === 'concluido').length;
  const cancelados = agendamentos.filter(ag => ag.status === 'cancelado').length;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const proximos = agendamentos.filter(ag => {
    const dataAgendamento = new Date(ag.data);
    return dataAgendamento >= hoje && ag.status !== 'cancelado';
  }).length;

  const taxaConclusao = total > 0 
    ? ((concluidos / total) * 100).toFixed(1) 
    : '0.0';

  const taxaCancelamento = total > 0 
    ? ((cancelados / total) * 100).toFixed(1) 
    : '0.0';

  return {
    total,
    pendentes,
    confirmados,
    concluidos,
    cancelados,
    proximos,
    taxaConclusao: parseFloat(taxaConclusao),
    taxaCancelamento: parseFloat(taxaCancelamento),
  };
}