import React, { useEffect, useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, StatusBar, 
  ScrollView, ActivityIndicator, Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '../components/BottomNav';
import { Ionicons } from '@expo/vector-icons';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase.config';
import { useAgendamentos } from '../hooks/useAgendamentos';

export default function Agendamentos() {
  const router = useRouter();
  const { agendamentosAtivos, loading } = useAgendamentos('motorista');

  const finalizarAgendamento = async (id: string) => {
    Alert.alert(
      'Finalizar Agendamento',
      'Deseja marcar este agendamento como concluído?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Concluir',
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'agendamentos', id), {
                status: 'concluido',
              });
              Alert.alert('Sucesso', 'Agendamento marcado como concluído.');
            } catch (error) {
              console.error('Erro ao finalizar:', error);
              Alert.alert('Erro', 'Não foi possível atualizar o status.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />

      <View style={styles.header}>
        <Text style={styles.title}>SecureWay</Text>
        <Text style={styles.subtitle}>Meus Agendamentos</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5a8a8a" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : agendamentosAtivos().length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>Nenhum agendamento ativo</Text>
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
            {agendamentosAtivos().map((item) => (
              <View key={item.id} style={styles.appointmentCard}>
                <View style={styles.cardContent}>
                  <Text style={styles.company}>{item.empresaNome}</Text>
                  <Text style={styles.address}>{item.endereco}</Text>
                  <Text style={styles.location}>
                    📅 {new Date(item.data).toLocaleDateString('pt-BR')} - ⏰ {item.horario}
                  </Text>
                </View>

                <View style={styles.cardButtons}>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() =>
                      Alert.alert(
                        item.empresaNome,
                        `Endereço: ${item.endereco}\nData: ${new Date(item.data).toLocaleDateString('pt-BR')}\nHorário: ${item.horario}`
                      )
                    }
                  >
                    <Text style={styles.detailsButtonText}>Detalhes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.finalizarButton}
                    onPress={() => finalizarAgendamento(item.id)}
                  >
                    <Text style={styles.finalizarButtonText}>Concluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/agendar_entrega')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

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
    backgroundColor: '#B5C9CF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  cardContent: { flexDirection: 'column', marginBottom: 12 },
  company: { fontSize: 16, color: '#001f2d', fontWeight: '500', marginBottom: 4 },
  address: { fontSize: 14, color: '#001f2d', marginBottom: 4 },
  location: { fontSize: 14, color: '#001f2d' },
  cardButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  detailsButton: { backgroundColor: '#4F9D9D', padding: 8, borderRadius: 6 },
  detailsButtonText: { color: '#fff', fontWeight: 'bold' },
  finalizarButton: { backgroundColor: '#E85C5C', padding: 8, borderRadius: 6 },
  finalizarButtonText: { color: '#fff', fontWeight: 'bold' },
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
  fab: {
    position: 'absolute',
    bottom: 150,
    right: 25,
    backgroundColor: '#3694AD',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
