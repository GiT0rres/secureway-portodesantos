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
import { doc, updateDoc } from 'firebase/firestore';

export default function CadastroVeiculo() {
  const router = useRouter();
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cor, setCor] = useState('');
  const [placa, setPlaca] = useState('');
  const [etiqueta, setEtiqueta] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatarPlaca = (text: string) => {
    const limpo = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    if (limpo.length <= 7) {
      if (limpo.length > 3) {
        setPlaca(`${limpo.slice(0, 3)}-${limpo.slice(3, 7)}`);
      } else {
        setPlaca(limpo);
      }
    }
  };

  const handleEnviar = async () => {
    if (!marca.trim() || !modelo.trim() || !cor.trim() || !placa.trim()) {
      Alert.alert('Atenção', 'Preencha ao menos: Marca, Modelo, Cor e Placa');
      return;
    }

    const placaLimpa = placa.replace(/[^A-Za-z0-9]/g, '');
    if (placaLimpa.length !== 7) {
      Alert.alert('Atenção', 'Placa inválida. Use o formato ABC-1234 ou ABC1D23');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado');
      router.replace('/');
      return;
    }

    setIsLoading(true);

    try {
      const userDocRef = doc(db, 'usuarios', user.uid);
      
      await updateDoc(userDocRef, {
        marca: marca.trim(),
        modelo: modelo.trim(),
        cor: cor.trim(),
        placa: placaLimpa,
        etiqueta: etiqueta.trim() || null
      });

      Alert.alert(
        'Sucesso!',
        'Veículo cadastrado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/perfil_caminhoneiro')
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao cadastrar veículo:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar o veículo');
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
            <Text style={styles.title}>Cadastre seu Veículo</Text>
            <Text style={styles.subtitle}>Complete seu caminho</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Marca *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Scania, Volvo, Mercedes"
              placeholderTextColor="#5a8a8a"
              value={marca}
              onChangeText={setMarca}
              autoCapitalize="words"
              editable={!isLoading}
            />

            <Text style={styles.label}>Modelo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: R450, FH540"
              placeholderTextColor="#5a8a8a"
              value={modelo}
              onChangeText={setModelo}
              autoCapitalize="words"
              editable={!isLoading}
            />

            <Text style={styles.label}>Cor *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Branco, Azul"
              placeholderTextColor="#5a8a8a"
              value={cor}
              onChangeText={setCor}
              autoCapitalize="words"
              editable={!isLoading}
            />

            <Text style={styles.label}>Placa *</Text>
            <TextInput
              style={styles.input}
              placeholder="ABC-1234"
              placeholderTextColor="#5a8a8a"
              value={placa}
              onChangeText={formatarPlaca}
              autoCapitalize="characters"
              maxLength={8}
              editable={!isLoading}
            />

            <Text style={styles.label}>Etiqueta Autodestrutiva</Text>
            <TextInput
              style={styles.input}
              placeholder="Código da etiqueta (opcional)"
              placeholderTextColor="#5a8a8a"
              value={etiqueta}
              onChangeText={setEtiqueta}
              autoCapitalize="characters"
              editable={!isLoading}
            />

            <Text style={styles.observacao}>* Campos obrigatórios</Text>

            <TouchableOpacity 
              style={[styles.enviarButton, isLoading && styles.enviarButtonDisabled]}
              onPress={handleEnviar}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#0a3d3d" />
              ) : (
                <Text style={styles.enviarButtonText}>Cadastrar Veículo</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push('/perfil_caminhoneiro')}
              disabled={isLoading}
              style={styles.voltarButton}
            >
              <Text style={styles.voltarText}>Voltar ao Perfil</Text>
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
    marginTop: 4,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#b8d8d8',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
  },
  observacao: {
    fontSize: 12,
    color: '#a0c4c4',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  enviarButton: {
    backgroundColor: '#b8d8d8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  enviarButtonDisabled: {
    opacity: 0.7,
  },
  enviarButtonText: {
    color: '#0a3d3d',
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