import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from 'expo-router';
import BottomNav from "@/components/BottomNav";
import { auth, db } from '../services/firebase.config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

interface Motorista {
  id: string;
  nomeCompleto: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  marca?: string;
  modelo?: string;
  placa?: string;
  cor?: string;
  etiqueta?: string;
}

export default function MotoristasCadastrados() {
  const router = useRouter();
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      carregarMotoristas();
    }, [])
  );

  const carregarMotoristas = async () => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        router.replace('/');
        return;
      }

      const motoristasRef = collection(db, 'usuarios', user.uid, 'motoristas');
      const querySnapshot = await getDocs(motoristasRef);

      const motoristasData: Motorista[] = [];
      querySnapshot.forEach((doc) => {
        motoristasData.push({
          id: doc.id,
          ...doc.data()
        } as Motorista);
      });

      setMotoristas(motoristasData);
    } catch (error) {
      console.error('Erro ao carregar motoristas:', error);
      Alert.alert('Erro', 'Não foi possível carregar os motoristas');
    } finally {
      setLoading(false);
    }
  };

  const handleDesvincular = async (motoristaId: string, nomeMotorista: string) => {
    Alert.alert(
      'Confirmar',
      `Desvincular ${nomeMotorista} da empresa?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desvincular',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) return;

              await deleteDoc(doc(db, 'usuarios', user.uid, 'motoristas', motoristaId));
              setMotoristas(motoristas.filter(m => m.id !== motoristaId));
              Alert.alert('Sucesso', 'Motorista desvinculado');
            } catch (error) {
              console.error('Erro:', error);
              Alert.alert('Erro', 'Não foi possível desvincular');
            }
          }
        }
      ]
    );
  };

  const getDetalheVeiculo = (motorista: Motorista) => {
    if (!motorista.marca && !motorista.modelo && !motorista.placa) {
      return 'Veículo não cadastrado';
    }

    const parts = [];
    if (motorista.marca) parts.push(motorista.marca);
    if (motorista.modelo) parts.push(motorista.modelo);
    if (motorista.placa) {
      const placaFormatada = motorista.placa.length === 7 
        ? `${motorista.placa.slice(0, 3)}-${motorista.placa.slice(3)}`
        : motorista.placa;
      parts.push(`- ${placaFormatada}`);
    }
    
    return parts.join(' ');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#55777c" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Motoristas Cadastrados</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/vincular_motorista')}
          >
            <Text style={styles.addButtonText}>+ Vincular</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {motoristas.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>👤</Text>
              <Text style={styles.emptyTitle}>Nenhum motorista vinculado</Text>
              <Text style={styles.emptySubtitle}>
                Vincule motoristas à sua empresa
              </Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => router.push('/vincular_motorista')}
              >
                <Text style={styles.emptyButtonText}>Vincular Motorista</Text>
              </TouchableOpacity>
            </View>
          ) : (
            motoristas.map((motorista) => (
              <TouchableOpacity key={motorista.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardNome}>{motorista.nomeCompleto}</Text>
                    <Text style={styles.cardDetalhe}>{getDetalheVeiculo(motorista)}</Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDesvincular(motorista.id, motorista.nomeCompleto)}
                  >
                    <Text style={styles.deleteButtonText}>🔗</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      <BottomNav />
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
  },
  loadingText: {
    color: '#55777c',
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#00323c",
    borderBottomWidth: 1,
    borderBottomColor: "#1a5c5c",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: '#3694AD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#a0c4c4',
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#3694AD',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: "#3c5656",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardInfo: {
    flex: 1,
  },
  cardNome: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDetalhe: {
    color: "#d4e4e4",
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButtonText: {
    fontSize: 20,
  },
});