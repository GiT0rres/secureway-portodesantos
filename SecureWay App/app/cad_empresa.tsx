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
import { cadastrarUsuario } from '../services/authService';

export default function CadastroEmpresa() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatarTelefone = (text: string) => {
    const numeros = text.replace(/\D/g, '');

    if (numeros.length <= 2) {
      setTelefone(numeros);
    } else if (numeros.length <= 6) {
      setTelefone(`(${numeros.slice(0, 2)}) ${numeros.slice(2)}`);
    } else if (numeros.length <= 10) {
      setTelefone(`(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6, 10)}`);
    } else {
      setTelefone(`(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`);
    }
  };

  const formatarCNPJ = (text: string) => {
    const numeros = text.replace(/\D/g, '');
    
    if (numeros.length <= 2) {
      setCnpj(numeros);
    } else if (numeros.length <= 5) {
      setCnpj(`${numeros.slice(0, 2)}.${numeros.slice(2)}`);
    } else if (numeros.length <= 8) {
      setCnpj(`${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5)}`);
    } else if (numeros.length <= 12) {
      setCnpj(`${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8)}`);
    } else {
      setCnpj(`${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8, 12)}-${numeros.slice(12, 14)}`);
    }
  };

  const handleCadastro = async () => {
    if (!nome.trim() || !cnpj.trim() || !telefone.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const telefoneNumeros = telefone.replace(/\D/g, '');
    if (telefoneNumeros.length < 10) {
      Alert.alert('Atenção', 'Telefone inválido');
      return;
    }

    const cnpjNumeros = cnpj.replace(/\D/g, '');
    if (cnpjNumeros.length !== 14) {
      Alert.alert('Atenção', 'CNPJ inválido (deve ter 14 dígitos)');
      return;
    }

    setIsLoading(true);

    try {
      const result = await cadastrarUsuario(
        nome,
        email,
        senha,
        telefoneNumeros,
        'empresa',
        cnpjNumeros // CNPJ como 6º parâmetro
      );

      if (result.success && result.userData) {
        Alert.alert(
          'Sucesso!',
          'Empresa cadastrada com sucesso. Faça login para continuar.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/')
            }
          ]
        );
      } else {
        Alert.alert('Erro', result.message || 'Erro ao cadastrar empresa');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao realizar o cadastro');
      console.error(error);
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
            <Text style={styles.title}>Cadastre sua empresa</Text>
            <Text style={styles.subtitle}>Complete seu negócio</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nome da Empresa</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome da empresa"
              placeholderTextColor="#5a8a8a"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              editable={!isLoading}
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="empresa@exemplo.com"
              placeholderTextColor="#5a8a8a"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#5a8a8a"
              value={telefone}
              onChangeText={formatarTelefone}
              keyboardType="phone-pad"
              maxLength={15}
              editable={!isLoading}
            />

            <Text style={styles.label}>CNPJ</Text>
            <TextInput
              style={styles.input}
              placeholder="00.000.000/0000-00"
              placeholderTextColor="#5a8a8a"
              value={cnpj}
              onChangeText={formatarCNPJ}
              keyboardType="number-pad"
              maxLength={18}
              editable={!isLoading}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#5a8a8a"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoCapitalize="none"
              editable={!isLoading}
            />

            <TouchableOpacity 
              style={[styles.enviarButton, isLoading && styles.enviarButtonDisabled]}
              onPress={handleCadastro}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#0a3d3d" />
              ) : (
                <Text style={styles.enviarButtonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => router.push('/')}
              disabled={isLoading}
            >
              <Text style={styles.loginText}>
                Já possui uma conta? Faça o <Text style={styles.loginLink}>Login.</Text>
              </Text>
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
  loginText:{
    color: '#ffffff', 
    marginTop: 16,
    textAlign: 'center',
  },
  loginLink:{
    color: '#3694AD',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 100,
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#a0c4c4',
    textAlign: 'center'
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
    backgroundColor: '#d4e4e4',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
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
});