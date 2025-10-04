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

export default function CadastroVeiculo() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

const formatarTelefone = (text: string) => {
  // Mantém apenas números
  const numeros = text.replace(/\D/g, '');

  if (numeros.length <= 2) {
    setTelefone(numeros);
  } else if (numeros.length <= 6) {
    setTelefone(`(${numeros.slice(0, 2)}) ${numeros.slice(2)}`);
  } else if (numeros.length <= 10) {
    // Formato fixo: (XX) XXXX-XXXX
    setTelefone(`(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6, 10)}`);
  } else {
    // Formato celular: (XX) XXXXX-XXXX
    setTelefone(`(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`);
  }
};


  const handleEnviar = () => {
    console.log('Cadastro Da Empresa:', { nome, cnpj, endereco, telefone, email, senha });
    // Adicione sua lógica de cadastro aqui
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
              placeholder=""
              placeholderTextColor="#5a8a8a"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#5a8a8a"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#5a8a8a"
              value={telefone}
              onChangeText={formatarTelefone}
              autoCapitalize="characters"
              maxLength={15}
            />

            <Text style={styles.label}>CNPJ</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#5a8a8a"
              value={cnpj}
              onChangeText={setCnpj}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#5a8a8a"
              value={senha}
              onChangeText={setSenha}
              autoCapitalize="words"
            />

            <TouchableOpacity 
              style={styles.enviarButton}
              onPress={handleEnviar}
              activeOpacity={0.8}
            >
              <Text style={styles.enviarButtonText}>Cadastrar</Text>
            </TouchableOpacity>
            
            
            <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={styles.loginText}>Já possui uma conta? Faça o <Text style={styles.loginLink}>Login.</Text></Text>
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
    marginTop: 16,
    textAlign: 'center'
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
  enviarButtonText: {
    color: '#0a3d3d',
    fontSize: 16,
    fontWeight: 'bold',
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