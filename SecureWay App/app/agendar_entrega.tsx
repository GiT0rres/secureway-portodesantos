import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '@/components/BottomNav';
import { auth, db } from '../services/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { agendamentoService } from '../services/AgendamentoService'; // 🔧 Certifique-se de que o nome está exatamente assim (tudo minúsculo)

export default function AgendarEntrega() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  
  // Dados do formulário
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<any>(null);
  const [horario, setHorario] = useState('');
  const [endereco, setEndereco] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoadingEmpresas(true);
      const user = auth.currentUser;
      if (!user) {
        router.replace('/');
        return;
      }

      // Carregar dados do usuário
      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData({ id: user.uid, ...docSnap.data() });
      }

      // 🔍 Log de debug para Firestore
      console.log('📡 Buscando empresas no Firestore...');
      const listaEmpresas = await agendamentoService.buscarEmpresas();
      console.log('✅ Empresas encontradas:', listaEmpresas);

      setEmpresas(listaEmpresas);
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoadingEmpresas(false);
    }
  };

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
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

  const formatSelectedDate = () => selectedDate.toLocaleDateString('pt-BR');

  const handleAgendar = async () => {
    if (!empresaSelecionada) return Alert.alert('Atenção', 'Selecione uma empresa');
    if (!horario.trim()) return Alert.alert('Atenção', 'Informe o horário');
    if (!endereco.trim()) return Alert.alert('Atenção', 'Informe o endereço');

    try {
      setLoading(true);
      const novoAgendamento = {
        motoristaId: userData.id,
        motoristaNome: userData.nomeCompleto,
        empresaId: empresaSelecionada.id,
        empresaNome: empresaSelecionada.nomeCompleto,
        data: selectedDate.toISOString(),
        horario,
        endereco,
        observacoes,
        veiculoMarca: userData.marca,
        veiculoModelo: userData.modelo,
        veiculoPlaca: userData.placa,
        veiculoCor: userData.cor,
      };

      await agendamentoService.criar(novoAgendamento);
      Alert.alert('Sucesso!', 'Agendamento realizado com sucesso', [
        {
          text: 'OK',
          onPress: () => {
            setEmpresaSelecionada(null);
            setHorario('');
            setEndereco('');
            setObservacoes('');
            setSelectedDate(new Date());
          },
        },
      ]);
    } catch (error) {
      console.error('Erro ao agendar:', error);
      Alert.alert('Erro', 'Não foi possível realizar o agendamento');
    } finally {
      setLoading(false);
    }
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />
      
      <View style={styles.header}>
        <Text style={styles.title}>SecureWay</Text>
        <Text style={styles.subtitle}>Agende sua entrega</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          
          {/* Seleção de Empresa */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Empresa *</Text>
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => setShowEmpresaModal(true)}
            >
              <Text style={styles.selectButtonText}>
                {empresaSelecionada ? empresaSelecionada.nomeCompleto : 'Selecione a empresa'}
              </Text>
              <Text style={styles.selectArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Data */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data *</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.dateButtonText}>📅 {formatSelectedDate()}</Text>
            </TouchableOpacity>
          </View>

          {/* Horário */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Horário *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 14:00"
              placeholderTextColor="#a0c4c4"
              value={horario}
              onChangeText={setHorario}
            />
          </View>

          {/* Endereço */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço de Entrega *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
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
            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Informações adicionais (opcional)"
              placeholderTextColor="#a0c4c4"
              value={observacoes}
              onChangeText={setObservacoes}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Botão de Agendar */}
          <TouchableOpacity 
            style={[styles.agendarButton, loading && styles.buttonDisabled]}
            onPress={handleAgendar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.agendarButtonText}>Agendar Entrega</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Seleção de Empresa */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEmpresaModal}
        onRequestClose={() => setShowEmpresaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.empresaModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione a Empresa</Text>
              <TouchableOpacity onPress={() => setShowEmpresaModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {loadingEmpresas ? (
              <ActivityIndicator size="large" color="#4a9a9a" style={{ marginTop: 20 }} />
            ) : empresas.length === 0 ? (
              <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
                Nenhuma empresa encontrada.
              </Text>
            ) : (
              <ScrollView style={styles.empresaList}>
                {empresas.map((empresa) => (
                  <TouchableOpacity
                    key={empresa.id}
                    style={styles.empresaItem}
                    onPress={() => {
                      setEmpresaSelecionada(empresa);
                      setShowEmpresaModal(false);
                    }}
                  >
                    <Text style={styles.empresaItemText}>{empresa.nomeCompleto}</Text>
                    {empresa.cnpj && (
                      <Text style={styles.empresaItemCnpj}>
                        CNPJ: {empresa.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal do Calendário */}
      {/* Modal de Seleção de Data */}
<Modal
  animationType="fade"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.calendarCard}>
      {/* Cabeçalho do calendário */}
      <View style={styles.monthNavigation}>
        <TouchableOpacity
          onPress={() => setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
          )}
        >
          <Text style={styles.navArrow}>◀</Text>
        </TouchableOpacity>

        <Text style={styles.monthYear}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>

        <TouchableOpacity
          onPress={() => setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
          )}
        >
          <Text style={styles.navArrow}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Cabeçalho dos dias da semana */}
      <View style={styles.weekDays}>
        {dayNames.map((day, index) => (
          <Text key={index} style={styles.weekDay}>{day}</Text>
        ))}
      </View>

      {/* Dias do mês */}
      <View style={styles.daysGrid}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              day === null && styles.emptyCell,
              isSelectedDate(day) && styles.selectedDay,
            ]}
            onPress={() => handleDayPress(day)}
            disabled={day === null}
          >
            {day && (
              <Text
                style={[
                  styles.dayText,
                  isSelectedDate(day) && styles.selectedDayText,
                ]}
              >
                {day}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Botões de ação */}
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <Text style={styles.cancelButton}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <Text style={styles.okButton}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
  </Modal>


      <BottomNav />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001f2d',
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#a0c4c4',
  },
  monthYearSelector: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
  gap: 10,
},
dropdown: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#4a9a9a33',
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 8,
  flex: 1,
},
dropdownText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#0a3d3d',
},
dropdownArrow: {
  fontSize: 12,
  color: '#0a3d3d',
},
  content: {
    flex: 1,
    paddingBottom: 100,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a0c4c4',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#134949',
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
  selectButton: {
    backgroundColor: '#134949',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1a5555',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#ffffff',
  },
  selectArrow: {
    fontSize: 12,
    color: '#a0c4c4',
  },
  dateButton: {
    backgroundColor: '#134949',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1a5555',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#ffffff',
  },
  agendarButton: {
    backgroundColor: '#3694AD',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  agendarButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  empresaModal: {
    backgroundColor: '#134949',
    borderRadius: 16,
    width: '100%',
    maxHeight: '70%',
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
  closeButton: {
    fontSize: 24,
    color: '#a0c4c4',
  },
  empresaList: {
    maxHeight: 400,
  },
  empresaItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a5555',
  },
  empresaItemText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 4,
  },
  empresaItemCnpj: {
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
    selectorsRow: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  selectorContainer: {
    marginBottom: 12,
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0a3d3d',
    marginBottom: 6,
  },
  selectorScroll: {
    flexDirection: 'row',
  },
  selectorButton: {
    backgroundColor: '#dceaea',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  selectorActive: {
    backgroundColor: '#4a9a9a',
  },
  selectorText: {
    fontSize: 14,
    color: '#0a3d3d',
    fontWeight: '500',
  },
  selectorTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

});