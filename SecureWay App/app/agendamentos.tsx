import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  ScrollView, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '../components/BottomNav';
import { auth, db } from '../services/firebase.config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function Agendamentos() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        router.replace('/');
        return;
      }

      const q = query(collection(db, 'agendamentos'), where('motoristaId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const lista: any[] = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });

      setAgendamentos(lista);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os agendamentos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SecureWay</Text>
        <Text style={styles.subtitle}>Meus Agendamentos</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5a8a8a" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : agendamentos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>Nenhum agendamento encontrado</Text>
          <TouchableOpacity
            style={styles.agendarButton}
            onPress={() => router.push('/agendar_entrega')}
          >
            <Text style={styles.agendarButtonText}>Agendar Entrega</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {agendamentos.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.appointmentCard}
                onPress={() => Alert.alert(item.empresaNome, `Endereço: ${item.endereco}\nData: ${new Date(item.data).toLocaleDateString('pt-BR')}\nHorário: ${item.horario}`)}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.company}>{item.empresaNome}</Text>
                  <Text style={styles.address}>{item.endereco}</Text>
                  <Text style={styles.location}>📅 {new Date(item.data).toLocaleDateString('pt-BR')} - ⏰ {item.horario}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Botão Flutuante ➕ */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/agendar_entrega')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Barra inferior */}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001f2d' },
  header: { paddingTop: 40, paddingHorizontal: 20, paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#a0c4c4' },
  scrollContent: { flexGrow: 1, paddingBottom: 80 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  appointmentCard: {
    backgroundColor: '#001f2d',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderColor: '#1590a5ff',
    borderWidth: 2,
  },
  cardContent: { flexDirection: 'column' },
  company: { fontSize: 16, color: '#ffffff', fontWeight: '500', marginBottom: 4 },
  address: { fontSize: 14, color: '#a0c4c4', marginBottom: 4 },
  location: { fontSize: 14, color: '#ffffff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#5a8a8a', marginTop: 10 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#a0c4c4', fontSize: 16, marginBottom: 16 },
  agendarButton: {
    backgroundColor: '#3694AD',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  agendarButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },

  // 🔹 Estilo do botão flutuante
 fab: {
  position: 'absolute',
  bottom: 150, // ⬆️ subimos o botão um pouco mais no eixo Y
  right: 25,
  backgroundColor: '#3694AD',
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.4,
  shadowRadius: 4,
  zIndex: 999,
},
});
