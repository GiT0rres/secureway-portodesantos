import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import BottomNav from "@/components/BottomNav";

export default function MotoristasCadastrados() {
  // Mock de motoristas (pode vir do backend depois)
  const motoristas = [
    { id: 1, nome: "Sérgio Andrade", detalhe: "Motorista - Caminhão Volvo" },
    { id: 2, nome: "Marcos Lima", detalhe: "Motorista - Scania R450" },
    { id: 3, nome: "Ana Souza", detalhe: "Motorista - Iveco Daily" },
    { id: 4, nome: "Carlos Pereira", detalhe: "Motorista - Mercedes Actros" },
    { id: 5, nome: "João Silva", detalhe: "Motorista - Volkswagen Constellation" },
  ];

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Motoristas Cadastrados</Text>
        </View>

        {/* Lista de Motoristas */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {motoristas.map((motorista) => (
            <TouchableOpacity key={motorista.id} style={styles.card}>
              <Text style={styles.cardNome}>{motorista.nome}</Text>
              <Text style={styles.cardDetalhe}>{motorista.detalhe}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Navigation fixo */}
      <BottomNav />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001f2d",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "#00323c",
    borderBottomWidth: 1,
    borderBottomColor: "#1a5c5c",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // deixa espaço pro bottom nav
  },
  card: {
    backgroundColor: "#3c5656",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardNome: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDetalhe: {
    color: "#d4e4e4",
    fontSize: 14,
    marginTop: 4,
  },
});
