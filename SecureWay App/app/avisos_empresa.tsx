import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import BottomNav from "@/components/BottomNav";

export default function Avisos() {
  // Mock de avisos (pode puxar do banco depois)
  const avisos = [
    { id: 1, text: "Entrega feita com sucesso" },
    { id: 2, text: "Problema de acesso" },
    { id: 3, text: "" },
    { id: 4, text: "" },
    { id: 5, text: "" },
  ];

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Avisos</Text>
        </View>

        {/* Lista de Avisos */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {avisos.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardText}>
                {item.text || "Mensagem de aviso"}
              </Text>
              <Text style={styles.alertIcon}>⚠️</Text>
            </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4d6666",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cardText: {
    color: "#ffffff",
    fontSize: 15,
  },
  alertIcon: {
    fontSize: 20,
    color: "#ffffff",
  },
});
