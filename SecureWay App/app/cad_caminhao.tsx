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
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cor, setCor] = useState('');
  const [placa, setPlaca] = useState('');
  const [etiqueta, setEtiqueta] = useState('');

  const formatarPlaca = (text: string) => {
    // Remove caracteres não alfanuméricos
    const limpo = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    //teste
    // Formato ABC-1234 ou ABC1D23
    if (limpo.length <= 7) {
      if (limpo.length > 3) {
        setPlaca(`${limpo.slice(0, 3)}-${limpo.slice(3, 7)}`);
      } else {
        setPlaca(limpo);
      }
    }
  };

  const handleEnviar = () => {
    console.log('Cadastro Veículo:', { marca, modelo, cor, placa, etiqueta });
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
            <Text style={styles.title}>SecureWay</Text>
            <Text style={styles.subtitle}>Complete seu caminho</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Marca</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#5a8a8a"
              value={marca}
              onChangeText={setMarca}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Modelo</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#5a8a8a"
              value={modelo}
              onChangeText={setModelo}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Cor</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#5a8a8a"
              value={cor}
              onChangeText={setCor}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Placa</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#5a8a8a"
              value={placa}
              onChangeText={formatarPlaca}
              autoCapitalize="characters"
              maxLength={8}
            />

            <Text style={styles.label}>Etiqueta Autodestrutiva</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#5a8a8a"
              value={etiqueta}
              onChangeText={setEtiqueta}
              autoCapitalize="characters"
            />

            <TouchableOpacity 
              style={styles.enviarButton}
              onPress={handleEnviar}
              activeOpacity={0.8}
            >
              <Text style={styles.enviarButtonText}>Enviar</Text>
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
    backgroundColor: '#0a3d3d',
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