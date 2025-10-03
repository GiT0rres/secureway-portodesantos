import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  ScrollView,
  FlatList
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
  
  // Dados de exemplo - você pode substituir por dados reais
  const [empresas, setEmpresas] = useState<Empresa[]>([
    { id: '1', nome: 'Empresa 1', endereco: 'Endereço da empresa 1' },
    { id: '2', nome: 'Empresa 2', endereco: 'Endereço da empresa 2' },
    { id: '3', nome: 'Empresa 3', endereco: 'Endereço da empresa 3' },
    { id: '4', nome: 'Empresa 4', endereco: 'Endereço da empresa 4' },
  ]);

  const [filtroAtivo, setFiltroAtivo] = useState<'empresa' | 'contato'>('empresa');

  const renderEmpresa = ({ item }: { item: Empresa }) => (
    <TouchableOpacity style={styles.empresaCard} activeOpacity={0.7}>
      <View style={styles.empresaContent}>
        <Text style={styles.empresaNome}>{item.nome}</Text>
        <Text style={styles.empresaEndereco}>{item.endereco}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />
      
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
          <FlatList
            data={empresas}
            renderItem={renderEmpresa}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

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
  header: {
    backgroundColor: '#0a3d3d',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
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
    flex: 1,
    backgroundColor: '#0a3d3d',
  },
  listContainer: {
    padding: 12,
    paddingBottom: 80,
  },
  empresaCard: {
    backgroundColor: '#5a7a7a',
    borderRadius: 8,
    marginBottom: 12,
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
  },
  emptyText: {
    fontSize: 16,
    color: '#5a8a8a',
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0a3d3d',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#1a5c5c',
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