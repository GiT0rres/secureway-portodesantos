import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '@/components/BottomNav';

interface Empresa {
  id: string;
  nome: string;
  endereco: string;
}

export default function EmpresasSalvas() {
  const router = useRouter();
  
  const [empresas, setEmpresas] = useState<Empresa[]>([
    { id: '1', nome: 'Empresa 1', endereco: 'Endereço da empresa 1' },
    { id: '2', nome: 'Empresa 2', endereco: 'Endereço da empresa 2' },
    { id: '3', nome: 'Empresa 3', endereco: 'Endereço da empresa 3' },
    { id: '4', nome: 'Empresa 4', endereco: 'Endereço da empresa 4' },
  ]);

  const [filtroAtivo, setFiltroAtivo] = useState<'empresa' | 'contato'>('empresa');

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
                Empresa tal endereço
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
                contato
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de empresas */}
        <View style={styles.content}>
          {empresas.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhuma empresa salva ainda</Text>
            </View>
          ) : (
            empresas.map((item) => (
              <TouchableOpacity key={item.id} style={styles.empresaCard} activeOpacity={0.7}>
                <View style={styles.empresaContent}>
                  <Text style={styles.empresaNome}>{item.nome}</Text>
                  <Text style={styles.empresaEndereco}>{item.endereco}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Barra de navegação inferior */}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001f2d',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#001f2d',
    paddingTop: 60, // aumentei o espaço do topo
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
    backgroundColor: '#5a8a8a',
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
    backgroundColor: '#5a7a7a',
    borderRadius: 8,
    marginBottom: 14,
    overflow: 'hidden',
    minHeight: 100,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#5a8a8a',
    textAlign: 'center',
  },
});
