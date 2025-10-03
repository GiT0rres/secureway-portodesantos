import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  Modal,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '@/components/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function AgendarEntrega() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(true);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (number | null)[] = [];
    
    // Adiciona espaços vazios antes do primeiro dia
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Adiciona os dias do mês
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

  const formatSelectedDate = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[selectedDate.getDay()]}, ${months[selectedDate.getMonth()]} ${selectedDate.getDate()}`;
  };

  const handleOK = () => {
    setModalVisible(false);
    console.log('Data selecionada:', selectedDate);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SecureWay</Text>
        <Text style={styles.subtitle}>Agende sua entrega</Text>
      </View>

      <View style={styles.content}>
        {/* Aqui você pode adicionar conteúdo da página */}
      </View>

      {/* Modal do Calendário */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarCard}>
            <Text style={styles.selectDateLabel}>Select date</Text>
            
            {/* Data selecionada */}
            <View style={styles.selectedDateContainer}>
              <Text style={styles.selectedDate}>{formatSelectedDate()}</Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editIcon}>✏️</Text>
              </TouchableOpacity>
            </View>

            {/* Navegação de mês */}
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

            {/* Dias da semana */}
            <View style={styles.weekDays}>
              {dayNames.map((day, index) => (
                <Text key={index} style={styles.weekDay}>{day}</Text>
              ))}
            </View>

            {/* Grade de dias */}
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

            {/* Botões de ação */}
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOK}>
                <Text style={styles.okButton}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Botão de telefone */}
      <TouchableOpacity style={styles.phoneButton}>
        <Text style={styles.phoneIcon}>📞</Text>
      </TouchableOpacity>

      {/* Barra de navegação inferior */}
     <BottomNav />
        

      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a3d3d',
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
  content: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedDate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a3d3d',
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 18,
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
  closeButton: {
    fontSize: 14,
    color: '#4a9a9a',
    fontWeight: '600',
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
  phoneButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#0a3d3d',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  phoneIcon: {
    fontSize: 24,
  },
  navButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 24,
    color: '#5a8a8a',
  },
  navIconActive: {
    fontSize: 24,
    color: '#ffffff',
  },
});