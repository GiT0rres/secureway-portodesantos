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
  Image,
} from "react-native";
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import BottomNav from "@/components/BottomNav";
import { auth, db } from '../services/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { agendamentoService } from '../services/AgendamentoService';
import { Agendamento } from '../types/agendamentos';
import { uploadFotoPerfil } from '../services/authService';

interface EmpresaData {
  nomeCompleto: string;
  email: string;
  telefone: string;
  cnpj?: string;
  tipo: string;
  fotoPerfil?: string;
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
  const [abaAtiva, setAbaAtiva] = useState("Agendamentos");
  const [empresaData, setEmpresaData] = useState<EmpresaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);

  useEffect(() => {
    carregarDadosEmpresa();
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
        await carregarDadosEmpresa();
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

            <TouchableOpacity 
              style={styles.avatar}
              onPress={selecionarFoto}
              disabled={uploadingFoto}
            >
              {uploadingFoto ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : empresaData?.fotoPerfil ? (
                <Image 
                  source={{ uri: empresaData.fotoPerfil }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>
                  {getInitials(empresaData?.nomeCompleto)}
                </Text>
              )}
              <View style={styles.cameraIconContainer}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            </TouchableOpacity>
            
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

          {/* Conteúdo */}
          <View style={styles.content}>
            {abaAtiva === "Agendamentos" && (
              <>
                {loadingAgendamentos ? (
                  <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#55777c" />
                  </View>
                ) : agendamentos.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📦</Text>
                    <Text style={styles.emptyText}>Nenhum agendamento</Text>
                    <Text style={styles.emptySubtext}>
                      Você ainda não possui agendamentos registrados.
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
                              ` • ${agendamento.veiculoPlaca.slice(0, 3)}-${agendamento.veiculoPlaca.slice(3)}`}
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
      </View>
      <BottomNav />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#001f2d" },
  centerContent: { justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  loadingText: { color: '#55777c', marginTop: 12, fontSize: 16 },
  scrollContent: { flexGrow: 1, paddingBottom: 100 },
  header: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#55777c",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'relative',
  },
  settingsButton: { position: 'absolute', top: 40, right: 20, padding: 8, zIndex: 10 },
  settingsIcon: { fontSize: 24, color: '#ffffff' },
  avatar: { 
    width: 160, 
    height: 160, 
    backgroundColor: "#3c5656", 
    borderRadius: 100, 
    marginBottom: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#ffffff' },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3694AD',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#55777c',
  },
  cameraIcon: { fontSize: 16 },
  nome: { fontSize: 18, fontWeight: "bold", color: "#ffffff", marginBottom: 6 },
  funcaoBox: { backgroundColor: "#d4e4e4", borderRadius: 20, paddingHorizontal: 45, paddingVertical: 6 },
  funcao: { color: "#0a3d3d", fontWeight: "bold" },
  cnpj: { fontSize: 12, color: '#d0e0e0', marginTop: 8 },
  infoSection: { padding: 16, gap: 12 },
  infoCard: { backgroundColor: '#0f4a4a', borderRadius: 12, padding: 16 },
  infoLabel: { fontSize: 12, color: '#a0c4c4', marginBottom: 4 },
  infoValue: { fontSize: 16, color: '#ffffff', fontWeight: '500' },
  tabs: { flexDirection: "row", justifyContent: "space-around", backgroundColor: "#001f2d", marginTop: 8, borderBottomWidth: 1, borderBottomColor: "#55777c" },
  tabItem: { alignItems: "center", paddingVertical: 10 },
  tabText: { fontSize: 14, color: "#b8d8d8" },
  tabTextAtivo: { color: "#ffffff", fontWeight: "bold" },
  tabUnderline: { marginTop: 4, height: 2, width: "80%", backgroundColor: "#3694AD", borderRadius: 2 },
  content: { marginTop: 20, padding: 16, gap: 12 },
  emptyContainer: { backgroundColor: '#0f4a4a', borderRadius: 8, padding: 40, alignItems: 'center', marginTop: 20 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#ffffff', fontWeight: '600', marginBottom: 4 },
  emptySubtext: { fontSize: 14, color: '#a0c4c4', textAlign: 'center' },
  agendamentoCard: { backgroundColor: '#0f4a4a', borderRadius: 8, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#3694AD' },
  agendamentoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  agendamentoHeaderLeft: { flex: 1, marginRight: 12 },
  agendamentoMotorista: { fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  agendamentoVeiculo: { fontSize: 12, color: '#a0c4c4' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, color: '#ffffff', fontWeight: 'bold' },
  agendamentoInfo: { marginBottom: 8 },
  agendamentoLabel: { fontSize: 12, color: '#a0c4c4', marginBottom: 2 },
  agendamentoValue: { fontSize: 14, color: '#ffffff' },
});