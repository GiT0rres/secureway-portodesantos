import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  ScrollView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '@/components/BottomNav';

export default function PerfilMotorista() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5a8a8a" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com foto e nome */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
          
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileImageText}>SA</Text>
            </View>
          </View>
          
          <Text style={styles.nome}>Sérgio Andrade</Text>
          <Text style={styles.ocupacao}>Motorista</Text>
        </View>

        {/* Abas de navegação */}
        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tabActive}>
            <Text style={styles.tabTextActive}>Caminhos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Histórico</Text>
          </TouchableOpacity>
        </View>

        {/* Cards de informações */}
        <View style={styles.cardsContainer}>
          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Marca</Text>
              <Text style={styles.cardValue}>-</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Placa</Text>
              <Text style={styles.cardValue}>-</Text>
            </View>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Modelo</Text>
              <Text style={styles.cardValue}>-</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Etiqueta Autodestrutiva</Text>
              <Text style={styles.cardValue}>-</Text>
            </View>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.cardFullWidth}>
              <Text style={styles.cardLabel}>Cor</Text>
              <Text style={styles.cardValue}>-</Text>
            </View>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    backgroundColor: '#5a8a8a',
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 8,
  },
  settingsIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  profileImageContainer: {
    marginBottom: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#3a5a5a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  ocupacao: {
    fontSize: 14,
    color: '#d0e0e0',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#001f2d',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 8,
    borderBottomWidth:2,
    borderBottomColor: '#1590a5ff',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    color: '#5a8a8a',
    fontWeight: '500',
  },
  tabTextActive: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  cardsContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#134949',
    borderRadius: 8,
    padding: 16,
    minHeight: 70,
  },
  cardFullWidth: {
    flex: 1,
    backgroundColor: '#134949',
    borderRadius: 8,
    padding: 16,
    minHeight: 70,
  },
  cardLabel: {
    fontSize: 12,
    color: '#a0c4c4',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
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