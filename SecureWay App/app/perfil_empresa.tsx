import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from 'expo-router';
import BottomNav from "@/components/BottomNav";
import { auth, db } from '../services/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { agendamentoService } from '../services/AgendamentoService';
import { Agendamento } from '../types/agendamentos';

interface EmpresaData {
  nomeCompleto: string;
  email: string;
  telefone: string;
  cnpj?: string;
  tipo: string;
  sedes?: Array<{
    id: number;
    nome: string;
    endereco: string;
  }>;
  horarios?: Array<{
    id: number;
    dia: string;
    horas: string;
  }>;
}

export default function PerfilEmpresa() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState("Sedes");
  const [empresaData, setEmpresaData] = useState<EmpresaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(false);
  const [showAgendarModal, setShowAgendarModal] = useState(false);
  const [motoristas, setMotoristas] = useState<any[]>([]);
  const [showMotoristaModal, setShowMotoristaModal] = useState(false);

  // Formulário de agendamento
  const [motoristaSelecionado, setMotoristaSelecionado] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [horario, setHorario] = useState('');
  const [endereco, setEndereco] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const sedesPadrao = [
    { id: 1, nome: "Unidade Centro", endereco: "Rua A, 123 - Centro" },
    { id: 2, nome: "Unidade Norte", endereco: "Av. Central, 456 - Norte" },
    { id: 3, nome: "Unidade Sul", endereco: "Rua das Flores, 789 - Sul" },
  ];

  const horariosPadrao = [
    { id: 1, dia: "Segunda a Sexta", horas: "08:00 - 20:00" },
    { id: 2, dia: "Sábado", horas: "09:00 - 14:00" },
    { id: 3, dia: "Domingo", horas: "Fechado" },
  ];

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  useEffect(() => {
    carregarDadosEmpresa();
    carregarMotoristas();
  }, []);

  useEffect(() => {
    if (abaAtiva === "Agendamentos") {
      carregarAgendamentos();
    }
  }, [abaAtiva]);

  const carregarDadosEmpresa = async () => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        router.replace('/');
        return;
      }

      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setEmpresaData(docSnap.data() as EmpresaData);
      } else {
        Alert.alert('Erro', 'Dados da empresa não encontrados');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const carregarAgendamentos = async () => {
    try {
      setLoadingAgendamentos(true);
      const user = auth.currentUser;
      if (!user) return;

      const dados = await agendamentoService.buscarPorEmpresa(user.uid);
      setAgendamentos(dados);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os agendamentos');
    } finally {
      setLoadingAgendamentos(false);
    }
  };

  const carregarMotoristas = async () => {
    try {
      const lista = await agendamentoService.buscarMotoristas();
      setMotoristas(lista);
    } catch (error) {
      console.error('Erro ao carregar motoristas:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/');
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Não foi possível sair');
            }
          }
        }
      ]
    );
  };

  const handleAgendar = async () => {
    if (!motoristaSelecionado) {
      Alert.alert('Atenção', 'Selecione um motorista');
      return;
    }
    if (!horario.trim()) {
      Alert.alert('Atenção', 'Informe o horário');
      return;
    }
    if (!endereco.trim()) {
      Alert.alert('Atenção', 'Informe o endereço');
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      const novoAgendamento = {
        motoristaId: motoristaSelecionado.id,
        motoristaNome: motoristaSelecionado.nomeCompleto,
        empresaId: user.uid,
        empresaNome: empresaData?.nomeCompleto || '',
        data: selectedDate.toISOString(),
        horario: horario,
        endereco: endereco,
        observacoes: observacoes,
        veiculoMarca: motoristaSelecionado.marca,
        veiculoModelo: motoristaSelecionado.modelo,
        veiculoPlaca: motoristaSelecionado.placa,
        veiculoCor: motoristaSelecionado.cor,
      };

      await agendamentoService.criar(novoAgendamento);
      
      Alert.alert('Sucesso!', 'Agendamento realizado com sucesso');
      setShowAgendarModal(false);
      setMotoristaSelecionado(null);
      setHorario('');
      setEndereco('');
      setObservacoes('');
      setSelectedDate(new Date());
      
      if (abaAtiva === "Agendamentos") {
        carregarAgendamentos();
      }
    } catch (error) {
      console.error('Erro ao agendar:', error);
      Alert.alert('Erro', 'Não foi possível realizar o agendamento');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string | undefined) => {
    if (!name || name.trim() === '') return '??';
    
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return '#FFA500';
      case 'confirmado': return '#4CAF50';
      case 'concluido': return '#2196F3';
      case 'cancelado': return '#F44336';
      default: return '#999';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'confirmado': return 'Confirmado';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const isSelectedDate = (day: number | null) => {
    if (!day) return false;
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return (
      checkDate.getDate() === selectedDate.getDate() &&
      checkDate.getMonth() === selectedDate.getMonth() &&
      checkDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDayPress = (day: number | null) => {
    if (day) {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      setSelectedDate(newDate);
    }
  };

  const changeMonth = (increment: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#55777c" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  const sedes = empresaData?.sedes || sedesPadrao;
  const horarios = empresaData?.horarios || horariosPadrao;
  const days = getDaysInMonth(currentMonth);

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={handleLogout}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(empresaData?.nomeCompleto)}
              </Text>
            </View>
            
            <Text style={styles.nome}>
              {empresaData?.nomeCompleto || 'Nome não disponível'}
            </Text>
            
            <View style={styles.funcaoBox}>
              <Text style={styles.funcao}>Empresa</Text>
            </View>

            {empresaData?.cnpj && (
              <Text style={styles.cnpj}>
                CNPJ: {empresaData.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')}
              </Text>
            )}
          </View>

          {/* Info Cards */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>{empresaData?.email || '-'}</Text>
            </View>
            
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Telefone</Text>
              <Text style={styles.infoValue}>
                {empresaData?.telefone ? 
                  `(${empresaData.telefone.slice(0, 2)}) ${empresaData.telefone.slice(2, 7)}-${empresaData.telefone.slice(7)}` 
                  : '-'}
              </Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setAbaAtiva("Sedes")}
            >
              <Text
                style={[
                  styles.tabText,
                  abaAtiva === "Sedes" && styles.tabTextAtivo,
                ]}
              >
                Sedes
              </Text>
              {abaAtiva === "Sedes" && <View style={styles.tabUnderline} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setAbaAtiva("Horários")}
            >
              <Text
                style={[
                  styles.tabText,
                  abaAtiva === "Horários" && styles.tabTextAtivo,
                ]}
              >
                Horários
              </Text>
              {abaAtiva === "Horários" && <View style={styles.tabUnderline} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setAbaAtiva("Agendamentos")}
            >
              <Text
                style={[
                  styles.tabText,
                  abaAtiva === "Agendamentos" && styles.tabTextAtivo,
                ]}
              >
                Agendamentos
              </Text>
              {abaAtiva === "Agendamentos" && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          </View>

          {/* Conteúdo condicional */}
          <View style={styles.content}>
            {abaAtiva === "Sedes" &&
              sedes.map((sede) => (
                <View key={sede.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{sede.nome}</Text>
                  <Text style={styles.cardText}>{sede.endereco}</Text>
                </View>
              ))}

            {abaAtiva === "Horários" &&
              horarios.map((horario) => (
                <View key={horario.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{horario.dia}</Text>
                  <Text style={styles.cardText}>{horario.horas}</Text>
                </View>
              ))}

            {abaAtiva === "Agendamentos" && (
              <>
                <TouchableOpacity 
                  style={styles.novoAgendamentoButton}
                  onPress={() => setShowAgendarModal(true)}
                >
                  <Text style={styles.novoAgendamentoText}>➕ Novo Agendamento</Text>
                </TouchableOpacity>

                {loadingAgendamentos ? (
                  <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#55777c" />
                  </View>
                ) : agendamentos.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📦</Text>
                    <Text style={styles.emptyText}>Nenhum agendamento</Text>
                    <Text style={styles.emptySubtext}>
                      Clique em "Novo Agendamento" para começar
                    </Text>
                  </View>
                ) : (
                  agendamentos.map((agendamento) => (
                    <View key={agendamento.id} style={styles.agendamentoCard}>
                      <View style={styles.agendamentoHeader}>
                        <View style={styles.agendamentoHeaderLeft}>
                          <Text style={styles.agendamentoMotorista}>
                            {agendamento.motoristaNome}
                          </Text>
                          <Text style={styles.agendamentoVeiculo}>
                            🚛 {agendamento.veiculoMarca} {agendamento.veiculoModelo}
                            {agendamento.veiculoPlaca && 
                              ` • ${agendamento.veiculoPlaca.slice(0, 3)}-${agendamento.veiculoPlaca.slice(3)}`
                            }
                          </Text>
                        </View>
                        <View style={[
                          styles.statusBadge, 
                          { backgroundColor: getStatusColor(agendamento.status) }
                        ]}>
                          <Text style={styles.statusText}>
                            {getStatusText(agendamento.status)}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.agendamentoInfo}>
                        <Text style={styles.agendamentoLabel}>📅 Data:</Text>
                        <Text style={styles.agendamentoValue}>
                          {formatarData(agendamento.data)} às {agendamento.horario}
                        </Text>
                      </View>

                      <View style={styles.agendamentoInfo}>
                        <Text style={styles.agendamentoLabel}>📍 Endereço:</Text>
                        <Text style={styles.agendamentoValue}>
                          {agendamento.endereco}
                        </Text>
                      </View>

                      {agendamento.observacoes && (
                        <View style={styles.agendamentoInfo}>
                          <Text style={styles.agendamentoLabel}>📝 Observações:</Text>
                          <Text style={styles.agendamentoValue}>
                            {agendamento.observacoes}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))
                )}
              </>
            )}
          </View>
        </ScrollView>

        {/* Modal de Novo Agendamento */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAgendarModal}
          onRequestClose={() => setShowAgendarModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.agendarModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Novo Agendamento</Text>
                <TouchableOpacity onPress={() => setShowAgendarModal(false)}>
                  <Text style={styles.closeModalButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.formScroll}>
                {/* Seleção de Motorista */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Motorista *</Text>
                  <TouchableOpacity 
                    style={styles.selectInput}
                    onPress={() => setShowMotoristaModal(true)}
                  >
                    <Text style={styles.selectInputText}>
                      {motoristaSelecionado ? motoristaSelecionado.nomeCompleto : 'Selecione o motorista'}
                    </Text>
                    <Text style={styles.selectArrow}>▼</Text>
                  </TouchableOpacity>
                  {motoristaSelecionado?.marca && (
                    <Text style={styles.veiculoInfo}>
                      🚛 {motoristaSelecionado.marca} {motoristaSelecionado.modelo}
                      {motoristaSelecionado.placa && 
                        ` • ${motoristaSelecionado.placa.slice(0, 3)}-${motoristaSelecionado.placa.slice(3)}`
                      }
                    </Text>
                  )}
                </View>

                {/* Data */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Data *</Text>
                  <TouchableOpacity 
                    style={styles.dateInput}
                    onPress={() => setShowCalendar(true)}
                  >
                    <Text style={styles.dateInputText}>
                      📅 {selectedDate.toLocaleDateString('pt-BR')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Horário */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Horário *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ex: 14:00"
                    placeholderTextColor="#a0c4c4"
                    value={horario}
                    onChangeText={setHorario}
                  />
                </View>

                {/* Endereço */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Endereço *</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="Digite o endereço completo"
                    placeholderTextColor="#a0c4c4"
                    value={endereco}
                    onChangeText={setEndereco}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {/* Observações */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Observações</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="Informações adicionais (opcional)"
                    placeholderTextColor="#a0c4c4"
                    value={observacoes}
                    onChangeText={setObservacoes}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <TouchableOpacity 
                  style={styles.confirmarButton}
                  onPress={handleAgendar}
                >
                  <Text style={styles.confirmarButtonText}>Confirmar Agendamento</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal de Seleção de Motorista */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showMotoristaModal}
          onRequestClose={() => setShowMotoristaModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.motoristaModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Selecione o Motorista</Text>
                <TouchableOpacity onPress={() => setShowMotoristaModal(false)}>
                  <Text style={styles.closeModalButton}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.motoristaList}>
                {motoristas.map((motorista) => (
                  <TouchableOpacity
                    key={motorista.id}
                    style={styles.motoristaItem}
                    onPress={() => {
                      setMotoristaSelecionado(motorista);
                      setShowMotoristaModal(false);
                    }}
                  >
                    <Text style={styles.motoristaItemNome}>{motorista.nomeCompleto}</Text>
                    {motorista.marca && (
                      <Text style={styles.motoristaItemVeiculo}>
                        🚛 {motorista.marca} {motorista.modelo}
                        {motorista.placa && ` • ${motorista.placa.slice(0, 3)}-${motorista.placa.slice(3)}`}
                      </Text>
                    )}
                    <Text style={styles.motoristaItemTelefone}>
                      📞 {motorista.telefone ? 
                        `(${motorista.telefone.slice(0, 2)}) ${motorista.telefone.slice(2, 7)}-${motorista.telefone.slice(7)}` 
                        : '-'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal do Calendário */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showCalendar}
          onRequestClose={() => setShowCalendar(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.calendarCard}>
              <Text style={styles.selectDateLabel}>Selecione a data</Text>
              
              <View style={styles.selectedDateContainer}>
                <Text style={styles.selectedDateText}>
                  {selectedDate.toLocaleDateString('pt-BR')}
                </Text>
              </View>

              <View style={styles.monthNavigation}>
                <TouchableOpacity onPress={() => changeMonth(-1)}>
                  <Text style={styles.navArrow}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.monthYear}>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </Text>
                <TouchableOpacity onPress={() => changeMonth(1)}>
                  <Text style={styles.navArrow}>›</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.weekDays}>
                {dayNames.map((day, index) => (
                  <Text key={index} style={styles.weekDay}>{day}</Text>
                ))}
              </View>

              <View style={styles.daysGrid}>
                {days.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayCell,
                      !day && styles.emptyCell,
                      isSelectedDate(day) && styles.selectedDay
                    ]}
                    onPress={() => handleDayPress(day)}
                    disabled={!day}
                  >
                    {day && (
                      <Text style={[
                        styles.dayText,
                        isSelectedDate(day) && styles.selectedDayText
                      ]}>
                        {day}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => setShowCalendar(false)}>
                  <Text style={styles.cancelButton}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowCalendar(false)}>
                  <Text style={styles.okButton}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <View>
        <BottomNav />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001f2d",
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#55777c',
    marginTop: 12,
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#55777c",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 8,
    zIndex: 10,
  },
  settingsIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  avatar: {
    width: 120,
    height: 80,
    backgroundColor: "#3c5656",
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  funcaoBox: {
    backgroundColor: "#d4e4e4",
    borderRadius: 20,
    paddingHorizontal: 45,
    paddingVertical: 6,
  },
  funcao: {
    color: "#0a3d3d",
    fontWeight: "bold",
  },
  cnpj: {
    fontSize: 12,
    color: '#d0e0e0',
    marginTop: 8,
  },
  infoSection: {
    padding: 16,
    gap: 12,
  },
  infoCard: {
    backgroundColor: '#0f4a4a',
    borderRadius: 12,
    padding: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#a0c4c4',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#001f2d",
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#55777c",
  },
  tabItem: {
    alignItems: "center",
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 14,
    color: "#b8d8d8",
  },
  tabTextAtivo: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  tabUnderline: {
    marginTop: 4,
    height: 2,
    width: "80%",
    backgroundColor: "#3694AD",
    borderRadius: 2,
  },
  content: {
    marginTop: 20,
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#0f4a4a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  cardText: {
    color: "#d4e4e4",
    fontSize: 14,
  },
  novoAgendamentoButton: {
    backgroundColor: '#3694AD',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  novoAgendamentoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emptyContainer: {
    backgroundColor: '#0f4a4a',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#a0c4c4',
    textAlign: 'center',
  },
  agendamentoCard: {
    backgroundColor: '#0f4a4a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3694AD',
  },
  agendamentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  agendamentoHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  agendamentoMotorista: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  agendamentoVeiculo: {
    fontSize: 12,
    color: '#a0c4c4',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  agendamentoInfo: {
    marginBottom: 8,
  },
  agendamentoLabel: {
    fontSize: 12,
    color: '#a0c4c4',
    marginBottom: 2,
  },
  agendamentoValue: {
    fontSize: 14,
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  agendarModal: {
    backgroundColor: '#134949',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a5555',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeModalButton: {
    fontSize: 24,
    color: '#a0c4c4',
  },
  formScroll: {
    maxHeight: 500,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a0c4c4',
    marginBottom: 8,
  },
  selectInput: {
    backgroundColor: '#0f4a4a',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1a5555',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectInputText: {
    fontSize: 16,
    color: '#ffffff',
  },
  selectArrow: {
    fontSize: 12,
    color: '#a0c4c4',
  },
  veiculoInfo: {
    fontSize: 12,
    color: '#a0c4c4',
    marginTop: 6,
  },
  dateInput: {
    backgroundColor: '#0f4a4a',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1a5555',
  },
  dateInputText: {
    fontSize: 16,
    color: '#ffffff',
  },
  textInput: {
    backgroundColor: '#0f4a4a',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#1a5555',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  confirmarButton: {
    backgroundColor: '#3694AD',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmarButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  motoristaModal: {
    backgroundColor: '#134949',
    borderRadius: 16,
    width: '100%',
    maxHeight: '70%',
    padding: 20,
  },
  motoristaList: {
    maxHeight: 400,
  },
  motoristaItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a5555',
  },
  motoristaItemNome: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 4,
  },
  motoristaItemVeiculo: {
    fontSize: 12,
    color: '#a0c4c4',
    marginBottom: 2,
  },
  motoristaItemTelefone: {
    fontSize: 12,
    color: '#a0c4c4',
  },
  calendarCard: {
    backgroundColor: '#b8d8d8',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  selectDateLabel: {
    fontSize: 12,
    color: '#0a3d3d',
    marginBottom: 8,
  },
  selectedDateContainer: {
    marginBottom: 20,
  },
  selectedDateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a3d3d',
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navArrow: {
    fontSize: 24,
    color: '#0a3d3d',
    paddingHorizontal: 12,
  },
  monthYear: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0a3d3d',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekDay: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0a3d3d',
    width: 40,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  emptyCell: {
    backgroundColor: 'transparent',
  },
  selectedDay: {
    backgroundColor: '#4a9a9a',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: '#0a3d3d',
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#a0c4c4',
  },
  cancelButton: {
    fontSize: 14,
    color: '#4a9a9a',
    fontWeight: '600',
  },
  okButton: {
    fontSize: 14,
    color: '#4a9a9a',
    fontWeight: 'bold',
  },
});