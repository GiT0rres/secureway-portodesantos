import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import BottomNav from '@/components/BottomNav';
import { auth, db } from '../services/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useAgendamentos } from '../hooks/useAgendamentos';
import { uploadFotoPerfil } from '../services/authService';

interface UserData {
  nomeCompleto: string;
  email: string;
  telefone: string;
  tipo: string;
  fotoPerfil?: string;
  marca?: string;
  placa?: string;
  modelo?: string;
  etiqueta?: string;
  cor?: string;
}

export default function PerfilMotorista() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'caminhos' | 'historico'>('caminhos');
  const { agendamentosPassados, loading: loadingAgendamentos } = useAgendamentos('motorista');

  useFocusEffect(
    React.useCallback(() => {
      carregarDadosUsuario();
    }, [])
  );

  const carregarDadosUsuario = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        router.replace('/');
        return;
      }

      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      } else {
        Alert.alert('Erro', 'Dados do usuário não encontrados');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const selecionarFoto = async () => {
    try {
      // Pedir permissão
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de permissão para acessar suas fotos.'
        );
        return;
      }

      // Abrir galeria
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await fazerUploadFoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a foto');
    }
  };

  const fazerUploadFoto = async (uri: string) => {
    try {
      setUploadingFoto(true);
      const user = auth.currentUser;
      if (!user) return;

      const resultado = await uploadFotoPerfil(user.uid, uri);

      if (resultado.success) {
        Alert.alert('Sucesso', 'Foto de perfil atualizada!');
        // Recarregar dados para mostrar a nova foto
        await carregarDadosUsuario();
      } else {
        Alert.alert('Erro', resultado.message || 'Erro ao fazer upload');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      Alert.alert('Erro', 'Não foi possível fazer upload da foto');
    } finally {
      setUploadingFoto(false);
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

  const getInitials = (name: string | undefined) => {
    if (!name || name.trim() === '') return '??';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const hasVehicleData = () => {
    return userData?.marca || userData?.modelo || userData?.placa || userData?.cor;
  };

  const handleEditarVeiculo = () => {
    router.push('/cad_caminhao');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#5a8a8a" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5a8a8a" />

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
          
          <View style={styles.profileImageContainer}>
            <TouchableOpacity 
              style={styles.profileImage}
              onPress={selecionarFoto}
              disabled={uploadingFoto}
            >
              {uploadingFoto ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : userData?.fotoPerfil ? (
                <Image 
                  source={{ uri: userData.fotoPerfil }}
                  style={styles.profileImagePhoto}
                />
              ) : (
                <Text style={styles.profileImageText}>
                  {userData ? getInitials(userData.nomeCompleto) : '--'}
                </Text>
              )}
              <View style={styles.cameraIconContainer}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.nome}>
            {userData?.nomeCompleto || 'Nome não disponível'}
          </Text>
          <Text style={styles.ocupacao}>Motorista</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={selectedTab === 'caminhos' ? styles.tabActive : styles.tab}
            onPress={() => setSelectedTab('caminhos')}
          >
            <Text style={selectedTab === 'caminhos' ? styles.tabTextActive : styles.tabText}>
              Caminhos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={selectedTab === 'historico' ? styles.tabActive : styles.tab}
            onPress={() => setSelectedTab('historico')}
          >
            <Text style={selectedTab === 'historico' ? styles.tabTextActive : styles.tabText}>
              Histórico
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo Condicional */}
        {selectedTab === 'caminhos' ? (
          <>
            <View style={styles.cardsContainer}>
              {/* Informações pessoais */}
              <View style={styles.sectionTitle}>
                <Text style={styles.sectionTitleText}>Informações Pessoais</Text>
              </View>

              <View style={styles.cardRow}>
                <View style={styles.cardFullWidth}>
                  <Text style={styles.cardLabel}>E-mail</Text>
                  <Text style={styles.cardValue}>{userData?.email || '-'}</Text>
                </View>
              </View>

              <View style={styles.cardRow}>
                <View style={styles.cardFullWidth}>
                  <Text style={styles.cardLabel}>Telefone</Text>
                  <Text style={styles.cardValue}>
                    {userData?.telefone ? 
                      `(${userData.telefone.slice(0, 2)}) ${userData.telefone.slice(2, 7)}-${userData.telefone.slice(7)}` 
                      : '-'}
                  </Text>
                </View>
              </View>

              {/* Informações do veículo */}
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionTitleText}>Veículo</Text>
                </View>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={handleEditarVeiculo}
                >
                  <Text style={styles.editButtonText}>
                    {hasVehicleData() ? '✏️ Editar' : '➕ Cadastrar'}
                  </Text>
                </TouchableOpacity>
              </View>

              {!hasVehicleData() ? (
                <View style={styles.emptyVehicleContainer}>
                  <Text style={styles.emptyVehicleIcon}>🚛</Text>
                  <Text style={styles.emptyVehicleText}>
                    Nenhum veículo cadastrado
                  </Text>
                  <Text style={styles.emptyVehicleSubtext}>
                    Cadastre seu veículo para começar
                  </Text>
                  <TouchableOpacity 
                    style={styles.cadastrarButton}
                    onPress={handleEditarVeiculo}
                  >
                    <Text style={styles.cadastrarButtonText}>
                      Cadastrar Veículo
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.cardRow}>
                    <View style={styles.card}>
                      <Text style={styles.cardLabel}>Marca</Text>
                      <Text style={styles.cardValue}>{userData?.marca || '-'}</Text>
                    </View>
                    <View style={styles.card}>
                      <Text style={styles.cardLabel}>Placa</Text>
                      <Text style={styles.cardValue}>
                        {userData?.placa ? 
                          `${userData.placa.slice(0, 3)}-${userData.placa.slice(3)}` 
                          : '-'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardRow}>
                    <View style={styles.card}>
                      <Text style={styles.cardLabel}>Modelo</Text>
                      <Text style={styles.cardValue}>{userData?.modelo || '-'}</Text>
                    </View>
                    <View style={styles.card}>
                      <Text style={styles.cardLabel}>Cor</Text>
                      <Text style={styles.cardValue}>{userData?.cor || '-'}</Text>
                    </View>
                  </View>

                  <View style={styles.cardRow}>
                    <View style={styles.cardFullWidth}>
                      <Text style={styles.cardLabel}>Etiqueta Autodestrutiva</Text>
                      <Text style={styles.cardValue}>{userData?.etiqueta || 'Não cadastrada'}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </>
        ) : (
          <>
            {/* Conteúdo da aba Histórico */}
            {loadingAgendamentos ? (
              <ActivityIndicator size="large" color="#5a8a8a" style={{ marginTop: 20 }} />
            ) : agendamentosPassados().length === 0 ? (
              <View style={styles.emptyVehicleContainer}>
                <Text style={styles.emptyVehicleIcon}>📜</Text>
                <Text style={styles.emptyVehicleText}>Nenhum histórico encontrado</Text>
                <Text style={styles.emptyVehicleSubtext}>
                  Suas entregas finalizadas aparecerão aqui
                </Text>
              </View>
            ) : (
              agendamentosPassados().map((ag) => (
                <View key={ag.id} style={styles.historicoCard}>
                  <View style={styles.historicoHeader}>
                    <Text style={styles.historicoEmpresa}>{ag.empresaNome}</Text>
                    <Text
                      style={[
                        styles.historicoStatus,
                        ag.status === 'concluido'
                          ? styles.statusConcluido
                          : styles.statusCancelado,
                      ]}
                    >
                      {ag.status === 'concluido' ? '✅ Concluído' : '❌ Cancelado'}
                    </Text>
                  </View>

                  <Text style={styles.historicoInfo}>
                    📅 {new Date(ag.data).toLocaleDateString('pt-BR')}
                  </Text>
                  <Text style={styles.historicoInfo}>⏰ {ag.horario}</Text>
                  <Text style={styles.historicoInfo}>🏢 {ag.endereco}</Text>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001f2d',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#5a8a8a',
    marginTop: 12,
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    backgroundColor: '#5a8a8a',
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 8,
  },
  settingsIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  profileImageContainer: {
    marginBottom: 12,
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 100,
    backgroundColor: '#3a5a5a',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  profileImagePhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  profileImageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3694AD',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5a8a8a',
  },
  cameraIcon: { fontSize: 12 },
  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  ocupacao: {
    fontSize: 14,
    color: '#d0e0e0',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#001f2d',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#1590a5ff',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    color: '#5a8a8a',
    fontWeight: '500',
  },
  tabTextActive: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  cardsContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#a0c4c4',
  },
  editButton: {
    backgroundColor: '#134949',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3694AD',
  },
  editButtonText: {
    color: '#3694AD',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyVehicleContainer: {
    backgroundColor: '#134949',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#1a5555',
    borderStyle: 'dashed',
  },
  emptyVehicleIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyVehicleText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 4,
  },
  emptyVehicleSubtext: {
    fontSize: 14,
    color: '#a0c4c4',
    marginBottom: 20,
  },
  cadastrarButton: {
    backgroundColor: '#3694AD',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cadastrarButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#134949',
    borderRadius: 8,
    padding: 16,
    minHeight: 70,
  },
  cardFullWidth: {
    flex: 1,
    backgroundColor: '#134949',
    borderRadius: 8,
    padding: 16,
    minHeight: 70,
  },
  cardLabel: {
    fontSize: 12,
    color: '#a0c4c4',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  historicoCard: {
    backgroundColor: '#134949',
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 20,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3694AD',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  historicoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historicoEmpresa: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  historicoStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusConcluido: {
    color: '#4CAF50',
  },
  statusCancelado: {
    color: '#F44336',
  },
  historicoInfo: {
    color: '#a0c4c4',
    fontSize: 13,
    marginTop: 2,
  },
});