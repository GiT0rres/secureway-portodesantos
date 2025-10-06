import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '@/components/BottomNav';
import { auth, db } from '../services/firebase.config';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

export default function VincularMotorista() {
  const router = useRouter();
  const [cpf, setCpf] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [motoristaEncontrado, setMotoristaEncontrado] = useState<any>(null);

  const formatarCPF = (text: string) => {
    const limpo = text.replace(/\D/g, '');
    
    if (limpo.length <= 11) {
      let formatado = limpo;
      if (limpo.length > 3) {
        formatado = `${limpo.slice(0, 3)}.${limpo.slice(3)}`;
      }
      if (limpo.length > 6) {
        formatado = `${limpo.slice(0, 3)}.${limpo.slice(3, 6)}.${limpo.slice(6)}`;
      }
      if (limpo.length > 9) {
        formatado = `${limpo.slice(0, 3)}.${limpo.slice(3, 6)}.${limpo.slice(6, 9)}-${limpo.slice(9, 11)}`;
      }
      setCpf(formatado);
    }
  };

  const formatarTelefone = (telefone: string) => {
    if (!telefone) return '-';
    if (telefone.length === 11) {
      return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7)}`;
    }
    return telefone;
  };

  const formatarPlaca = (placa?: string) => {
    if (!placa) return '-';
    if (placa.length === 7) {
      return `${placa.slice(0, 3)}-${placa.slice(3)}`;
    }
    return placa;
  };

  const handleBuscar = async () => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
      Alert.alert('Atenção', 'Digite um CPF válido');
      return;
    }

    setIsLoading(true);
    setMotoristaEncontrado(null);

    try {
      // Buscar motorista por CPF na coleção de usuários
      const usuariosRef = collection(db, 'usuarios');
      const q = query(
        usuariosRef, 
        where('tipo', '==', 'caminhoneiro'),
        where('cpf', '==', cpfLimpo)
      );
      
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert(
          'Não encontrado', 
          'Nenhum motorista encontrado com este CPF. Verifique se o motorista já se cadastrou no aplicativo.'
        );
        return;
      }

      // Pegar o primeiro resultado
      const motoristaDoc = querySnapshot.docs[0];
      const motoristaData = motoristaDoc.data();

      setMotoristaEncontrado({
        uid: motoristaDoc.id,
        ...motoristaData
      });

    } catch (error) {
      console.error('Erro ao buscar motorista:', error);
      Alert.alert('Erro', 'Não foi possível buscar o motorista');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVincular = async () => {
    if (!motoristaEncontrado) return;

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado');
      router.replace('/');
      return;
    }

    setIsLoading(true);

    try {
      // Verificar se já está vinculado
      const vinculoRef = doc(db, 'usuarios', user.uid, 'motoristas', motoristaEncontrado.uid);
      
      // Criar vínculo
      await setDoc(vinculoRef, {
        motoristaId: motoristaEncontrado.uid,
        nomeCompleto: motoristaEncontrado.nomeCompleto,
        cpf: motoristaEncontrado.cpf,
        telefone: motoristaEncontrado.telefone,
        email: motoristaEncontrado.email,
        // Dados do veículo
        marca: motoristaEncontrado.marca || null,
        modelo: motoristaEncontrado.modelo || null,
        placa: motoristaEncontrado.placa || null,
        cor: motoristaEncontrado.cor || null,
        etiqueta: motoristaEncontrado.etiqueta || null,
        vinculadoEm: new Date(),
      });

      Alert.alert(
        'Sucesso!',
        `${motoristaEncontrado.nomeCompleto} foi vinculado à sua empresa!`,
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      console.error('Erro ao vincular motorista:', error);
      
      if (error.code === 'permission-denied') {
        Alert.alert('Erro', 'Este motorista já está vinculado à sua empresa');
      } else {
        Alert.alert('Erro', 'Não foi possível vincular o motorista');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Vincular Motorista</Text>
            <Text style={styles.subtitle}>Busque por CPF para adicionar à sua empresa</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>CPF do Motorista</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.input}
                placeholder="000.000.000-00"
                placeholderTextColor="#5a8a8a"
                value={cpf}
                onChangeText={formatarCPF}
                keyboardType="numeric"
                maxLength={14}
                editable={!isLoading}
              />
              <TouchableOpacity 
                style={[styles.buscarButton, isLoading && styles.buscarButtonDisabled]}
                onPress={handleBuscar}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.buscarButtonText}>Buscar</Text>
                )}
              </TouchableOpacity>
            </View>

            {motoristaEncontrado && (
              <View style={styles.resultadoContainer}>
                <Text style={styles.resultadoTitulo}>Motorista Encontrado</Text>
                
                <View style={styles.infoCard}>
                  <Text style={styles.infoNome}>{motoristaEncontrado.nomeCompleto}</Text>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>CPF:</Text>
                    <Text style={styles.infoValue}>
                      {motoristaEncontrado.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Telefone:</Text>
                    <Text style={styles.infoValue}>
                      {formatarTelefone(motoristaEncontrado.telefone)}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>E-mail:</Text>
                    <Text style={styles.infoValue}>{motoristaEncontrado.email || '-'}</Text>
                  </View>
                </View>

                <View style={styles.veiculoCard}>
                  <Text style={styles.veiculoTitulo}>Veículo</Text>
                  
                  {motoristaEncontrado.marca || motoristaEncontrado.modelo ? (
                    <>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Marca:</Text>
                        <Text style={styles.infoValue}>{motoristaEncontrado.marca || '-'}</Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Modelo:</Text>
                        <Text style={styles.infoValue}>{motoristaEncontrado.modelo || '-'}</Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Placa:</Text>
                        <Text style={styles.infoValue}>
                          {formatarPlaca(motoristaEncontrado.placa)}
                        </Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Cor:</Text>
                        <Text style={styles.infoValue}>{motoristaEncontrado.cor || '-'}</Text>
                      </View>
                    </>
                  ) : (
                    <Text style={styles.semVeiculo}>Veículo não cadastrado</Text>
                  )}
                </View>

                <TouchableOpacity 
                  style={[styles.vincularButton, isLoading && styles.vincularButtonDisabled]}
                  onPress={handleVincular}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.vincularButtonText}>Vincular à Empresa</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity 
              onPress={() => router.back()}
              disabled={isLoading}
              style={styles.voltarButton}
            >
              <Text style={styles.voltarText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001f2d',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#a0c4c4',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    backgroundColor: '#b8d8d8',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#333333',
  },
  buscarButton: {
    backgroundColor: '#3694AD',
    borderRadius: 8,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  buscarButtonDisabled: {
    opacity: 0.7,
  },
  buscarButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultadoContainer: {
    marginBottom: 24,
  },
  resultadoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3694AD',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#0f4a4a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#a0c4c4',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#ffffff',
  },
  veiculoCard: {
    backgroundColor: '#134949',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  veiculoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3694AD',
    marginBottom: 12,
  },
  semVeiculo: {
    fontSize: 14,
    color: '#a0c4c4',
    fontStyle: 'italic',
  },
  vincularButton: {
    backgroundColor: '#3694AD',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  vincularButtonDisabled: {
    opacity: 0.7,
  },
  vincularButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  voltarButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  voltarText: {
    color: '#3694AD',
    fontSize: 14,
  },
});