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

export default function CaminhoesCadastrados() {
  // Mock de caminhões (depois você pode puxar do banco de dados)
  const caminhoes = [
    { id: 1, modelo: "Volvo FH 540", detalhe: "Placa: ABC-1234" },
    { id: 2, modelo: "Scania R450", detalhe: "Placa: XYZ-5678" },
    { id: 3, modelo: "Mercedes Actros", detalhe: "Placa: JKL-9988" },
    { id: 4, modelo: "Iveco Daily", detalhe: "Placa: TUV-4321" },
    { id: 5, modelo: "Volkswagen Constellation", detalhe: "Placa: MNO-1111" },
  ];

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Caminhões Cadastrados</Text>
        </View>

        {/* Lista de Caminhões */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {caminhoes.map((caminhao) => (
            <TouchableOpacity key={caminhao.id} style={styles.card}>
              <Text style={styles.cardNome}>{caminhao.modelo}</Text>
              <Text style={styles.cardDetalhe}>{caminhao.detalhe}</Text>
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
    paddingBottom: 100,
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
