import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '@/components/BottomNav';
import { db } from '@/services/firebase.config';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface Empresa {
  id: string;
  nomeCompleto: string;
  telefone?: string;
  email?: string;
  cnpj?: string;
  createdAt?: string;
}

export default function EmpresasSalvas() {
  const router = useRouter();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroAtivo, setFiltroAtivo] = useState<'empresa' | 'contato'>('empresa');

  useEffect(() => {
    carregarEmpresas();
  }, []);

  const carregarEmpresas = async () => {
    try {
      console.log("📡 Buscando empresas no Firestore...");
      const q = query(collection(db, 'usuarios'), where('tipo', '==', 'empresa'));
      const snapshot = await getDocs(q);

      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Empresa[];

      console.log(`✅ ${lista.length} empresas encontradas`);
      setEmpresas(lista);
    } catch (error) {
      console.error('❌ Erro ao buscar empresas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as empresas salvas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />

      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Empresas Salvas</Text>

          {/* Filtros */}
          <View style={styles.filtros}>
            <TouchableOpacity 
              style={[
                styles.filtroButton, 
                filtroAtivo === 'empresa' && styles.filtroButtonActive
              ]}
              onPress={() => setFiltroAtivo('empresa')}
            >
              <Text style={[
                styles.filtroText,
                filtroAtivo === 'empresa' && styles.filtroTextActive
              ]}>
                CNPJ
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filtroButton,
                filtroAtivo === 'contato' && styles.filtroButtonActive
              ]}
              onPress={() => setFiltroAtivo('contato')}
            >
              <Text style={[
                styles.filtroText,
                filtroAtivo === 'contato' && styles.filtroTextActive
              ]}>
                Contatos
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Conteúdo */}
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5a8a8a" />
              <Text style={styles.loadingText}>Carregando empresas...</Text>
            </View>
          ) : empresas.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhuma empresa salva ainda</Text>
            </View>
          ) : (
            empresas.map((empresa) => (
              <TouchableOpacity 
                key={empresa.id} 
                style={styles.empresaCard}
                activeOpacity={0.7}
                onPress={() => Alert.alert(
                  empresa.nomeCompleto,
                  filtroAtivo === 'empresa'
                    ? `CNPJ: ${empresa.cnpj || 'N/A'}`
                    : `📞 ${empresa.telefone || 'N/A'}\n📧 ${empresa.email || 'N/A'}`
                )}
              >
                <View style={styles.empresaContent}>
                  <Text style={styles.empresaNome}>{empresa.nomeCompleto}</Text>
                  {filtroAtivo === 'empresa' ? (
                    <Text style={styles.empresaEndereco}>CNPJ: {empresa.cnpj || '—'}</Text>
                  ) : (
                    <Text style={styles.empresaEndereco}>
                      Contato: {empresa.telefone || '—'}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001f2d' },
  scrollContainer: { flex: 1 },
  header: {
    backgroundColor: '#001f2d',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomColor: '#145f82ff',
    borderBottomWidth: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  filtros: {
    flexDirection: 'row',
    gap: 12,
  },
  filtroButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#2a4d4d',
  },
  filtroButtonActive: {
    backgroundColor: '#5a8a8a',
  },
  filtroText: {
    fontSize: 12,
    color: '#d0e0e0',
  },
  filtroTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    padding: 12,
  },
  empresaCard: {
    backgroundColor: '#003d4d',
    borderRadius: 8,
    marginBottom: 14,
    overflow: 'hidden',
    borderColor: '#1590a5ff',
    borderWidth: 1.5,
  },
  empresaContent: {
    padding: 16,
  },
  empresaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  empresaEndereco: {
    fontSize: 14,
    color: '#d0e0e0',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  loadingText: {
    marginTop: 12,
    color: '#5a8a8a',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#5a8a8a',
  },
});
