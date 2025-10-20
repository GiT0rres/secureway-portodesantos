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

export default function Cadastro() {
  const router = useRouter();
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCadastro = async () => {
    if (!nomeCompleto.trim() || !email.trim() || !telefone.trim() || !senha.trim()) {
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

    setIsLoading(true);

    try {
      // Cadastra como caminhoneiro por padrão
      const result = await cadastrarUsuario(
        nomeCompleto, 
        email, 
        senha, 
        telefoneNumeros,
        'caminhoneiro'
      );

      if (result.success && result.userData) {
        Alert.alert(
          'Sucesso!', 
          'Cadastro realizado com sucesso. Faça login para continuar.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/') // Redireciona para o index (login)
            }
          ]
        );
      } else {
        Alert.alert('Erro', result.message || 'Erro desconhecido');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao realizar o cadastro');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatarTelefone = (text: string) => {
    const numeros = text.replace(/\D/g, '');
    let formatado = numeros;

    if (numeros.length > 2) formatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    if (numeros.length > 7) formatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;

    setTelefone(formatado);
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
          <Text style={styles.title}>Cadastro</Text>
          <View style={styles.form}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#5a8a8a"
              value={nomeCompleto}
              onChangeText={setNomeCompleto}
              autoCapitalize="words"
              editable={!isLoading}
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#5a8a8a"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
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
              style={[styles.cadastroButton, isLoading && styles.cadastroButtonDisabled]}
              onPress={handleCadastro}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#0f4a4a" />
              ) : (
                <Text style={styles.cadastroButtonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já possui uma conta? Faça o </Text>
              <TouchableOpacity onPress={() => router.push('/')} disabled={isLoading}>
                <Text style={styles.corlink}>Login.</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.push('/cad_empresa')} disabled={isLoading}>
              <Text style={styles.footer}>
                Cadastre sua <Text style={styles.corlink}>Empresa.</Text>
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
  container: { flex: 1, backgroundColor: '#001f2d' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: 24 },
  form: { width: '100%' },
  label: { fontSize: 14, color: '#ffffff', marginBottom: 8, marginTop: 4, fontWeight: '500' },
  input: { backgroundColor: '#d4e4e4', borderRadius: 8, padding: 14, fontSize: 16, color: '#333333', marginBottom: 16 },
  cadastroButton: { backgroundColor: '#a8d5d5', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 8, marginBottom: 16 },
  cadastroButtonDisabled: { opacity: 0.7 },
  cadastroButtonText: { color: '#0f4a4a', fontSize: 16, fontWeight: 'bold' },
  corlink: { color: '#3694AD' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  loginText: { color: '#b8d8d8', fontSize: 13 },
  footer: { color: '#b8d8d8', fontSize: 12, textAlign: 'center' },
});