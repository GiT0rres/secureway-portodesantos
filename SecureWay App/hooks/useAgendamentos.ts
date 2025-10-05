// hooks/useAgendamentos.ts
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy 
} from 'firebase/firestore';
import { db, auth } from '../services/firebase.config';

interface Agendamento {
  id: string;
  motoristaId: string;
  empresaNome: string;
  data: string;
  status: string;
  [key: string]: any;
}

export function useAgendamentos(tipoUsuario: 'motorista' | 'empresa') {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Definimos o campo correto para filtrar
    const campoFiltro = tipoUsuario === 'motorista' ? 'motoristaId' : 'empresaId';

    const q = query(
      collection(db, 'agendamentos'),
      where(campoFiltro, '==', user.uid),
      orderBy('data', 'desc') // organiza os mais recentes primeiro
    );

    // 🔥 onSnapshot faz streaming em tempo real
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const lista: Agendamento[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Agendamento[];
        setAgendamentos(lista);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao buscar agendamentos do Firestore:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // limpa o listener quando o componente desmontar
  }, [tipoUsuario]);

  // 🚛 Agendamentos ativos (não finalizados)
  const agendamentosAtivos = () =>
    agendamentos.filter(
      (ag) => ag.status !== 'concluido' && ag.status !== 'cancelado'
    );

  // 🕓 Agendamentos passados (histórico)
  const agendamentosPassados = () =>
    agendamentos.filter(
      (ag) => ag.status === 'concluido' || ag.status === 'cancelado'
    );

  return { agendamentosAtivos, agendamentosPassados, loading };
}
