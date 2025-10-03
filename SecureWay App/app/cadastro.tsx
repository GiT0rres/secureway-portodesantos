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
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '@/components/BottomNav';

export default function Cadastro() {
  const router = useRouter();
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = () => {
    console.log('Cadastro:', { nomeCompleto, email, telefone, senha });
    // Adicione sua lógica de cadastro aqui
  };

  const formatarTelefone = (text: string) => {
    // Remove tudo que não é número
    const numeros = text.replace(/\D/g, '');
    
    // Formata para (XX) XXXXX-XXXX
    if (numeros.length <= 11) {
      let formatado = numeros;
      if (numeros.length > 2) {
        formatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
      }
      if (numeros.length > 7) {
        formatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
      }
      setTelefone(formatado);
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
          <View style={styles.card}>
            <Text style={styles.title}>Cadastro</Text>
            
            <View style={styles.form}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                placeholderTextColor="#5a8a8a"
                value={nomeCompleto}
                onChangeText={setNomeCompleto}
                autoCapitalize="words"
              />

              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                placeholderTextColor="#5a8a8a"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                placeholderTextColor="#5a8a8a"
                value={telefone}
                onChangeText={formatarTelefone}
                keyboardType="phone-pad"
                maxLength={15}
              />

              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                placeholderTextColor="#5a8a8a"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                autoCapitalize="none"
              />

              <TouchableOpacity 
                style={styles.cadastroButton}
                onPress={handleCadastro}
                activeOpacity={0.8}
              >
                <Text style={styles.cadastroButtonText}>Cadastrar</Text>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Já possui uma conta? </Text>
                <TouchableOpacity onPress={() => router.push('/')}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.footer}>Cadastre-se!</Text>
            </View>
            <BottomNav />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a3d3d',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#0f4a4a',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
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
  cadastroButton: {
    backgroundColor: '#a8d5d5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  cadastroButtonText: {
    color: '#0f4a4a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginText: {
    color: '#b8d8d8',
    fontSize: 13,
  },
  loginLink: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  footer: {
    color: '#b8d8d8',
    fontSize: 12,
    textAlign: 'center',
  },
});