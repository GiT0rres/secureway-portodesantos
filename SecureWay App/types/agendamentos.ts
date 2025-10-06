// types/agendamento.ts

export interface Agendamento {
  id: string;
  motoristaId: string;
  motoristaNome: string;
  empresaId: string;
  empresaNome: string;
  data: string; // ISO string
  horario: string;
  status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado';
  endereco: string;
  observacoes?: string;
  // Dados do veículo
  veiculoMarca?: string;
  veiculoModelo?: string;
  veiculoPlaca?: string;
  veiculoCor?: string;
  createdAt: string;
}

export interface NovoAgendamento {
  motoristaId: string;
  motoristaNome: string;
  empresaId: string;
  empresaNome: string;
  data: string;
  horario: string;
  endereco: string;
  observacoes?: string;
  veiculoMarca?: string;
  veiculoModelo?: string;
  veiculoPlaca?: string;
  veiculoCor?: string;
}