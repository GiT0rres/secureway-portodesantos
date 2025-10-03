import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '../components/BottomNav';

const Agendamentos = () => {
  const router = useRouter();
  const appointments = [
    { id: 1, company: 'Empresa tal', address: 'Rua Exemplo, 123', location: '📍 Centro' },
    { id: 2, company: 'Outra Empresa', address: 'Av. Principal, 456', location: '📍 Norte' },
    { id: 3, company: 'Empresa XYZ', address: 'Praça Central, 789', location: '📍 Sul' },
    { id: 4, company: 'Firma ABC', address: 'Rua Secundária, 101', location: '📍 Leste' },
    { id: 5, company: 'Comércio Ltda', address: 'Av. Nova, 202', location: '📍 Oeste' },
  ];

  return (
    <>
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SecureWay</Text>
        <Text style={styles.subtitle}>Agendamentos</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Conteúdo dos Agendamentos */}
        <View style={styles.content}>
          {appointments.map((item) => (
            <TouchableOpacity key={item.id} style={styles.appointmentCard}>
              <View style={styles.cardContent}>
                <Text style={styles.company}>{item.company}</Text>
                <Text style={styles.address}>{item.address}</Text>
                <Text style={styles.location}>{item.location}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Barra de navegação inferior */}
      <BottomNav />
      </View>
      </>
  );
};

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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  appointmentCard: {
    backgroundColor: '#001f2d',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
     borderColor: '#1590a5ff',
  borderWidth: 2, // ✅ correto

  },
  cardContent: {
    flexDirection: 'column',
  },
  company: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#a0c4c4',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#ffffff',
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

export default Agendamentos;